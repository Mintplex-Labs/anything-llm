const PYTHON_API = "http://0.0.0.0:8888";
async function checkPythonAppAlive() {
  return await fetch(`${PYTHON_API}`)
    .then((res) => res.ok)
    .catch((e) => false);
}

async function acceptedFileTypes() {
  return await fetch(`${PYTHON_API}/accepts`)
    .then((res) => {
      if (!res.ok) throw new Error("Could not reach");
      return res.json();
    })
    .then((res) => res)
    .catch(() => null);
}

async function processDocument(filename = "") {
  if (!filename) return false;
  return await fetch(`${PYTHON_API}/process`, {
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
      return { success: false, reason: e.message };
    });
}

module.exports = {
  checkPythonAppAlive,
  processDocument,
  acceptedFileTypes,
};
