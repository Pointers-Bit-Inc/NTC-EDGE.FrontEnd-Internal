
import { Source, OnProgressEvent } from 'react-native-fast-image';
import useSafeState from "./useSafeState";
import useMemoizedFn from "./useMemoizedFn";

export default function useImage(source: number | Source) {
    const [loading, setLoading] = useSafeState(false);
    const [progress, setProgress] = useSafeState(0);


    const handleStart = () => {
        typeof source === 'object' && setLoading(true);
    };

    const handleSuccess = () => {
        setLoading(false);
    };

    const handleError = () => {
        setLoading(false);
    };

    const handleProgress = (e: OnProgressEvent) => {
        const { loaded, total } = e.nativeEvent;
        // 防止出现Infinity的情况
        if (total && loaded) {
            setProgress(Math.round(100 * (loaded / total)));
        }
    };

    return {
        loading,
        progress,
        handleStart: useMemoizedFn(handleStart),
        handleSuccess: useMemoizedFn(handleSuccess),
        handleError: useMemoizedFn(handleError),
        handleProgress: useMemoizedFn(handleProgress),
    };
}
