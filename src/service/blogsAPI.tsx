import axios from "axios";
import type { IBlogs } from "../interface/blogs";

const API_URL = import.meta.env.VITE_API_URL;

export const getNews = async (): Promise<IBlogs[]> => {
  try {
    const response = await axios.get(`${API_URL}/news`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const getNewsById = async (id: string): Promise<IBlogs> => {
  try {
    const response = await axios.get(`${API_URL}/news/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw error;
  }
};

export const createNews = async (news: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/news`, news, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

export const updateNews = async (id: string, news: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/news/${id}`, news, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

export const deleteNews = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};
