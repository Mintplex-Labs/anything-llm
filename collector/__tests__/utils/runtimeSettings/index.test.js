/* eslint-env jest, node */
const RuntimeSettings = require("../../../utils/runtimeSettings");

const WEBRTC_POLICY_ARG =
  "--force-webrtc-ip-handling-policy=disable_non_proxied_udp";
const FAKE_DEVICE_ARG = "--use-fake-device-for-media-stream";

function freshSettings() {
  RuntimeSettings._instance = null;
  return new RuntimeSettings();
}

describe("RuntimeSettings browserLaunchArgs", () => {
  it("applies the WebRTC privacy flags by default", () => {
    const settings = freshSettings();
    expect(settings.get("browserLaunchArgs")).toEqual([
      WEBRTC_POLICY_ARG,
      FAKE_DEVICE_ARG,
    ]);
  });

  it("keeps the privacy flags when no custom args are set", () => {
    const settings = freshSettings();
    settings.set("browserLaunchArgs", []);
    expect(settings.get("browserLaunchArgs")).toEqual([
      WEBRTC_POLICY_ARG,
      FAKE_DEVICE_ARG,
    ]);
  });

  it("keeps the privacy flags alongside custom array args", () => {
    const settings = freshSettings();
    settings.set("browserLaunchArgs", ["--no-sandbox"]);
    expect(settings.get("browserLaunchArgs")).toEqual([
      WEBRTC_POLICY_ARG,
      FAKE_DEVICE_ARG,
      "--no-sandbox",
    ]);
  });

  it("keeps the privacy flags alongside comma-separated string args", () => {
    const settings = freshSettings();
    settings.set("browserLaunchArgs", "--no-sandbox, --disable-gpu");
    expect(settings.get("browserLaunchArgs")).toEqual([
      WEBRTC_POLICY_ARG,
      FAKE_DEVICE_ARG,
      "--no-sandbox",
      "--disable-gpu",
    ]);
  });

  it("does not duplicate flags the caller already passed", () => {
    const settings = freshSettings();
    settings.set("browserLaunchArgs", [WEBRTC_POLICY_ARG]);
    expect(settings.get("browserLaunchArgs")).toEqual([
      WEBRTC_POLICY_ARG,
      FAKE_DEVICE_ARG,
    ]);
  });
});
