import "./style.css";
import {
  liveGridreadProfiles,
  winGridreadProfiles,
} from "./ts/api/profile/read";
import { fetchCredits } from "./ts/api/utilities/fetchCredits";
import { searchListings } from "./ts/api/utilities/search";
import { liveGridrenderPosts, winGridrenderPosts } from "./ts/ui/post/postGrid";
import { updatePaginationControls } from "./ts/utilities/Pagination";

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

const name = localStorage.getItem("username"); // Get username from localStorage

const createListingButton = document.getElementById("createListingButton");

// Check if the user is logged in
if (name && createListingButton) {
  // If logged in, display the Create Listing button
  createListingButton.classList.remove("hidden");
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

    async function updateUserCredits(username: string): Promise<void> {
      try {
        const credits = await fetchCredits(username); // Call the fetchCredits function from api.ts
        balanceDiv.innerText = `$${credits}`;
      } catch (error) {
        balanceDiv.innerText = "$0"; // Default balance if an error occurs
      }
    }

    // Fetch credits for the logged-in user
    updateUserCredits(name); // Call with the actual username
  } else {
    // If the user is not logged in (no username in localStorage)

    // Create register button
    const registerButton = document.createElement("a");
    registerButton.href = "/auth/register/";
    registerButton.className =
      "py-[5px] px-[25px] border-[3px] border-black bg-black rounded-[5px] text-[17px] font-normal cursor-pointer text-white no-underline";
    registerButton.innerText = "Register";

    // Create login button
    const loginButton = document.createElement("a");
    loginButton.href = "/auth/login/";
    loginButton.className =
      "py-[5px] px-[25px] border-[3px] border-black rounded-[5px] text-[17px] font-normal cursor-pointer bg-white no-underline text-black";
    loginButton.innerText = "Login";

    // Append register and login buttons to the container
    authButtonsContainer.appendChild(registerButton);
    authButtonsContainer.appendChild(loginButton);
  }
}

let page = 1;
const limit = 6;

async function initializeAuctionPage() {
  const name = localStorage.getItem("username");
  try {
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

    // Fetch and render winning posts
    if (name) {
      // Ensure name is defined before calling winGridreadProfiles
      const winGridResponse = await winGridreadProfiles({ name, limit, page }); // Pass name as a string
      winGridrenderPosts(winGridResponse.data || []);
      updatePaginationControls(
        winGridResponse.meta,
        page,
        limit,
        (params) => winGridreadProfiles({ ...params, name }),
        "winGridpaginationControls",
        winGridrenderPosts // Use correct render function for winning posts
      );
    } else {
      console.warn(
        "No username found in localStorage. Skipping winnings section."
      );
    }
  } catch (error) {
    console.error("Error initializing homepage:", error);
  }
}

initializeAuctionPage();

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
 * Fetch listings based on the search query and render them
 * @param query - The search query
 */
async function fetchSearchResults(query: string): Promise<void> {
  try {
    // Show loading state
    mainBody.innerHTML = "<p>Loading...</p>";

    const listings = await searchListings(query); // Call the separate API function
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
              <img src="${listing.media[0]?.url}" alt="${listing.media[0]?.alt}"
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
    debounceTimeout = window.setTimeout(() => {
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
