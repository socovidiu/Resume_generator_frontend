import axios from "axios";
import { CV } from "../types/CVtype";

const API_URL = "http://localhost:5000/api/cv"; // Change if needed

export const getAllCvs = async (): Promise<CV[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createCv = async (cvData: CV): Promise<CV> => {
    const response = await axios.post(API_URL, cvData);
    return response.data;
};

export const updateCv = async (id: string, cvData: CV): Promise<CV> => {
    const response = await axios.put(`${API_URL}/${id}`, cvData);
    return response.data;
};

export const deleteCv = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
