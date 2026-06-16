import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { VIBE_EXPERIENCE_OPTIONS } from "../reservation.constants";

const experienceValues = VIBE_EXPERIENCE_OPTIONS.map((o) => o.value) as [
  (typeof VIBE_EXPERIENCE_OPTIONS)[number]["value"],
  ...(typeof VIBE_EXPERIENCE_OPTIONS)[number]["value"][],
];

const registrationFields = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number")
    .regex(/^[+\d\s-]+$/, "Enter a valid phone number"),
  experience: z.enum(experienceValues),
});

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator(registrationFields)
  .handler(async ({ data }) => {
    const { getRazorpayClient, getRazorpayConfig, getTicketAmountPaise } = await import("../razorpay.server");

    const referenceId = `VPL-${Date.now().toString(36).toUpperCase()}`;
    const { keyId } = getRazorpayConfig();
    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
      amount: getTicketAmountPaise(),
      currency: "INR",
      receipt: referenceId,
      notes: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        experience: data.experience,
      },
    });

    return {
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      referenceId,
    };
  });

export const completeReservation = createServerFn({ method: "POST" })
  .inputValidator(
    registrationFields.extend({
      acceptedTerms: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms and conditions" }),
      }),
      razorpayOrderId: z.string().min(1),
      razorpayPaymentId: z.string().min(1),
      razorpaySignature: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { verifyRazorpaySignature } = await import("../razorpay.server");

    const isValid = verifyRazorpaySignature(data.razorpayOrderId, data.razorpayPaymentId, data.razorpaySignature);
    if (!isValid) {
      throw new Error("Payment verification failed.");
    }

    const referenceId = `VPL-${data.razorpayPaymentId.slice(-8).toUpperCase()}`;

    console.info("[reservation:paid]", referenceId, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      experience: data.experience,
      orderId: data.razorpayOrderId,
      paymentId: data.razorpayPaymentId,
    });

    return {
      ok: true as const,
      referenceId,
    };
  });
