import { API_AUTH_REGISTER } from "../constants";

interface Props {
  name: string;
  email: string;
  password: string;
  bio: string;
  credits: number;
}

export async function register({ name, email, password, bio }: Props) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        bio,
      }),
    });
    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
