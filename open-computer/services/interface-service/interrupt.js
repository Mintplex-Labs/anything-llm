// Interrupt queue: when the loop detector or user fires an interrupt, the
// next proxied LLM request injects this as a synthetic assistant response
// instead of forwarding to the real provider.  Consumed once then cleared.

let _pendingInterrupt = null;

function setPendingInterrupt(text) {
  _pendingInterrupt = text;
}

function getPendingInterrupt() {
  return _pendingInterrupt;
}

function clearPendingInterrupt() {
  _pendingInterrupt = null;
}

module.exports = { setPendingInterrupt, getPendingInterrupt, clearPendingInterrupt };
