import UploadCloudIcon from "./Icons/UploadCloudIcon";
import { useState } from "react";

const FileUploadComponent = () => {
  const [fileName, setFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Simulate upload process
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        // In a real app, you'd call the upload API here
        console.log("Uploading file:", file.name);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur-lg border-2 border-dashed border-cyan-400/50 rounded-2xl p-8 text-center transition-all duration-300 hover:border-cyan-300">
      <label htmlFor="file-upload" className="cursor-pointer">
        <UploadCloudIcon className="w-16 h-16 mx-auto text-cyan-300" />
        <h3 className="mt-4 text-2xl font-semibold text-white">
          Upload your payment history PDF
        </h3>
        <p className="mt-2 text-sky-200">
          Drag and drop your file here, or click to browse.
        </p>
        <input 
          id="file-upload" 
          type="file" 
          className="sr-only" 
          accept=".pdf"
          onChange={handleFileChange}
        />
      </label>
      
      {isUploading && (
        <div className="mt-4 text-lg text-sky-200">
          Uploading "{fileName}"...
        </div>
      )}
      
      {!isUploading && fileName && (
         <div className="mt-4 text-lg text-green-300">
          Successfully processed "{fileName}"!
        </div>
      )}
    </div>
  );
};
export default FileUploadComponent;