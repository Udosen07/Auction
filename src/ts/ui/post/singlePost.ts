// import { API_AUCTION_POSTS, API_KEY } from "../../api/constants";
// import { readPost } from "../../api/post/read";
// import { getToken } from "../../utilities/token";

// // Fetch and render post data
// export async function renderPost(postId: string): Promise<void> {
//   const postDetail = document.getElementById("blogMainPost");

//   if (!postDetail) {
//     console.error("Element with ID 'blogMainPost' not found.");
//     return;
//   }

//   try {
//     const post = await readPost(postId);
//     if (!post) throw new Error("Post not found");

//     console.log("Fetched Post Data:", post); // Debugging log

//     const {
//       title,
//       media,
//       description,
//       _count,
//       seller,
//       endsAt,
//       bids,
//     }: {
//       title: string;
//       media: { url?: string; alt?: string }[];
//       description: string;
//       _count: { bids?: number };
//       seller: { name: string };
//       endsAt: string;
//       bids: {
//         amount: number;
//         bidder: {
//           name: string;
//           email: string;
//           avatar: { url: string; alt: string };
//         };
//       }[];
//     } = post;

//     const imageUrl = media?.[0]?.url || "default-image-url.jpg";
//     const imageAlt = media?.[0]?.alt || "Default image";

//     const formattedDate = new Date(endsAt).toLocaleDateString("en-GB");
//     const bidsCount = _count.bids || 0;

//     // Render post details
//     postDetail.innerHTML = `
//       <div class="w-[90%] md:w-[80%] mx-auto grid md:grid-cols-2 md:gap-10 gap-5 items-center">
//         <!-- Content Section -->
//         <div class="md:order-1 order-2">
//           <h1 class="md:text-2xl font-bold mb-5">${title}</h1>
//           <p>Information:</p>
//           <div class="flex items-center gap-5 mb-5">
//             <p class="text-xl">Owned by ${seller.name}</p>
//             <p class="flex items-center gap-2 text-lg text-red-600 font-bold">
//               <i class="fa-regular fa-eye"></i>
//               <span>${bidsCount}</span>
//             </p>
//           </div>
//           <div class="flex flex-col mb-5">
//             <p>Auction ending in</p>
//             <p class="text-xl">${formattedDate}</p>
//           </div>
//           <p>${description}</p>
//         </div>

//         <!-- Image and Button Section -->
//         <div class="md:order-2 order-1">
//           <div class="w-full md:h-[400px] h-full">
//             <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-contain" />
//           </div>
//           <div class="mt-5">
//             <button class="w-full bg-black text-white rounded-md hover:bg-gray-600 font-bold py-3" id="bidBtn">
//               Bid Now
//             </button>
//           </div>
//         </div>
//       </div>

//       <div class="mt-10 md:w-[80%] w-[90%] mx-auto">
//         <h2 class="text-lg font-bold">Bids:</h2>
//         ${bids
//           .map(
//             (bid) => `
//             <div class="flex items-center gap-4 mb-4">
//               <img src="${bid.bidder.avatar.url}" alt="${bid.bidder.avatar.alt}" class="w-10 h-10 rounded-full object-cover" />
//               <div>
//                 <p class="font-semibold">${bid.bidder.name}</p>
//                 <p class="text-sm text-gray-500">${bid.bidder.email}</p>
//               </div>
//               <p class="text-lg font-bold text-red-600 ml-auto">${bid.amount} USD</p>
//             </div>
//           `
//           )
//           .join("")}
//       </div>
//     `;

//     const modalOverlay = document.getElementById("modalOverlay");
// const bidModal = document.getElementById("bidModal");
// const bidAmountInput = document.getElementById("bidAmount") as HTMLInputElement;
// const placeBidBtn = document.getElementById("placeBidBtn");
// const closeModalBtn = document.getElementById("closeModalBtn");

// function showModal(postId?: string) {
//   if (modalOverlay && bidModal) {
//     modalOverlay.classList.remove("hidden");
//     bidModal.classList.remove("hidden");

//     if (postId) {
//       console.log(Modal opened for Post ID: ${postId});
//     }
//   }
// }

// function hideModal() {
//   if (modalOverlay && bidModal) {
//     modalOverlay.classList.add("hidden");
//     bidModal.classList.add("hidden");
//     bidAmountInput.value = ""; // Reset input value
//   }
// }

// // Event listeners for placing bid
// placeBidBtn?.addEventListener("click", async () => {
//   const bidAmount = Number(bidAmountInput.value); // Convert to number
//   const userCredits = Number(localStorage.getItem("credits") || "0"); // Convert to number

//   if (isNaN(bidAmount) || bidAmount <= 0) {
//     alert("Please enter a valid bid amount.");
//     return;
//   }

//   if (bidAmount > userCredits) {
//     alert("You do not have enough credits to place this bid.");
//     return;
//   }

//   if (!postId) {
//     alert("Invalid post ID. Please refresh the page.");
//     return;
//   }

//   try {
//     const response = await fetch(${API_AUCTION_POSTS}/${postId}/bids, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: Bearer ${token},
//         "X-Noroff-API-Key": API_KEY,
//       },
//       body: JSON.stringify({ amount: bidAmount }), // Pass as number
//     });

//     console.log("Response status:", response.status);

//     if (response.ok) {
//       alert("Bid placed successfully!");
//       hideModal();

