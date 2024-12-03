import { initializePasswordToggle, onRegister } from "../../ui/auth/register";

const form = document.forms.namedItem("registerForm") as HTMLFormElement | null;

if (form) {
  form.addEventListener("submit", onRegister);
} else {
  console.error("Form with name 'registerForm' not found");
}

initializePasswordToggle();
