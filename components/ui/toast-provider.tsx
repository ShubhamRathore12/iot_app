import React, { createContext, useCallback, useContext, useState } from 'react';
import Toast, { ToastType } from './toast';

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toastConfig, setToastConfig] = useState<{
        visible: boolean;
        type: ToastType;
        message: string;
        duration: number;
    }>({
        visible: false,
        type: 'info',
        message: '',
        duration: 3000,
    });

    const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
        setToastConfig({
            visible: true,
            type,
            message,
            duration,
        });
    }, []);

    const hideToast = useCallback(() => {
        setToastConfig(prev => ({ ...prev, visible: false }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                type={toastConfig.type}
                message={toastConfig.message}
                duration={toastConfig.duration}
                visible={toastConfig.visible}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
};