//       // Refetch the post details to update the bids
//       await renderPost(postId); // Smooth update without reloading
//     } else {
//       const errorText = await response.text();
//       console.error("Error response from server:", errorText);
//       alert(Failed to place bid: ${errorText});
//     }
//   } catch (error) {
//     console.error("Error placing bid:", error);
//     alert("An error occurred. Please try again.");
//   }
// });

// closeModalBtn?.addEventListener("click", hideModal);
// modalOverlay?.addEventListener("click", hideModal);

//   } catch (error) {
//     console.error("Error rendering post:", error);
//     postDetail.innerText = "You need to be logged in to bid on items";
//   }
// }

import { API_AUCTION_POSTS, API_KEY } from "../../api/constants";
import { readPost } from "../../api/post/read";
import { getToken } from "../../utilities/token";
import { showModal, hideModal } from "../../utilities/modalutils";

const DEFAULT_IMAGE_URL = "default-image-url.jpg";
const DEFAULT_IMAGE_ALT = "Default image";

async function placeBid(
  postId: string,
  bidAmount: number,
  token: string
): Promise<Response> {
  return fetch(`${API_AUCTION_POSTS}/${postId}/bids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({ amount: bidAmount }),
  });
}

export async function renderPost(postId: string): Promise<void> {
  const postDetail = document.getElementById("blogMainPost");

  if (!postDetail) {
    console.error("Element with ID 'blogMainPost' not found.");
    return;
  }

  try {
    const post = await readPost(postId);
    if (!post) throw new Error("Post not found");

    const {
      title,
      media,
      description,
      _count,
      seller,
      endsAt,
      bids,
    }: {
      title: string;
      media: { url?: string; alt?: string }[];
      description: string;
      _count: { bids?: number };
      seller: { name: string };
      endsAt: string;
      bids: {
        amount: number;
        bidder: {
          name: string;
          email: string;
          avatar: { url: string; alt: string };
        };
      }[];
    } = post;

    const imageUrl = media?.[0]?.url || DEFAULT_IMAGE_URL;
    const imageAlt = media?.[0]?.alt || DEFAULT_IMAGE_ALT;
    const formattedDate = new Date(endsAt).toLocaleDateString("en-GB");
    const bidsCount = _count.bids || 0;

    postDetail.innerHTML = `
      <div class="w-[90%] md:w-[80%] mx-auto grid md:grid-cols-2 md:gap-10 gap-5 items-center">
        <div class="md:order-1 order-2">
          <h1 class="md:text-2xl font-bold mb-5">${title}</h1>
          <p>Information:</p>
          <div class="flex items-center gap-5 mb-5">
            <p class="text-xl">Owned by ${seller.name}</p>
            <p class="flex items-center gap-2 text-lg text-red-600 font-bold">
              <i class="fa-regular fa-eye"></i>
              <span>${bidsCount}</span>
            </p>
          </div>
          <div class="flex flex-col mb-5">
            <p>Auction ending in</p>
            <p class="text-xl">${formattedDate}</p>
          </div>
          <p>${description}</p>
        </div>
        <div class="md:order-2 order-1">
          <div class="w-full md:h-[400px] h-full">
            <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-contain" />
          </div>
          <div class="mt-5">
            <button class="w-full bg-black text-white rounded-md hover:bg-gray-600 font-bold py-3" id="bidBtn">
              Bid Now
            </button>
          </div>
        </div>
      </div>
      <div class="mt-10 md:w-[80%] w-[90%] mx-auto">
        <h2 class="text-lg font-bold">Bids:</h2>
        ${bids
          .map(
            (bid) => `
            <div class="flex items-center gap-4 mb-4">
              <img src="${bid.bidder.avatar.url}" alt="${bid.bidder.avatar.alt}" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="font-semibold">${bid.bidder.name}</p>
                <p class="text-sm text-gray-500">${bid.bidder.email}</p>
              </div>
              <p class="text-lg font-bold text-red-600 ml-auto">${bid.amount} USD</p>
            </div>`
          )
          .join("")}
      </div>
    `;

    const bidBtn = document.getElementById("bidBtn");
    const placeBidBtn = document.getElementById("placeBidBtn");

    // Bid button handler
    bidBtn?.addEventListener("click", () => showModal(postId));

    // Event listeners for placing a bid
    placeBidBtn?.addEventListener("click", async () => {
      const bidAmountInput = document.getElementById(
        "bidAmount"
      ) as HTMLInputElement;
      const bidAmount = Number(bidAmountInput.value);
      const userCredits = Number(localStorage.getItem("credits") || "0");
      const token = getToken();

      if (isNaN(bidAmount) || bidAmount <= 0) {
        alert("Please enter a valid bid amount.");
        return;
      }

      if (bidAmount > userCredits) {
        alert("You do not have enough credits to place this bid.");
        return;
      }

      try {
        const response = await placeBid(postId, bidAmount, token!);

        if (response.ok) {
          alert("Bid placed successfully!");
          hideModal();
          await renderPost(postId); // Refresh data
        } else {
          const errorText = await response.text();
          alert(`Failed to place bid: ${errorText}`);
        }
      } catch (error) {
        console.error("Error placing bid:", error);
        alert("An error occurred. Please try again.");
      }
    });
  } catch (error) {
    console.error("Error rendering post:", error);
    postDetail.innerText = "You need to be logged in to bid on items.";
  }
}
