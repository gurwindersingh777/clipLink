import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useLinkAnalytics = (id: string) => {
  return useQuery({
    queryKey: ["link", id],
    queryFn: async () => {
      const response = await axios.get(`/api/links/${id}`)
      return response.data
    },
  })
}