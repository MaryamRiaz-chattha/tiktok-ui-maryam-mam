import { useState } from "react";
import { useUpload as useUploadContext } from "../useUpload";

const useUpload = () => {
  const { dispatch } = useUploadContext();
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });

      // TODO: Replace this placeholder with the real upload API call.
      // Example:
      // const result = await uploadApi.uploadFile(file);
      // if (result.ok) dispatch({ type: 'UPLOAD_SUCCESS' }); else throw new Error(result.error)

      // For now we'll immediately dispatch success so UI can proceed.
      dispatch({ type: "UPLOAD_SUCCESS" });
    } catch (err: unknown) {
      let message = "Upload failed";
      if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        message = (err as { message: string }).message;
      }
      setError(message);
      dispatch({ type: "UPLOAD_FAILURE", payload: message });
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, handleUpload };
};

export default useUpload;
