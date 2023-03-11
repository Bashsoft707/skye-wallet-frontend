import { baseUrl } from "../constant";
import axios from "axios";

export const generatePaymentId = async () => {
    const token = window.localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/account`, null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export const getAllAccounts = async () => {
    const token = window.localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/account`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export const getAccount = async (paymentId: string) => {
    const token = window.localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/account/pay?paymentId=${paymentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export const userAccounts = async () => {
    const token = window.localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/account/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export const deleteAccount = async (id: string) => {
    const token = window.localStorage.getItem("token");
    const res = await axios.delete(`${baseUrl}/account/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}