import { authClient } from "@/scripts/shared/auth/auth-client";
import type { Store } from "../store";

export async function resendAuthCode(store: Store, email: string) {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  });

  if (error) {
    console.error("Resending OTP failed: ", error);

    store.dispatch({
      type: "auth/resendCodeError",
      payload: { message: "Resending the code failed. Please try again." },
    });

    return;
  }

  store.dispatch({
    type: "auth/resendCodeSuccess",
  });

  setTimeout(() => {
    store.dispatch({ type: "auth/resendCodeReset" });
  }, 2000);
}
