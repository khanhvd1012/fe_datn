import { useMutation, useQuery } from "@tanstack/react-query";
import type { IContact } from "../interface/contact";
import { createContact, getAllContacts } from "../service/contactAPI";

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
