/**
    AI Assistance Disclosure:
    Tool: ChatGPT (GPT-6), date: 2026-10-19
    Scope: Nodemailer Mailjet SMTP welcome-email sender
    Author review: Pending
**/
import nodemailer, { type SendMailOptions } from "nodemailer";

export interface MailjetConfiguration {
  apiKey: string;
  secretKey: string;
  from: string;
}

interface WelcomeEmailRecipient {
  email: string;
  name: string;
}

interface MailTransport {
  sendMail(message: SendMailOptions): Promise<unknown>;
}

export function createMailjetWelcomeEmailSender(
  settings: MailjetConfiguration,
  transport: MailTransport = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    auth: {
      user: settings.apiKey,
      pass: settings.secretKey,
    },
  }),
): (recipient: WelcomeEmailRecipient) => Promise<void> {
  return async ({ email, name }) => {
    await transport.sendMail({
      from: settings.from,
      to: email,
      subject: "Welcome to FOC!",
      text: `Hi ${name},\n\nWelcome to FOC! Your account is ready. We’re glad to have you with us.\n`,
    });
  };
}

let configuredSettings: MailjetConfiguration | undefined;
let sendConfiguredWelcomeEmail: ((recipient: WelcomeEmailRecipient) => Promise<void>) | undefined;

export async function sendWelcomeEmail(
  recipient: WelcomeEmailRecipient,
  settings: MailjetConfiguration | undefined,
): Promise<void> {
  if (!settings) {
    console.warn("Mailjet is not configured; welcome email was not sent.");
    return;
  }
  let sendEmail = sendConfiguredWelcomeEmail;
  if (
    (!configuredSettings ||
      configuredSettings.apiKey !== settings.apiKey ||
      configuredSettings.secretKey !== settings.secretKey ||
      configuredSettings.from !== settings.from) ||
    !sendEmail
  ) {
    configuredSettings = settings;
    sendEmail = createMailjetWelcomeEmailSender(settings);
    sendConfiguredWelcomeEmail = sendEmail;
  }
  await sendEmail(recipient);
}
