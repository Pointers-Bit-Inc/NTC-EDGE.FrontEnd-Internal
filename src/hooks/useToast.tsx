import * as React from "react";
import {ToastContext} from "@atoms/toast/ToastProvider";


export function useToast() {
    return React.useContext(ToastContext)!;
}