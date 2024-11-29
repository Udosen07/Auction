import { getToken } from "../../utilities/token";
import { API_AUCTION_PROFILE, API_KEY } from "../constants";

export async function fetchCredits(username: string): Promise<number> {
  const token = getToken();
  try {
    const response = await fetch(`${API_AUCTION_PROFILE}/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userProfile = await response.json();
    const userCredits = userProfile.data.credits || 0;

    // Store the credits in localStorage
    localStorage.setItem("credits", userCredits.toString());
    return userCredits;
  } catch (error) {
    console.error("Error fetching credits:", error);
    return 0; // Default balance in case of error
  }
}
