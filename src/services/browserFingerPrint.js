import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedFingerprint = null;

export const getBrowserFingerprint = async () => {
  if (cachedFingerprint) return cachedFingerprint;

  const stored = localStorage.getItem("browser_fingerprint");
  if (stored) {
    cachedFingerprint = stored;
    return stored;
  }

  const fp = await FingerprintJS.load();
  const result = await fp.get();

  cachedFingerprint = result.visitorId;
  localStorage.setItem("browser_fingerprint", result.visitorId);
  console.log(result.visitorId);

  return result.visitorId;
};
