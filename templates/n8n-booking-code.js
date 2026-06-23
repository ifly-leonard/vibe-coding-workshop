/**
 * Booking confirmation code — encode / decode
 *
 * Format: VPL26-{base64url(paymentId) in 4-char groups}
 * Example: pay_T3T71lKyq5U0YQ → VPL26-cGF5-X1Qz-VDcx-bEt5-cTVV-MFlR
 *
 * ── n8n Code node (run before Send Email) ──────────────────────────
 *
 * const paymentId = $json.paymentId
 *   ?? $json.id
 *   ?? $json.payload?.payment?.entity?.id;
 *
 * if (!paymentId) throw new Error('Missing Razorpay payment ID');
 *
 * return [{
 *   json: {
 *     paymentId,
 *     confirmationCode: encodeBookingCode(paymentId),
 *     customerName: $json.customerName ?? $json.name ?? '',
 *     customerEmail: $json.customerEmail ?? $json.email ?? '',
 *   },
 * }];
 */

const BOOKING_CODE_PREFIX = "VPL26-";

function encodeBookingCode(paymentId) {
  if (!paymentId || typeof paymentId !== "string") {
    throw new Error("paymentId must be a non-empty string");
  }

  const encoded = Buffer.from(paymentId, "utf8").toString("base64url");
  const chunks = encoded.match(/.{1,4}/g) ?? [];

  return BOOKING_CODE_PREFIX + chunks.join("-");
}

function decodeBookingCode(code) {
  if (!code || typeof code !== "string") {
    throw new Error("code must be a non-empty string");
  }

  const normalized = code.trim().toUpperCase();
  if (!normalized.startsWith(BOOKING_CODE_PREFIX)) {
    throw new Error(`Code must start with ${BOOKING_CODE_PREFIX}`);
  }

  const payload = normalized.slice(BOOKING_CODE_PREFIX.length).replace(/-/g, "");

  return Buffer.from(payload, "base64url").toString("utf8");
}

module.exports = { encodeBookingCode, decodeBookingCode, BOOKING_CODE_PREFIX };

if (require.main === module) {
  const paymentId = process.argv[2] ?? "pay_T3T71lKyq5U0YQ";
  const code = encodeBookingCode(paymentId);
  console.log("Payment ID:", paymentId);
  console.log("Code:      ", code);
  console.log("Decoded:   ", decodeBookingCode(code));
}
