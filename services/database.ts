import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function getItems() {
  const response = await axios.get(`${API_URL}/api/items`);
  return response.data;
}
