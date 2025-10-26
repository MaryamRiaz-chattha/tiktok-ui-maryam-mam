import { UploadState, UploadAction } from '../types/uploadTypes';

const initialState: UploadState = {
    isLoading: false,
    error: null,
    success: false,
};

const uploadReducer = (state: UploadState = initialState, action: UploadAction): UploadState => {
    switch (action.type) {
        case 'UPLOAD_REQUEST':
            return { ...state, isLoading: true, error: null };
        case 'UPLOAD_SUCCESS':
            return { ...state, isLoading: false, success: true };
        case 'UPLOAD_FAILURE': {
            let errorMsg: string | null = null;
            if (typeof action.payload === 'string') {
                errorMsg = action.payload;
            } else if (
                action.payload &&
                typeof action.payload === 'object' &&
                'message' in action.payload &&
                typeof (action.payload as { message?: unknown }).message === 'string'
            ) {
                errorMsg = (action.payload as { message: string }).message;
            }
            return { ...state, isLoading: false, error: errorMsg };
        }
        default:
            return state;
    }
};

export default uploadReducer;