import axios from "axios";
import type { IContact } from "../interface/contact";

const API_URL = import.meta.env.VITE_API_URL;

export const createContact = async (contact: Omit<IContact, "_id" | "createdAt" | "updatedAt">) => {
  try {
    const response = await axios.post(`${API_URL}/contacts`, contact);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const getAllContacts = async (): Promise<IContact[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};
