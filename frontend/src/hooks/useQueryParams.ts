import { useSearchParams } from "react-router-dom";
import { usePartials } from "./usePartials";

const getDefaultState = <T extends object>(
  initialState: T,
  searchParams: URLSearchParams
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state: any = {};
  Object.keys(initialState).forEach((key) => {
    state[key] = searchParams.get(key) || initialState[key as never];
  });
  return state as T;
};

export const useQueryParams = <T extends object>(initialState: T) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = usePartials(
    getDefaultState(initialState, searchParams)
  );

  const set = (newState: Partial<T>) => {
    setState(newState);
    const newSearchParams = new URLSearchParams(searchParams);
    Object.keys(newState).forEach((key) => {
      newSearchParams.set(key, newState[key as never] as string);
    });
    setSearchParams(newSearchParams);
  };

  return [state, set] as const;
};
