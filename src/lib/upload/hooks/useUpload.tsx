import { useState } from "react";
import uploadFile from "../Reducers/uploadReducer";

const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    try {
      await uploadFile(file, { type: "UPLOAD_START" }); // Replace with appropriate UploadAction
    } catch (err) {
      setError(err);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, handleUpload };
};

export default useUpload;
