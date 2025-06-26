import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../service/imageAPI";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};
