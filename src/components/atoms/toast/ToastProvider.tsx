import * as React from "react";
export enum ToastType {
    Info = "INFO",
    Error = "ERROR",
    Success = "SUCCESS",
}
type ToastConfigType = { type: ToastType; message: string; duration: number };
type ToastContextType = {
    toastConfig: ToastConfigType | null;
    showToast: (type: ToastType, message: string, duration?: number) => void;
    hideToast: () => void;
};
export const ToastContext = React.createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC = ({ children }) => {
    const [
        toastConfig,
        setToastConfig,
    ] = React.useState<ToastConfigType | null>(null);

    function showToast(type: ToastType, message: string, duration = 4000) {
        setToastConfig({ type, message, duration });
    }

    function hideToast() {
        setToastConfig(null);
    }

    return (
        <ToastContext.Provider value={{ toastConfig, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};