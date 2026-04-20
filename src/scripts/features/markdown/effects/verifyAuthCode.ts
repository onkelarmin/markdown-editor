import { authClient } from "@/scripts/shared/auth/auth-client";
import type { Store } from "../store";

export async function verifyAuthCode(store: Store, otp: string) {
  const email = store.getState().ui.signInModal.email;

  if (email === "") {
    store.dispatch({
      type: "auth/setProcessError",
      payload: { message: "Missing email. Please start again." },
    });
    return;
  }

  const { error } = await authClient.signIn.emailOtp({
    email,
    otp,
  });

  if (error) {
    console.error("Verifying OTP failed: ", error);

    store.dispatch({
      type: "auth/setProcessError",
      payload: { message: "Invalid or expired code. Please try again." },
    });

    return;
  }

  store.dispatch({ type: "auth/verifyCodeSuccess" });

  window.location.reload();
}
