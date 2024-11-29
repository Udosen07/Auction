import { getToken } from "../../utilities/token";
import { API_AUCTION_POSTS, API_AUCTION_PROFILE, API_KEY } from "../constants";

const token = getToken();

interface Props {
  limit: number;
  page: number;
}

interface ProfileData {
  bio: string;
  avatar: { url: string; alt: string };
  credits: number;
  _count: { listings: number; wins: number };
  name: string;
}

export async function readProfiles({ limit, page }: Props) {
  try {
    const response = await fetch(
      `${API_AUCTION_POSTS}?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("this error", error);
    return [];
  }
}

export async function liveGridreadProfiles({ limit, page }: Props) {
  try {
    const response = await fetch(
      `${API_AUCTION_POSTS}?sort=created&sortOrder=desc&_active=true&limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("this error", error);
    return [];
  }
}

export async function winGridreadProfiles({
  name,
  limit,
  page,
}: {
  name: string;
  limit: number;
  page: number;
}) {
  try {
    const response = await fetch(
      `${API_AUCTION_PROFILE}/${name}/wins?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching winning posts:", error);
    return { data: [], meta: null }; // Return empty structure to avoid breaking rendering logic
  }
}

export async function readProfile(
  username: string
): Promise<{ data: ProfileData }> {
  const token = getToken();

  const response = await fetch(`${API_AUCTION_PROFILE}/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  return await response.json();
}
