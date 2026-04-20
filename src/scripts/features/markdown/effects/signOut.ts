import { authClient } from "@/scripts/shared/auth/auth-client";
import type { Store } from "../store";
import type { DOM } from "../ui/dom";

export async function signOutUser(store: Store, dom: DOM) {
  dom.authButtonText.textContent = "Signing out";
  dom.authButton.disabled = true;
  dom.authButton.toggleAttribute("data-show-spinner", true);

  const { error } = await authClient.signOut();

  if (error) {
    console.error(error.message);

    store.dispatch({
      type: "toast/enqueue",
      payload: {
        id: crypto.randomUUID(),
        message: "Failed to sign out. Try again.",
        variant: "error",
      },
    });

    dom.authButtonText.textContent = "Sign out";
    dom.authButton.disabled = false;
    dom.authButton.toggleAttribute("data-show-spinner", false);

    return;
  }

  window.location.reload();
}
