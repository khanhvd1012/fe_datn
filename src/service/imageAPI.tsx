import axios from "axios";
import type { IImage } from "../interface/image";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadImage = async (file: File): Promise<IImage> => {
  try {
    const formData = new FormData();
    formData.append("images", file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const image = response.data.images?.[0];

    if (!image || !image._id || !image.url) {
      throw new Error("Thiếu thông tin ảnh trong phản hồi!");
    }

    return {
      _id: image._id,
      url: image.url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
