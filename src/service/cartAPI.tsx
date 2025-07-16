import axios from "axios";
import type { ICart } from "../interface/cart";

const API_URL = import.meta.env.VITE_API_URL;

export const getCart = async (): Promise<ICart> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/carts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (item: { variant_id: string; quantity: number }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/carts`, item, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (variant_id: string, quantity: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/carts/${variant_id}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/carts/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
