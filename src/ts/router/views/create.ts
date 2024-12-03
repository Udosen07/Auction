import { onCreatePost } from "../../ui/post/create";

// Attach the event listener to the form
const form = document.forms.namedItem("createPost") as HTMLFormElement | null;

if (form) {
  form.addEventListener("submit", onCreatePost);
} else {
  console.error("Form with name 'createPost' not found");
}
