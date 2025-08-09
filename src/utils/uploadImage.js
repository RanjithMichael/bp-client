
import api from "./api";

export default async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url; // URL of uploaded image
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}
