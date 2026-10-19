/**
    AI Assistance Disclosure:
    Tool: ChatGPT (GPT-6), date: 2026-10-19
    Scope: Mailjet welcome-email sender tests
    Author review: Pending
**/
import assert from "node:assert/strict";
import test from "node:test";

import type { SendMailOptions } from "nodemailer";

import {
  createMailjetWelcomeEmailSender,
  type MailjetConfiguration,
} from "./mailjet.service";

const settings: MailjetConfiguration = {
  apiKey: "mailjet-api-key",
  secretKey: "mailjet-secret-key",
  from: "welcome@example.com",
};

test("welcome email sender sends a personalized message to the new user", async () => {
  let sentMessage: SendMailOptions | undefined;
  const sendWelcomeEmail = createMailjetWelcomeEmailSender(settings, {
    async sendMail(message) {
      sentMessage = message;
      return {};
    },
  });

  await sendWelcomeEmail({ email: "student@u.nus.edu", name: "Alex Tan" });

  assert.deepEqual(sentMessage, {
    from: "welcome@example.com",
    to: "student@u.nus.edu",
    subject: "Welcome to FOC!",
    text: "Hi Alex Tan,\n\nWelcome to FOC! Your account is ready. We’re glad to have you with us.\n",
  });
});

test("welcome email sender reports transport failures", async () => {
  const sendWelcomeEmail = createMailjetWelcomeEmailSender(settings, {
    async sendMail() {
      throw new Error("Mailjet unavailable");
    },
  });

  await assert.rejects(
    sendWelcomeEmail({ email: "student@u.nus.edu", name: "Alex Tan" }),
    { message: "Mailjet unavailable" },
  );
});
