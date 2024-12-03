import { register } from "../../api/auth/register";

// Function to handle form registration
export async function onRegister(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const registerForm = event.target as HTMLFormElement;

  const name = (registerForm.querySelector("#userName") as HTMLInputElement)
    .value;
  const email = (registerForm.querySelector("#email") as HTMLInputElement)
    .value;
  const password = (registerForm.querySelector("#password") as HTMLInputElement)
    .value;
  const bio = (registerForm.querySelector("#bio") as HTMLTextAreaElement).value;
  const credits = 1000; // Default value for credits

  const loadingSpinner = document.getElementById(
    "loadingSpinner"
  ) as HTMLElement;
  const errorMessage = document.getElementById("errorMessage") as HTMLElement;
  const submitButton = registerForm.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;

  // Ensure all required elements exist
  if (!loadingSpinner || !errorMessage || !submitButton) {
    console.error("Required form elements are missing");
    return;
  }

  // Show loading spinner and disable the submit button
  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;

  try {
    // Make the API call for registration
    const response = await register({ name, email, password, bio, credits });

    if (response.ok) {
      const result = await response.json();
      console.log("Registration successful:", result);
      alert("Registration successful! Redirecting to login...");
      window.location.href = "/auth/login/";
    } else {
      throw new Error("Registration failed");
    }
  } catch (error: unknown) {
    console.error("Error:", error);

    if (error instanceof Error) {
      errorMessage.innerText = `Registration failed: ${error.message}`;
    } else {
      errorMessage.innerText = "An unknown error occurred";
    }

    errorMessage.style.display = "block";
  } finally {
    loadingSpinner.style.display = "none"; // Hide the loading spinner
    submitButton.disabled = false; // Re-enable submit button
  }
}

// Password visibility toggle logic
export function initializePasswordToggle() {
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const togglePasswordButton = document.getElementById(
    "toggle-password"
  ) as HTMLElement;
  const toggleIcon = togglePasswordButton.querySelector("i")!;

  let isPasswordVisible = false;

  togglePasswordButton.addEventListener("click", function () {
    isPasswordVisible = !isPasswordVisible;

    if (isPasswordVisible) {
      passwordInput.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
      togglePasswordButton.setAttribute("aria-label", "Hide Password");
    } else {
      passwordInput.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
      togglePasswordButton.setAttribute("aria-label", "Show Password");
    }
  });
}
