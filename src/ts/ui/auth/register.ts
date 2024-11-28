import { register } from "../../api/auth/register.ts";

export async function onRegister(event: SubmitEvent) {
  event.preventDefault();

  const registerForm = event.target as HTMLFormElement;

  const name = (registerForm.querySelector("#userName") as HTMLInputElement)
    .value;
  const email = (registerForm.querySelector("#email") as HTMLInputElement)
    .value;
  const password = (registerForm.querySelector("#password") as HTMLInputElement)
    .value;
  const bio = (registerForm.querySelector("#bio") as HTMLTextAreaElement).value;
  const credits = 1000;
  const loadingSpinner = document.getElementById(
    "loadingSpinner"
  ) as HTMLElement;
  const errorMessage = document.getElementById("errorMessage") as HTMLElement;
  const submitButton = registerForm.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;

  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;

  try {
    const response = await register({
      name,
      email,
      password,
      bio,
      credits,
    });

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
    loadingSpinner.style.display = "none";
    submitButton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector(
    "#registerForm"
  ) as HTMLFormElement;
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});

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
