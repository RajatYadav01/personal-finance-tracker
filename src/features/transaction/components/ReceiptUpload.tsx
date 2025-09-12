import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import Button from "../../../components/ui/Button";

interface ReceiptUploadProps {
  currentReceipt?: string | null;
  onFileChange: (file: File | null) => void;
}

export default function ReceiptUpload({
  currentReceipt,
  onFileChange,
}: ReceiptUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFile(file);
      onFileChange(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0]);
      }
    },
    [handleFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    } as Record<string, string[]>, // Ensures correct typing
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Receipt</label>

      {currentReceipt && !file && (
        <div className="flex items-center space-x-2">
          <a
            href={currentReceipt}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View current receipt
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            aria-label="Remove receipt"
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Receipt preview"
            className="h-32 object-contain border rounded"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0"
            onClick={handleRemove}
            aria-label="Remove receipt"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
            <Upload size={24} />
            <p>Drag & drop receipt here</p>
            <p className="text-sm">or click to browse (JPG, PNG, PDF)</p>
          </div>
        </div>
      )}
    </div>
  );
}
