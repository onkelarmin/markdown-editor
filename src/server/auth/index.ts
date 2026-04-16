import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "../db/client";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: false,
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in" ? "Your sign-in code" : "Your verification code";

        const html = `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Markdown Editor</h2>
            <p>Your code is:</p>
            <p style="font-size: 24px; font-weight: 700; letter-spacing: 0.2em;">
              ${otp}
            </p>
            <p>This code will expire soon.</p>
          </div>
        `;

        const { error } = await resend.emails.send({
          from: process.env.AUTH_EMAIL_FROM!,
          to: [email],
          subject,
          html,
        });

        if (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
});
