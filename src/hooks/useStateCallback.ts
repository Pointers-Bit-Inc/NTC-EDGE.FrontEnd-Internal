import { useCallback, useEffect, useRef, useState } from "react";

export const useStateCallback = (initialState:any) => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef<any>(null);

  const setStateCallback = useCallback((state, cb) => {
    callbackRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null;
    }
  }, [state]);

  return [state, setStateCallback];
}