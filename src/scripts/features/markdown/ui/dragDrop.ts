import Sortable from "sortablejs";
import type { Store } from "../store";
import type { DOM } from "./dom";
import { customProp } from "@/scripts/shared/utils/helper";
import { saveReorderedDocuments } from "../effects/saveReorder";

export function setupDragDrop(dom: DOM, store: Store) {
  const list = dom.documentList;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const getItems = () =>
    Array.from(list.querySelectorAll<HTMLLIElement>(".document-list-item"));

  const sortable = Sortable.create(list, {
    animation: reduceMotion ? 0 : 350,
    easing: customProp("--ease-out"),
    chosenClass: "chosen",
    dragClass: "drag",

    onChoose: () => {
      getItems().forEach((i) => i.classList.add("is-moving"));
    },

    onUnchoose: () => {
      getItems().forEach((i) => i.classList.remove("is-moving"));
    },

    onEnd: () => {
      const orderedIds = getItems()
        .map((item) => {
          const button = item.querySelector<HTMLButtonElement>(
            ".document-list-button",
          );

          if (!button) return;

          const id = button.dataset.id;

          if (!id) return;

          return id;
        })
        .filter(Boolean) as string[];

      store.dispatch({ type: "document/reorder", payload: { orderedIds } });

      void saveReorderedDocuments(store);
    },
  });

  return () => sortable.destroy();
}
