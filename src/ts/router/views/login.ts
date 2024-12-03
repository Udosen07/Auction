import { onLogin } from "../../ui/auth/login";
import { initializePasswordToggle } from "../../ui/auth/login";

// Attach the event listener to the form
const form = document.forms.namedItem("loginForm") as HTMLFormElement | null;

if (form) {
  form.addEventListener("submit", onLogin);
} else {
  console.error("Form with name 'loginForm' not found");
}

initializePasswordToggle();
