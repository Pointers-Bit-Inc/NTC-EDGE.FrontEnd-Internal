import { Dispatch, SetStateAction, useState } from 'react';
import useMemoizedFn from './useMemoizedFn';
import useUnmountedRef from './useUnmountedRef';

function useSafeState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useSafeState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

function useSafeState<S>(initialState?: S | (() => S)) {
    const unmountedRef = useUnmountedRef();
    const [state, setState] = useState(initialState);

    const setCurrentState = (currentState?: S | (() => S)) => {
        if (unmountedRef.current) return;
        setState(currentState);
    };

    return [state, useMemoizedFn(setCurrentState)] as const;
}

export default useSafeState;