// src/hooks/useShipping.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDistricts, getProvinces, getShippingFee, getWards } from "../service/shippingAPI";

// Lấy provinces
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    select: (data) =>
      data.map((p: any) => ({
        label: p.ProvinceName,
        value: p.ProvinceID,
      })),
    staleTime: 1000 * 60 * 60,
  });
};

// useDistricts
export const useDistricts = (provinceId?: number) => {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => getDistricts(provinceId!),
    enabled: !!provinceId,
    select: (data) =>
      data.map((d: any) => ({
        label: d.DistrictName,
        value: d.DistrictID,
      })),
  });
};

// useWards
export const useWards = (districtId?: number) => {
  return useQuery({
    queryKey: ["wards", districtId],
    queryFn: () => getWards(districtId!),
    enabled: !!districtId,
    select: (data) =>
      data.map((w: any) => ({
        label: w.WardName,
        value: w.WardCode,
      })),
  });
};

// Tính phí ship
export const useShippingFee = () => {
  return useMutation({
    mutationFn: getShippingFee,
  });
};
