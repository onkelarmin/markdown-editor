import { loadDocuments } from "./effects/loadDocuments";
import { createStore, type Store } from "./store";
import { getDOM, type DOM } from "./ui/dom";
import { bindEvents } from "./ui/events";
import { render } from "./ui/render";

export function initMarkdown() {
  const dom = getDOM();
  const store = createMarkdownStore();

  const cleanupSubscribers = registerMarkdownSubscribers(dom, store);
  const cleanupInteractions = registerMarkdownInteractions(dom, store);

  void loadDocuments(store);

  return () => {
    cleanupSubscribers();
    cleanupInteractions();
  };
}

function createMarkdownStore() {
  return createStore();
}

function registerMarkdownSubscribers(dom: DOM, store: Store) {
  let unsubscribes: Array<() => void> = [];

  unsubscribes.push(
    store.subscribe(
      (state) => {
        render(state, dom);
      },
      { fireImmediately: true },
    ),
  );

  return () => {
    unsubscribes.forEach((fn) => fn());
  };
}

function registerMarkdownInteractions(dom: DOM, store: Store) {
  const detachEvents = bindEvents(dom, store);

  return () => {
    detachEvents();
  };
}
