import axios from "axios";

const API_URL = "http://localhost:5000/articles";

export const updateArticle = async (id, content, references) => {
    await axios.put(`${API_URL}/${id}`, {
        content,
        references,
        isUpdated: true
    });
};
