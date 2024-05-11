import { useState } from "react";

export const usePartials = <T>(initialState: T) => {
  const [state, replaceState] = useState<T>(initialState);

  const setState = (newState: Partial<T>) => {
    replaceState((curState) => ({ ...curState, ...newState }));
  };

  return [state, setState, replaceState] as const;
};
