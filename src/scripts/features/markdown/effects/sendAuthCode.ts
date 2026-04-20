import { authClient } from "@/scripts/shared/auth/auth-client";
import type { Store } from "../store";

export async function sendAuthCode(store: Store, email: string) {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  });

  if (error) {
    console.error("Sending OTP failed: ", error);

    store.dispatch({
      type: "auth/setProcessError",
      payload: { message: "Sending the code failed. Please try again." },
    });

    return;
  }

  store.dispatch({
    type: "auth/sendCodeSuccess",
    payload: { email },
  });
}
