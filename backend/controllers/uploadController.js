import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "store-app", // Optional: specify a folder in your Cloudinary account
      }
    );

    // req.file.mimetype = specifies the type of file being uploaded (e.g., image/jpeg, image/png, etc.)
    // req.file.buffer = contains the actual binary data of the uploaded file.
    // A string that looks like data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..., which Cloudinary can easily interpret as a file.

    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};