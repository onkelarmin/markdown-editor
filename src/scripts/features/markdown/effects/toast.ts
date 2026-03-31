import type { Store } from "../store";

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function startToastTimer(store: Store, toastId: string, delay = 5000) {
  clearToastTimer();

  toastTimer = setTimeout(() => {
    store.dispatch({ type: "toast/dismiss", payload: { id: toastId } });
  }, delay);
}

export function clearToastTimer() {
  if (!toastTimer) return;

  clearTimeout(toastTimer);
  toastTimer = null;
}
