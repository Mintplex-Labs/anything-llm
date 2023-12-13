import tiktoken
encoder = tiktoken.encoding_for_model("text-embedding-ada-002")

def tokenize(fullText):
  return encoder.encode(fullText)

def ada_v2_cost(tokenCount):
  rate_per = 0.0004 / 1_000 # $0.0004 / 1K tokens
  total = tokenCount * rate_per
  return '${:,.2f}'.format(total) if total >= 0.01 else '< $0.01'