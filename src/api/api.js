import axios from "axios"
import { useUserStore } from "../store/useUserStore"

const apiInstance = axios.create({
    baseURL: "https://api.kitek-pg.ru/api/marketplace/",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

apiInstance.interceptors.request.use((config) => {
    const { session } = useUserStore.getState()

    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`
    }

    return config
})

const getItems = async () => {
    const res = apiInstance.get("/items")
    return res
}

const getStats = async () => {
    const res = apiInstance.get("/stats")
    return res
}

const getItemBids = async (id) => {
    const res = apiInstance.get(`/items/${id}/bids`)
    return res
}

const getMyBids = async () => {
    const res = apiInstance.get("/bids/my")
    return res
}


const sendItems = async (item) => {
    const res = apiInstance.post("/items", item)
    return res.data
}

const deleteItems = async (id) => {
    const res = apiInstance.delete(`/items/${id}`)
    return res.data
}

const createBid = async ({id, amount}) => {
    const res = apiInstance.post(`/items/${id}/bids`, amount)
    return res.data
}

const registerUser = async (user) => {
    const res = await apiInstance.post("/auth/register", user)
    return res.data
}

const loginUser = async (user) => {
    const res = await apiInstance.post("/auth/login", user)
    return res.data
}

export const api = {
    registerUser, loginUser, getItems, getStats, sendItems, deleteItems, createBid, getItemBids, getMyBids
}