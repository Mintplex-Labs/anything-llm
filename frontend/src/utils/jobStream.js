const API_BASE = process.env.API_BASE || "/api";

/**
 * Subscribe to document processing job updates via SSE.
 * Automatically reconnects on failure.
 * @param {string} jobId
 * @param {(status:string)=>void} onStatus
 * @returns {() => void} cleanup function
 */
function listenToJob(jobId, onStatus) {
  let es;
  const connect = () => {
    es = new EventSource(`${API_BASE}/document/${jobId}/events`, {
      withCredentials: true,
    });
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data?.status) {
          onStatus(data.status.toUpperCase());
        }
      } catch (err) {
        // ignore invalid messages
      }
    };
    es.onerror = () => {
      es.close();
      setTimeout(connect, 3000);
    };
  };
  connect();
  return () => es && es.close();
}

module.exports = { listenToJob };
