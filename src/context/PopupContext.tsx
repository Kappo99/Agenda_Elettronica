import React, { createContext, useContext, useState } from 'react';

interface PopupContextValue {
    registerCallback: (id: string, callback: () => void) => void;
    executeCallback: (id: string) => void;
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined);

export function PopupProvider({ children }: { children: React.ReactNode }) {
    const [callbacks, setCallbacks] = useState<{ [key: string]: () => void }>({});

    const registerCallback = (id: string, callback: () => void) => {
        setCallbacks((prev) => ({ ...prev, [id]: callback }));
    };

    const executeCallback = (id: string) => {
        if (callbacks[id]) {
            callbacks[id]();
        }
    };

    return (
        <PopupContext.Provider value={{ registerCallback, executeCallback }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};
