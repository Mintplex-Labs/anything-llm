import tiktoken

encoder = tiktoken.encoding_for_model("text-embedding-ada-002")


def tokenize(full_text):
    return encoder.encode(full_text)


def ada_v2_cost(token_count):
    rate_per = 0.0004 / 1_000  # $0.0004 / 1K tokens
    total = token_count * rate_per
    return f"${total:,.2f}" if total >= 0.01 else "< $0.01"
