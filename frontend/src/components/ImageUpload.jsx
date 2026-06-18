import { useRef, useState } from "react";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "../lib/cloudinary";

function ImageUpload({ value, onChange, disabled = false }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-base-300 bg-base-200">
          <img src={value} alt="Product preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            disabled={disabled || uploading}
            className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
            aria-label="Remove image"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-base-300 bg-base-200/50">
          <div className="text-center text-base-content/50">
            <ImageIcon className="size-8 mx-auto mb-2" />
            <p className="text-sm">No image selected</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || uploading}
        className="btn btn-outline w-full"
      >
        {uploading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <UploadIcon className="size-4 mr-2" />
            {value ? "Replace Image" : "Upload Image"}
          </>
        )}
      </button>

      <div className="divider text-xs text-base-content/50">OR</div>

      <input
        type="url"
        placeholder="https://example.com/image.jpg"
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || uploading}
      />
      <p className="text-xs text-base-content/50">Paste an image URL if you prefer not to upload</p>
    </div>
  );
}

export default ImageUpload;
