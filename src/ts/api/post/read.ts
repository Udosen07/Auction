import { getToken } from "../../utilities/token";
import { API_AUCTION_POSTS, API_KEY } from "../constants";

const token: string | null = getToken();

export async function readPost(id: string): Promise<any> {
  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    console.log("About to read post with id:", id);
    const response = await fetch(
      `${API_AUCTION_POSTS}/${id}?_seller=true&_bids=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post data: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}
