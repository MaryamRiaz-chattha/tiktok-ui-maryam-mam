import React, { useReducer, createContext, useContext, ReactNode } from 'react';
import uploadReducer from './Reducers/uploadReducer';
import { UploadState, UploadContextType } from './types/uploadTypes';

const UploadContext = createContext<UploadContextType | undefined>(undefined);

interface UploadProviderProps {
    children: ReactNode;
}

export function UploadProvider({ children }: UploadProviderProps) {
    const [state, dispatch] = useReducer(uploadReducer, { 
        isLoading: false, 
        error: null, 
        success: false 
    });

    const contextValue: UploadContextType = {
        state,
        dispatch
    };

    return React.createElement(
        UploadContext.Provider,
        { value: contextValue },
        children
    );
}

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useUpload must be used within an UploadProvider');
    }
    return context;
};