import { initialState } from "./initialState";
import { reducer } from "./reducer";
import type { Action, State, subscribeOptions } from "./types";

export type Store = {
  getState: () => State;
  dispatch: (action: Action) => void;
  subscribe: (
    listener: (s: State) => void,
    options?: subscribeOptions,
  ) => () => void;
};

export function createStore(preloadedState?: State) {
  let state = preloadedState ?? initialState;
  const listeners = new Set<(s: State) => void>();

  function getState() {
    return state;
  }

  function dispatch(action: Action) {
    const next = reducer(state, action);
    if (next === state) return;
    state = next;
    for (const l of listeners) l(state);
  }

  function subscribe(
    listener: (s: State) => void,
    options?: subscribeOptions,
  ): () => void {
    listeners.add(listener);

    if (options?.fireImmediately) listener(state);

    return () => {
      listeners.delete(listener);
    };
  }

  return { getState, dispatch, subscribe };
}
