import { useState } from 'react';
import axios from 'axios';

const useUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const uploadVideo = async (file: File, title: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);

            const response = await axios.post('https://backend.postsiva.com/tiktok/post/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer YOUR_TOKEN_HERE',
                },
            });

            setSuccess(response.data.success);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'An unknown error occurred');
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { uploadVideo, isLoading, error, success };
};

export default useUpload;