import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io
import os
import cv2
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys
import json
import uuid
import shutil
import traceback
import time
import multiprocessing
import re
import ftfy
import html

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

# ========== CONFIG ==========
CPU_CORES = multiprocessing.cpu_count()
PREPROCESS_WORKERS = min(4, max(1, CPU_CORES // 2))
OCR_WORKERS = min(4, max(1, CPU_CORES // 2))
OCR_TOTAL_TIMEOUT = 10 * 60  # 10 phút

# ========== PATTERNS (watermark, rác) ==========
BAD_PATTERNS = [
    r"Click to buy NOW",
    r"PDF-XChange",
    r"www\.docu-track\.com",
    r"http://www\.pdfxviewer\.com",
]

# =============================================
# DPI lựa chọn theo kích thước file
# =============================================
def choose_dpi(pdf_path):
    try:
        size_mb = os.path.getsize(pdf_path) / (1024 * 1024)
        if size_mb < 2:
            return 120
        elif size_mb < 10:
            return 150
        else:
            return 200
    except Exception:
        return 150


# =============================================
# CLEAN OCR TEXT (chống lỗi mã hóa)
# =============================================
def clean_ocr_text(text: str):
    """Sửa lỗi mã hóa UTF-8, ký tự rác và chuẩn hóa khoảng trắng."""
    if not text:
        return ""
    text = ftfy.fix_text(text)
    text = html.unescape(text)
    # Loại bỏ ký tự không in được
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7EÀ-ỹ]", "", text)
    # Chuẩn hóa khoảng trắng
    text = re.sub(r" +", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# =============================================
# OCR helper functions
# =============================================
def correct_orientation(img: Image.Image):
    """Phát hiện chiều xoay của ảnh và xoay lại nếu cần."""
    try:
        osd = pytesseract.image_to_osd(img)
        rotate_angle = int(osd.split("Rotate:")[1].split("\n")[0].strip())
        return img.rotate(-rotate_angle, expand=True)
    except Exception:
        return img


def preprocess_image_for_ocr_safe(img: Image.Image):
    """Tăng chất lượng ảnh OCR, loại watermark mờ."""
    try:
        arr = np.array(img.convert("RGB"))
        gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)

        # Binarize để loại watermark mờ
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # CLAHE nếu ảnh mờ
        std_gray = np.std(gray)
        if std_gray < 40:
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            binary = clahe.apply(binary)

        return Image.fromarray(binary), {"fast_path": std_gray > 40}
    except Exception:
        return img.convert("L"), {"fast_path": True}


def _choose_text_by_quality(img_orig_pil, img_proc_pil, info, lang="vie+eng"):
    """So sánh OCR giữa ảnh gốc và ảnh xử lý, chọn text dài nhất."""
    psm_modes = [3, 6]
    results = []
    for psm in psm_modes:
        conf = f"--psm {psm} --oem 3"
        for im in [img_orig_pil, img_proc_pil]:
            if im is None:
                continue
            try:
                txt = pytesseract.image_to_string(im, lang=lang, config=conf)
                txt = clean_ocr_text(txt)
                if len(txt.strip()) > 20:
                    results.append((len(txt), txt))
            except Exception:
                continue
    if not results:
        return ""
    results.sort(key=lambda x: x[0], reverse=True)
    return results[0][1]


# =============================================
# Kiểm tra text có bị lỗi / watermark
# =============================================
def is_text_gibberish(text):
    """Kiểm tra text có bị lỗi mã hóa, watermark hay rác không."""
    if not text or len(text.strip()) < 80:
        return True
    if any(re.search(pat, text, re.IGNORECASE) for pat in BAD_PATTERNS):
        return True
    total = len(text)
    weird = len(re.findall(r"[^\w\sÀ-ỹ.,:/\-]", text))
    if weird / max(1, total) > 0.25:
        return True
    if text.count("\n") > len(text) / 8:
        return True
    return False


# =============================================
# Xử lý từng trang (hybrid)
# =============================================
def extract_page_text_hybrid(page, idx, temp_output_dir, lang="vie+eng"):
    """Thử lấy text thật, nếu lỗi → OCR."""
    try:
        native_text = page.get_text("text").strip()
        if not is_text_gibberish(native_text):
            return idx, clean_ocr_text(native_text), "native"

        # Nếu text lỗi → OCR
        DPI = choose_dpi(temp_output_dir)
        mat = fitz.Matrix(DPI / 72, DPI / 72)
        pix = page.get_pixmap(matrix=mat, alpha=False, colorspace=fitz.csGRAY)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        img = correct_orientation(img)
        img_proc, info = preprocess_image_for_ocr_safe(img)
        text = _choose_text_by_quality(img, img_proc, info, lang)
        return idx, text, "ocr"
    except Exception:
        return idx, "", "error"


# =============================================
# MAIN HYBRID FLOW
# =============================================
def extract_text_from_pdf_hybrid(pdf_path, lang="vie+eng"):
    """Hybrid: dùng text thật nếu ổn, fallback OCR từng trang."""
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    results = [""] * total_pages
    methods = [""] * total_pages
    temp_output_dir = f"output_pages_{uuid.uuid4().hex[:8]}"
    os.makedirs(temp_output_dir, exist_ok=True)

    with ThreadPoolExecutor(max_workers=PREPROCESS_WORKERS) as ex:
        futures = [ex.submit(extract_page_text_hybrid, page, i, temp_output_dir, lang)
                   for i, page in enumerate(doc)]
        for fut in as_completed(futures):
            idx, txt, method = fut.result()
            results[idx] = txt.strip()
            methods[idx] = method

    doc.close()
    shutil.rmtree(temp_output_dir, ignore_errors=True)

    # Ghép text
    full_text = ""
    for i, t in enumerate(results):
        full_text += f"\n{'='*60}\nTRANG {i+1}\n{'='*60}\n{t}\n"

    # Thống kê
    method_counts = {m: methods.count(m) for m in set(methods)}
    return full_text, method_counts


# =============================================
# MAIN ENTRY
# =============================================
def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing PDF path"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    start_time = time.time()

    try:
        sys.stderr.write(f"🔎 Running hybrid OCR on: {pdf_path}\n")
        text, method_counts = extract_text_from_pdf_hybrid(pdf_path, lang="vie+eng")

        result = {
            "file": pdf_path,
            "texts": [text],
            "method": "hybrid",
            "stats": method_counts
        }
        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        tb = traceback.format_exc()
        sys.stderr.write(tb + "\n")
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
    finally:
        if time.time() - start_time > OCR_TOTAL_TIMEOUT:
            sys.stderr.write("⚠️ OCR total timeout exceeded\n")


if __name__ == "__main__":
    main()
