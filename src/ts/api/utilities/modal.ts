// api.js
export async function placeBid(
  postId: string,
  bidAmount: number
): Promise<boolean> {
  try {
    const response = await fetch(`/auction/listings/${postId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error("Failed to place bid.");
    }
  } catch (error) {
    console.error("API error placing bid:", error);
    return false;
  }
}
