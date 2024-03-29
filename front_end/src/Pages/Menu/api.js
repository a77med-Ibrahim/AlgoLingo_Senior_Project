import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/register/`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/login/`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
