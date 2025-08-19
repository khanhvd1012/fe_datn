import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IContact } from "../interface/contact";
import { createContact, deleteContactAPI, getAllContacts } from "../service/contactAPI";

export const useCreateContact = () => {
  return useMutation({
    mutationFn: createContact,
  });
};

export const useGetAllContacts = () => {
  return useQuery<IContact[]>({
    queryKey: ["contacts"],
    queryFn: getAllContacts,
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContactAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};