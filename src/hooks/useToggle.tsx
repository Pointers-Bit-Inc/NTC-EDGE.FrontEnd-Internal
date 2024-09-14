import { useState } from 'react';
import useMemoizedFn from './useMemoizedFn';

interface Actions<T> {
    setLeft: () => void;
    setRight: () => void;
    set: (value: T) => void;
    toggle: () => void;
}

function useToggle<T = boolean>(): [boolean, Actions<T>];
function useToggle<T>(defaultValue: T): [T, Actions<T>];
function useToggle<T, U>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];

function useToggle<D, R>(defaultValue = false as unknown as D, reverseValue?: R) {
    const [state, setState] = useState<D | R>(defaultValue);

    const reverseValueOrigin = (reverseValue === undefined ? !defaultValue : reverseValue) as D | R;

    const toggle = () => setState(s => (s === defaultValue ? reverseValueOrigin : defaultValue));
    const set = (value: D | R) => setState(value);
    const setLeft = () => setState(defaultValue);
    const setRight = () => setState(reverseValueOrigin);

    const actions = {
        toggle: useMemoizedFn(toggle),
        set: useMemoizedFn(set),
        setLeft: useMemoizedFn(setLeft),
        setRight: useMemoizedFn(setRight),
    };

    return [state, actions];
}

export default useToggle;
