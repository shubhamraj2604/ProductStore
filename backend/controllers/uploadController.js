import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  // Guard: multer must have parsed a file
  if (!req.file) {
    return res.status(400).json({ message: "No file received. Send the image as form-data with key 'image'." });
  }

  try {
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "store-app",
      }
    );

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error?.message || error);
    res.status(500).json({
      message: "Upload failed",
      detail: error?.message || "Unknown error",
    });
  }
};