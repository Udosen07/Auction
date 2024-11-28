import "./style.css";
import { liveGridreadProfiles } from "./ts/api/profile/read";
import { liveGridrenderPosts } from "./ts/ui/post/postGrid";
import { updatePaginationControls } from "./ts/utilities/Pagination";

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (href === currentPath) {
      link.classList.add("border-black"); // Add black border for active link
      link.classList.remove("border-transparent"); // Ensure no transparent border
    } else {
      link.classList.remove("border-black"); // Remove black border for non-active links
      link.classList.add("border-transparent"); // Ensure transparent border for non-active links
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
const credits = localStorage.getItem("credits"); // Fetch credits from localStorage

const createListingButton = document.getElementById("createListingButton");

// Check if the user is logged in
if (name && createListingButton) {
  // If logged in, display the Create Listing button
  createListingButton.classList.remove("hidden");
}

if (authButtonsContainer) {
  if (name) {
    // If the user is logged in (username exists in localStorage)

    // Create balance display
    const balanceDiv = document.createElement("div");
    balanceDiv.className =
      "py-[5px] px-[25px] border-[3px] border-black bg-black rounded-[5px] text-[17px] font-normal cursor-pointer text-white";
    balanceDiv.innerText = `$${credits || 1000}`; // Default to 1000 if credits are not set

    // Create logout button
    const logoutButton = document.createElement("button");
    logoutButton.className =
      "py-[5px] px-[25px] border-[3px] border-black rounded-[5px] text-[17px] font-normal cursor-pointer bg-white text-black";
    logoutButton.innerText = "Logout";

    // Add click event to clear username and credits from localStorage
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("credits");
      window.location.replace("/auth/login/"); // Redirect to login
    });

    // Append balance and logout button to the container
    authButtonsContainer.appendChild(balanceDiv);
    authButtonsContainer.appendChild(logoutButton);

    // Bid Function Example
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
  } catch (error) {
    console.error("Error initializing homepage:", error);
  }
}

initializeAuctionPage();
