import { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import System from "@/models/system";
import { groupDroppedFiles, groupFilesIntoFolder } from "@/utils/folderUpload";

/**
 * The queue of in-flight uploads, shared by every drop target in the picker.
 *
 * There are two ways to start an upload and they must feed the same queue and
 * the same progress list: the dropzone under the picker, where the drop's own
 * folder structure decides the destination, and an individual folder row,
 * where the user has named the destination by dropping onto it.
 */
export default function useUploadQueue() {
  /** Whether the document processor is up; nothing can be uploaded if not. */
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    let cancelled = false;
    System.checkDocumentProcessorOnline().then((online) => {
      if (!cancelled) setReady(online);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Queue a drop on the main dropzone. Loose files land in custom-documents;
   * a dropped folder becomes a folder of the same name.
   * @param {File[]} accepted
   * @param {Array<{file: File, errors: Array<{code: string}>}>} rejections
   */
  const enqueueDrop = useCallback((accepted = [], rejections = []) => {
    const grouped = groupDroppedFiles(accepted);
    setFiles([
      ...grouped.looseFiles.map((file) => ({ uid: v4(), file })),
      ...grouped.folders.flatMap(({ folderName, files: folderFiles }) =>
        folderFiles.map(({ file, relativePath }) => ({
          uid: v4(),
          file,
          folderName,
          relativePath,
        }))
      ),
      ...rejections.map((rejection) => ({
        uid: v4(),
        file: rejection.file,
        rejected: true,
        reason: rejection.errors[0].code,
      })),
    ]);
  }, []);

  /**
   * Queue a drop that was aimed at a specific folder row.
   * @param {File[]} accepted
   * @param {string} folderName
   * @returns {{queued: number, skipped: number}}
   */
  const enqueueIntoFolder = useCallback((accepted = [], folderName) => {
    const { files: targeted, skipped } = groupFilesIntoFolder(
      accepted,
      folderName
    );
    if (targeted.length > 0) {
      setFiles(
        targeted.map(({ file, relativePath }) => ({
          uid: v4(),
          file,
          folderName,
          relativePath,
        }))
      );
    }
    return { queued: targeted.length, skipped };
  }, []);

  return { ready, files, setFiles, enqueueDrop, enqueueIntoFolder };
}
