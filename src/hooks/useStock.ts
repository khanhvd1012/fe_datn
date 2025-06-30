import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStock, updateStock, getAllStockHistory, deleteStockHistory, getOneStockHistory } from "../service/stockAPI";
import type { IStock, IStockHistory } from "../interface/stock";


// Lấy danh sách tất cả kho
export const useStocks = () => {
    return useQuery<IStock[]>({
        queryKey: ["stocks"],
        queryFn: getAllStock,
    });
};

// Cập nhật số lượng kho
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; quantity_change: number; reason: string }) => {
      console.log("Gửi updateStock với:", data);

      return updateStock(data.id, {
        quantity_change: data.quantity_change,
        reason: data.reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};

// Lấy toàn bộ lịch sử kho
export const useStockHistory = () => {
    return useQuery<IStockHistory[]>({
        queryKey: ["stock-history"],
        queryFn: getAllStockHistory,
    });
};

// Lấy chi tiết một lịch sử kho
export const useOneStockHistory = (id: string) => {
    return useQuery<IStockHistory>({
        queryKey: ["stock-history", id],
        queryFn: () => getOneStockHistory(id),
        enabled: !!id,
    });
};

// Xoá bản ghi lịch sử kho
export const useDeleteStockHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteStockHistory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stock-history"] });
        },
    });
};
