// Test the YoutubeTranscript class

const { YoutubeTranscript } = require("./youtube-transcript.js");

(async () => {
  try {
    console.log("Testing YouTube transcript with video BJjsfNO5JTo...");
    const transcript = await YoutubeTranscript.fetchTranscript("BJjsfNO5JTo", {
      lang: "en",
    });
    console.log("Success! Transcript length:", transcript.length);
    console.log("First 200 characters:", transcript.substring(0, 200) + "...");
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
