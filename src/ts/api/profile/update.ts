import { getToken } from "../../utilities/token";
import { API_AUCTION_PROFILE, API_KEY } from "../constants";

interface ProfileData {
  bio: string;
  avatar: { url: string };
  name: string;
}

export async function updateProfile(
  username: string,
  { avatar, bio }: { avatar?: string | null; bio?: string }
): Promise<ProfileData> {
  try {
    const token = getToken();

    // Create the profileData object
    const profileData: { bio?: string; avatar?: { url: string } | null } = {};

    if (bio) profileData.bio = bio;
    if (avatar) {
      // Only set the url for avatar (no 'alt' property)
      profileData.avatar = avatar ? { url: avatar } : null;
    }

    const response = await fetch(`${API_AUCTION_PROFILE}/${username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update the profile");
    }

    return await response.json(); // Return the updated profile data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
