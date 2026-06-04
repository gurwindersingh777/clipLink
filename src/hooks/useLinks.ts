import { Link } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useLinks() {
  return useQuery<Link[]>({
    queryKey: ["links"],
    queryFn: async (): Promise<Link[]> => {
      const { data } = await axios.get<Link[]>("/api/links")
      return data
    }
  })
}