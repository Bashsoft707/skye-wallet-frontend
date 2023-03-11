import { baseUrl } from "../constant";
import axios from "axios";

export const register = async (payload: any) => {
  const res = await axios.post(`${baseUrl}/user/register`, payload);

  return res.data;
};

export const login = async (payload: any) => {
  const res = await axios.post(`${baseUrl}/user/login`, payload);

  return { success: true, ...res.data };
};

export const getMe = async () => {
  const token = window.localStorage.getItem("token");
  const res = await axios.get(`${baseUrl}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
