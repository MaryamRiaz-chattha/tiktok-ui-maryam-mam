import { useReducer, createContext, useContext, ReactNode } from 'react';
import uploadReducer from './Reducers/uploadReducer';
import { UploadState, UploadContextType } from './types/uploadTypes';

const UploadContext = createContext<UploadContextType | undefined>(undefined);

interface UploadProviderProps {
    children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(uploadReducer, { isLoading: false, error: null, success: false });

    return (
        <UploadContext.Provider value={{ state, dispatch }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error('useUpload must be used within an UploadProvider');
    }
    return context;
};