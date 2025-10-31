import axios from "axios";

const API = axios.create({
  baseURL: "https://credittracker-backend.onrender.com", // backend URL
});

export const predictCreditFlow = (data) => API.post("/predict", data);
