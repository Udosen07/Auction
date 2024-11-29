import { getToken } from "../../utilities/token";
import { API_AUCTION_POSTS, API_KEY } from "../constants";

export interface Listing {
  id: string;
  title: string;
  description: string;
  media: { url: string; alt: string }[];
  tags: string[];
  created: string;
  updated: string;
  endsAt: string;
  _count: { bids: number };
}

/**
 * Fetch listings from the API based on the search query
 * @param query - The search query
 * @returns - A promise that resolves to the search results (listings)
 */
export async function searchListings(query: string): Promise<Listing[]> {
  const token = getToken();
  try {
    const response = await fetch(`${API_AUCTION_POSTS}/search?q=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch search results.");

    const { data: listings }: { data: Listing[] } = await response.json();
    return listings;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching search results.");
  }
}
