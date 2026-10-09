// The documented 1.0.0 boundary is a future condition, not a current stability claim.
// Remove only that complete, explicit clause; any other native-production assertion
// in the same page is still checked.
export function claimsNativeProductionReady(text) {
  const current = String(text).replace(/native UI rendering as production[- ]ready only from 1\.0\.0/gi, "");
  return /native[^.]{0,80}production.ready|production.ready[^.]{0,80}native/i.test(current);
}
