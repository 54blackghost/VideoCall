import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const syncClerkUser = async (getToken) => {
  const token = await getToken();

  const response = await axios.get(
    `${API_URL}/auth/clerk/sync`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};