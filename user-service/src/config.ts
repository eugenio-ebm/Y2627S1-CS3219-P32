import "dotenv/config";

/**
    AI Assistance Disclosure:
    Tool: ChatGPT (model: GPT-6), date: 2026-09-30
    Scope: JWT and optional first-administrator bootstrap secret configuration
    Author review: Done
    Tool: ChatGPT (GPT-6), date: 2026-10-19
    Scope: Mailjet configuration validation
    Author review: Pending
**/
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
  throw new Error("JWT_SECRET must be set to at least 32 bytes");
}

const jwtAccessTokenTtl = Number(process.env.JWT_ACCESS_TOKEN_TTL ?? 900);
if (!Number.isSafeInteger(jwtAccessTokenTtl) || jwtAccessTokenTtl <= 0) {
  throw new Error("JWT_ACCESS_TOKEN_TTL must be a positive integer number of seconds");
}

const bootstrapSecret = process.env.BOOTSTRAP_SECRET;
if (bootstrapSecret && Buffer.byteLength(bootstrapSecret) < 32) {
  throw new Error("BOOTSTRAP_SECRET must be at least 32 bytes when configured");
}

const mailjetApiKey = process.env.MAILJET_API_KEY?.trim();
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY?.trim();
const mailjetFrom = process.env.MAILJET_FROM?.trim();
const mailjetSettings = [mailjetApiKey, mailjetSecretKey, mailjetFrom];
if (mailjetSettings.some(Boolean) && !mailjetSettings.every(Boolean)) {
  throw new Error("MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_FROM must all be set together");
}

export const config = {
  port: Number(process.env.PORT ?? 3333),
  jwtSecret,
  jwtAccessTokenTtl,
  bootstrapSecret,
  mailjet: mailjetApiKey && mailjetSecretKey && mailjetFrom
    ? { apiKey: mailjetApiKey, secretKey: mailjetSecretKey, from: mailjetFrom }
    : undefined,
};
