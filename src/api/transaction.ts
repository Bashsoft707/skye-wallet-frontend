import { baseUrl } from "../constant";
import axios from "axios"

export const sendFunds = async (payload: any) => {
    const token = window.localStorage.getItem("token");
    const res = await axios.post(`${baseUrl}/transaction`, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export const getReceivedTransaction = async (paymentId: string) => {
    const token = window.localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/transaction/receive?${paymentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export const getSentTransaction = async (paymentId: string) => {
    const token = window.localStorage.getItem("token");
    const res = await axios.get(`${baseUrl}/transaction/sent?${paymentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}