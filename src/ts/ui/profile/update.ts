import { readProfile } from "../../api/profile/read";
import { updateProfile } from "../../api/profile/update";

interface ProfileData {
  bio: string;
  avatar: { url: string; alt: string };
  credits: number;
  _count: { listings: number; wins: number };
  name: string;
}

export async function onUpdateProfile() {
  // Get the form element
  const form = document.getElementById("updateProfileForm") as HTMLFormElement;

  // Retrieve the username from localStorage
  const username = localStorage.getItem("username");

  // Fetch the profile data from the API
  async function fetchProfileData(): Promise<ProfileData | null> {
    if (!username) {
      console.error("Username not found in localStorage");
      return null; // Return null if no username
    }

    try {
      const { data } = await readProfile(username);
      console.log("Fetched profile data:", data); // Add this log
      populateForm(data); // Populate the form with the fetched data
      return data; // Return the profile data
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null; // Return null if there is an error
    }
  }

  // Populate the form with the current profile data
  function populateForm(data: ProfileData): void {
    // Set the content of various elements based on the profile data
    document.getElementById("name")!.textContent = data.name;
    document.getElementById("userbio")!.textContent = data.bio;
    document.getElementById("fpost")!.textContent = data.credits.toString();
    document.getElementById("ffollowers")!.textContent =
      data._count.listings.toString();
    document.getElementById("ffollowing")!.textContent =
      data._count.wins.toString();

    // Set the profile picture with a default fallback if no picture exists
    const pixDisplay = document.getElementById(
      "profilePic"
    ) as HTMLImageElement;
    pixDisplay.src =
      data.avatar?.url ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcWx0NPH9j0MNrMVNHmxGmtlyq5aI8H6O1eA&s";
  }

  // Handle form submission when the user updates their profile
  async function handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault(); // Prevent the default form submission

    // Get the input fields for avatar URL and bio
    const avatarInput = document.querySelector<HTMLInputElement>("#avatar");
    const bioTextarea = document.querySelector<HTMLTextAreaElement>("#bio");

    // Check if the username, avatar input, and bio textarea exist
    if (!username || !avatarInput || !bioTextarea) {
      console.error("Required elements or username missing");
      return; // Exit if required elements are missing
    }

    // Get the values entered by the user
    const bioValue = bioTextarea.value.trim();
    const avatarValue = avatarInput.value.trim();

    // If both fields are empty, show an alert and stop
    if (!bioValue && !avatarValue) {
      alert("Please provide at least a bio or an avatar URL.");
      return;
    }

    try {
      // Fetch the current profile data to get the existing values
      const currentProfile = await fetchProfileData();
      if (!currentProfile) return; // If no profile data, stop

      // Prepare the data to update (keep the existing values if not updated)
      const profileData: { bio?: string; avatar?: string | null } = {};

      // Update the bio if the user entered a new one
      if (bioValue) {
        profileData.bio = bioValue;
      } else {
        profileData.bio = currentProfile.bio; // Retain existing bio if not updated
      }

      // Update the avatar if the user entered a new one
      if (avatarValue) {
        profileData.avatar = avatarValue;
      } else {
        profileData.avatar = currentProfile.avatar?.url || ""; // Retain existing avatar if not updated
      }

      // Call the updateProfile function to send the updated data to the API
      const updatedData = await updateProfile(username, profileData);

      // Update the profile picture with the new avatar (or retain the old one)
      const pixDisplay = document.getElementById(
        "profilePic"
      ) as HTMLImageElement;
      pixDisplay.src =
        updatedData.avatar?.url || currentProfile.avatar?.url || "";

      // Show a success message and refresh the profile display
      alert("Profile updated successfully!");
      fetchProfileData(); // Reload the profile data
      form.reset(); // Reset the form after submission
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  }

  // Attach the submit event listener to the form
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Initially fetch and populate the profile data
  fetchProfileData();
}

onUpdateProfile(); // Call the function to start the process
