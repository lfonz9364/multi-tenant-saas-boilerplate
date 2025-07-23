import axios from "axios";

export const clerkAPI = axios.create({
  baseURL: "https://api.clerk.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});
