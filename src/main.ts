import {
  API_AUCTION_POSTS,
  API_AUCTION_PROFILE,
  API_KEY,
} from "./ts/api/constants";
import { readProfiles, liveGridreadProfiles } from "./ts/api/profile/read";
import { renderPosts, liveGridrenderPosts } from "./ts/ui/post/postGrid";
import { updatePaginationControls } from "./ts/utilities/Pagination";
import { getToken } from "./ts/utilities/token";

const token = getToken();
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (href === currentPath) {
      link.classList.add("border-black"); // Active link style
      link.classList.remove("border-transparent");
    } else {
      link.classList.remove("border-black");
      link.classList.add("border-transparent");
    }
  });
});

const hamburger = document.getElementById("hamburger") as HTMLElement | null;

if (hamburger) {
  hamburger.addEventListener("click", () => {
    const menu = document.getElementById("navLinks") as HTMLElement | null;
    if (menu) {
      menu.classList.toggle("hidden");
      menu.classList.toggle("flex");
    }
  });
}

const authButtonsContainer = document.getElementById("authButtons");
const name = localStorage.getItem("username");
const createListingButton = document.getElementById("createListingButton");

if (name && createListingButton) {
  createListingButton.classList.remove("hidden"); // Show Create Listing button
}

if (authButtonsContainer) {
  if (name) {
    // If logged in, create balance display and logout button
    const balanceDiv = document.createElement("div");
    balanceDiv.className =
      "py-[5px] px-[25px] border-[3px] border-black bg-black rounded-[5px] text-[17px] font-normal cursor-pointer text-white";
    balanceDiv.innerText = `$0`; // Default balance

    const logoutButton = document.createElement("button");
    logoutButton.className =
      "py-[5px] px-[25px] border-[3px] border-black rounded-[5px] text-[17px] font-normal cursor-pointer bg-white text-black";
    logoutButton.innerText = "Logout";

    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("credits");
      localStorage.removeItem("token");
      window.location.replace("/auth/login/"); // Redirect to login page
    });

    authButtonsContainer.appendChild(balanceDiv);
    authButtonsContainer.appendChild(logoutButton);

    async function fetchCredits(username: string) {
      try {
        // Get the token for authorization
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
        const userCredits = userProfile.data.credits || 0; // Assume credits are in the profile

        // Store and update credits
        localStorage.setItem("credits", userCredits.toString());
        balanceDiv.innerText = `$${userCredits}`;
      } catch (error) {
        console.error("Error fetching credits:", error);
        balanceDiv.innerText = `$0`; // Default balance if error occurs
      }
    }

    // Fetch credits on page load for the logged-in user
    fetchCredits(name); // Pass the username to fetch the credits dynamically
  } else {
    // If not logged in, show login and register buttons
    const registerButton = document.createElement("a");
    registerButton.href = "/auth/register/";
    registerButton.className =
      "py-[5px] px-[25px] border-[3px] border-black bg-black rounded-[5px] text-[17px] font-normal cursor-pointer text-white no-underline";
    registerButton.innerText = "Register";

    const loginButton = document.createElement("a");
    loginButton.href = "/auth/login/";
    loginButton.className =
      "py-[5px] px-[25px] border-[3px] border-black rounded-[5px] text-[17px] font-normal cursor-pointer bg-white no-underline text-black";
    loginButton.innerText = "Login";

    authButtonsContainer.appendChild(registerButton);
    authButtonsContainer.appendChild(loginButton);
  }
}

let page = 1;
const limit = 3;

async function initializeHomePage() {
  try {
    const postsResponse = await readProfiles({ limit, page });
    renderPosts(postsResponse.data || []);
    updatePaginationControls(
      postsResponse.meta,
      page,
      limit,
      readProfiles,
      "paginationControls",
      renderPosts
    );

    const liveGridResponse = await liveGridreadProfiles({ limit, page });
    liveGridrenderPosts(liveGridResponse.data || []);
    updatePaginationControls(
      liveGridResponse.meta,
      page,
      limit,
      liveGridreadProfiles,
      "liveGridpaginationControls",
      liveGridrenderPosts
    );
  } catch (error) {
    console.error("Error initializing homepage:", error);
  }
}

initializeHomePage();

// Select DOM elements for both desktop and mobile search bars
const desktopSearchInput = document.getElementById(
  "desktopSearch"
) as HTMLInputElement;
const desktopSearchIcon = document.getElementById(
  "desktopSearchIcon"
) as HTMLElement;

const mobileSearchInput = document.getElementById(
  "mobileSearch"
) as HTMLInputElement;
const mobileSearchIcon = document.getElementById(
  "mobileSearchIcon"
) as HTMLElement;

const mainBody = document.getElementById("mainBody") as HTMLElement;

let debounceTimeout: number;

// Define the Listing type
interface Listing {
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
 * Fetch listings based on the search query
 * @param query - The search query
 */
async function fetchSearchResults(query: string): Promise<void> {
  try {
    // Show loading state
    mainBody.innerHTML = "<p>Loading...</p>";

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
    renderSearchResults(listings);
  } catch (error) {
    console.error(error);
    mainBody.innerHTML = "<p>Error fetching search results.</p>";
  }
}

/**
 * Render search results in the DOM
 * @param listings - The list of fetched listings
 */
function renderSearchResults(listings: Listing[]): void {
  if (listings.length === 0) {
    mainBody.innerHTML = "<p>No listings found.</p>";
    return;
  }

  mainBody.innerHTML = `
    <div class="md:w-[80%] mx-auto w-[90%] mt-20">
      <h1 class="text-2xl mb-2 font-bold">Search Results</h1>
      <div class="bg-white mb-10 grid md:grid-cols-3 grid-cols-1 gap-5 p-10 rounded-xl">
        ${listings
          .map(
            (listing) => `
            <div 
              class="p-4 border rounded shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onclick="window.location.href = './post/?id=${listing.id}'"
            >
              <img src="${listing.media[0]?.url}" alt="${
              listing.media[0]?.alt
            }" 
                class="w-full h-48 object-cover rounded mb-2">
              <h3 class="font-bold text-lg">${listing.title}</h3>
              <p class="text-sm mb-2">${listing.description}</p>
              <p class="text-gray-600 mb-2">Ends At: ${new Date(
                listing.endsAt
              ).toLocaleDateString()}</p>
              <p class="text-red-600 text-sm font-bold">${
                listing._count.bids
              } bid(s)</p>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;
}

/**
 * Reset the page by reloading
 */
function resetMainBody(): void {
  location.reload(); // Reload the page to reset the state and reinitialize the API calls
}

/**
 * Add search functionality with debouncing
 * @param searchInput - Input element for search
 * @param searchIcon - Icon element for triggering search
 */
function addSearchListeners(
  searchInput: HTMLInputElement,
  searchIcon: HTMLElement
): void {
  // Trigger search on typing with debouncing
  searchInput.addEventListener("input", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (query) {
        fetchSearchResults(query);
      } else {
        resetMainBody();
      }
    }, 300); // Debounce with 300ms delay
  });

  // Trigger search on clicking the search icon
  searchIcon.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      fetchSearchResults(query);
    } else {
      resetMainBody();
    }
  });
}

// Add search listeners for desktop and mobile search bars
addSearchListeners(desktopSearchInput, desktopSearchIcon);
addSearchListeners(mobileSearchInput, mobileSearchIcon);
