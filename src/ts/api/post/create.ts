import { getToken } from "../../utilities/token";
import { API_AUCTION_POSTS, API_KEY } from "../constants";

interface Media {
  url: string;
  alt: string;
}

interface PostData {
  title: string;
  media: Media[]; // Array of Media objects
  description: string;
  endsAt: string;
}

export async function createPost(postData: PostData): Promise<Response> {
  const token = getToken();

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await fetch(API_AUCTION_POSTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      // Extract error information for debugging
      const errorDetails = await response.json();
      console.error("Error response:", errorDetails);
      throw new Error(
        `Post creation failed: ${response.status} ${response.statusText}`
      );
    }

    return response; // Return the successful response object
  } catch (error) {
    console.error("Post creation failed:", error);
    throw error;
  }
}
