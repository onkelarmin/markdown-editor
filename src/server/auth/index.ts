import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "../db/client";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import {
  BETTER_AUTH_URL,
  BETTER_AUTH_SECRET,
  RESEND_API_KEY,
  AUTH_EMAIL_FROM,
} from "astro:env/server";

const resend = new Resend(RESEND_API_KEY);

function otpEmailTemplate(email: string, otp: string) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='background-color:rgb(243,244,246);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";padding-top:40px;padding-bottom:40px'>
    <!--$-->
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0"
      data-skip-in-text="true">
      Your Markdown Editor verification code: ${otp}
      <div>
         ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
      </div>
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background-color:rgb(255,255,255);border-radius:8px;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 0 #0000;max-width:600px;margin-left:auto;margin-right:auto;padding:40px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="font-size:28px;font-weight:700;color:rgb(17,24,39);margin:0px;margin-bottom:8px">
                      Markdown Editor
                    </h1>
                    <p
                      style="font-size:18px;font-weight:500;color:rgb(37,99,235);margin:0px;margin-bottom:16px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      Verification Code
                    </p>
                    <p
                      style="font-size:16px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px">
                      Please use the code below to complete your sign-in to
                      Markdown Editor
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align:center;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <div
                      style="background-color:rgb(249,250,251);border-width:2px;border-style:dashed;border-color:rgb(209,213,219);border-radius:12px;padding:24px;display:inline-block">
                      <p
                        style='font-size:36px;font-weight:700;letter-spacing:8px;color:rgb(17,24,39);margin:0px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;line-height:24px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px'>
                        ${otp}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:16px;color:rgb(55,65,81);margin:0px;margin-bottom:16px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      <strong>Important:</strong>
                    </p>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin:0px;margin-bottom:8px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      • This code will expire in
                      <!-- -->10<!-- -->
                      minutes
                    </p>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin:0px;margin-bottom:8px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      • Enter this code exactly as shown above
                    </p>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin:0px;margin-bottom:8px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      • Do not share this code with anyone
                    </p>
                    <p
                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px">
                      • If you didn&#x27;t request this code, please ignore this
                      email
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color:rgb(239,246,255);border-left-width:4px;border-style:solid;border-color:rgb(96,165,250);padding:16px;margin-bottom:32px">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:14px;color:rgb(30,64,175);margin:0px;font-weight:500;line-height:24px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px">
                      🔒 Security Tip: Markdown Editor will never ask you to
                      share your verification code via email, phone, or any
                      other method.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="border-top-width:1px;border-style:solid;border-color:rgb(229,231,235);padding-top:24px;text-align:center">
              <tbody>
                <tr>
                  <td>
                    <p
                      style="font-size:12px;color:rgb(107,114,128);margin:0px;margin-bottom:8px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      This email was sent to ${email}
                    </p>
                    <p
                      style="font-size:12px;color:rgb(107,114,128);margin:0px;margin-bottom:8px;line-height:24px;margin-top:0px;margin-left:0px;margin-right:0px">
                      The Markdown Editor Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--7--><!--/$-->
  </body>
</html>
`;
}

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
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

        const html = otpEmailTemplate(email, otp);

        const { error } = await resend.emails.send({
          from: AUTH_EMAIL_FROM!,
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
