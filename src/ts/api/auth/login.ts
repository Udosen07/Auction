import { API_AUTH_LOGIN } from "../constants";

interface Props {
  email: string;
  password: string;
}

export async function login({ email, password }: Props) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
