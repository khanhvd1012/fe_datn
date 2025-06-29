import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useOrders = () => {
    return useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const res = await axios.get("/api/orders/admin");
            return res.data;
        },
    });
};
