import { login } from "../../api/auth/login";

// Function to handle form login
export async function onLogin(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const loginForm = event.target as HTMLFormElement;

  const email = (loginForm.querySelector("#email") as HTMLInputElement).value;
  const password = (loginForm.querySelector("#password") as HTMLInputElement)
    .value;
  const loadingSpinner = document.getElementById(
    "loadingSpinner"
  ) as HTMLElement | null;
  const errorMessage = document.getElementById(
    "errorMessage"
  ) as HTMLElement | null;
  const submitButton = loginForm.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;

  // Ensure all required elements exist
  if (!loadingSpinner || !errorMessage || !submitButton) {
    console.error("Required elements are missing");
    return;
  }

  // Show loading spinner and disable the submit button
  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;

  try {
    const response = await login({ email, password });

    if (response.ok) {
      const result = await response.json();
      console.log("Login successful:", result);
      localStorage.setItem("username", result.data.name);
      localStorage.setItem("token", result.data.accessToken);

      window.location.replace("/");
    } else {
      throw new Error("Login failed");
    }
  } catch (error: unknown) {
    console.error("Error:", error);

    if (error instanceof Error) {
      errorMessage.innerText = `Login failed: ${error.message}`;
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
  const passwordInput = document.getElementById(
    "password"
  ) as HTMLInputElement | null;
  const togglePasswordButton = document.getElementById(
    "toggle-password"
  ) as HTMLElement | null;

  if (!passwordInput || !togglePasswordButton) {
    throw new Error("Required elements not found in the DOM");
  }

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
