import {useCallback ,  useState} from "react";

export function useComponentLayout() {
    const [size, setSize] = useState(null);

    const onLayout = useCallback(event => {
                 console.log(event.nativeEvent)

        const layout = event.nativeEvent.layout;
        setSize(layout);
    }, []);

    return [size, onLayout];
}