import api from "./api";

export const getSession = async () => {
    try {
        const res = await api.get("/auth/session/get/prelogin");
        return res.data
    } catch (err) {
        if (err.response) {
            return err.response.data;
        } else if (err.request) {
            // Request made but no response
            return res = "No response from server. Please try again.";
        }
    }
}