// When running locally will occupy the 0.0.0.0 hostname space but when deployed inside
// of docker this endpoint is not exposed so it is only on the Docker instances internal network
// so no additional security is needed on the endpoint directly. Auth is done however by the express
// middleware prior to leaving the node-side of the application so that is good enough >:)
const PROCESSOR_API = "http://0.0.0.0:8888";
async function checkProcessorAlive() {
  return await fetch(`${PROCESSOR_API}`)
    .then((res) => res.ok)
    .catch((e) => false);
}

async function acceptedFileTypes() {
  return await fetch(`${PROCESSOR_API}/accepts`)
    .then((res) => {
      if (!res.ok) throw new Error("Could not reach");
      return res.json();
    })
    .then((res) => res)
    .catch(() => null);
}

async function processDocument(filename = "") {
  if (!filename) return false;
  return await fetch(`${PROCESSOR_API}/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Response could not be completed");
      return res.json();
    })
    .then((res) => res)
    .catch((e) => {
      console.log(e.message);
      return { success: false, reason: e.message, documents: [] };
    });
}

async function processLink(link = "") {
  if (!link) return false;
  return await fetch(`${PROCESSOR_API}/process-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ link }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Response could not be completed");
      return res.json();
    })
    .then((res) => res)
    .catch((e) => {
      console.log(e.message);
      return { success: false, reason: e.message, documents: [] };
    });
}

// We will not ever expose the document processor to the frontend API so instead we relay
// all requests through the server. You can use this function to directly expose a specific endpoint
// on the document processor.
async function forwardExtensionRequest({ endpoint, method, body }) {
  return await fetch(`${PROCESSOR_API}${endpoint}`, {
    method,
    body, // Stringified JSON!
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Response could not be completed");
      return res.json();
    })
    .then((res) => res)
    .catch((e) => {
      console.log(e.message);
      return { success: false, data: {}, reason: e.message };
    });
}

module.exports = {
  checkProcessorAlive,
  processDocument,
  processLink,
  acceptedFileTypes,
  forwardExtensionRequest,
};
