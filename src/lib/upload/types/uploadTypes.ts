// Define types for upload functionality
export interface UploadState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export interface UploadAction {
    type: string;
    payload?: string | { message?: string } | null;
}

export type UploadDispatch = (action: UploadAction) => void;

export type UploadContextType = {
    state: UploadState;
    dispatch: UploadDispatch;
};