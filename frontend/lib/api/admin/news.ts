import { ADMIN_NEWS } from "../endpoints";
import  axios  from "../axios";


export async function adminGetAllNews(params?: {
  page?: string;
  limit?: string;
  category?: string;
  status?: string;
  search?: string;
}) {
  const { data } = await axios.get(ADMIN_NEWS.ALL, { params });
  return data;
}

export async function adminGetOneNews(id: string) {
  const { data } = await axios.get(ADMIN_NEWS.ONE(id));
  return data;
}

export async function adminCreateNews(payload: any) {
  const { data } = await axios.post(ADMIN_NEWS.CREATE, payload);
  return data;
}

export async function adminUpdateNews(id: string, payload: any) {
  const { data } = await axios.put(ADMIN_NEWS.UPDATE(id), payload);
  return data;
}

export async function adminDeleteNews(id: string) {
  const { data } = await axios.delete(ADMIN_NEWS.DELETE(id));
  return data;
}
