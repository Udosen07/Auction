import { createPost } from "../../api/post/create";

interface Media {
  url: string;
  alt: string;
}

interface PostData {
  title: string;
  media: Media[];
  description: string;
  endsAt: string;
}

export async function onCreatePost(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const titleInput = document.getElementById("title") as HTMLInputElement;
  const endsAtInput = document.getElementById("endsAt") as HTMLInputElement;
  const imageInput = document.getElementById("image") as HTMLInputElement;
  const bodyInput = document.getElementById("content") as HTMLTextAreaElement;
  const loadingSpinner = document.getElementById(
    "loadingSpinner"
  ) as HTMLElement;
  const errorMessage = document.getElementById("errorMessage") as HTMLElement;
  const submitButton = form.querySelector(
    "button[type='submit']"
  ) as HTMLButtonElement;

  // Ensure all required elements exist
  if (
    !titleInput ||
    !endsAtInput ||
    !imageInput ||
    !bodyInput ||
    !loadingSpinner ||
    !errorMessage ||
    !submitButton
  ) {
    console.error("Required form elements are missing");
    return;
  }

  // Show loading spinner and disable the submit button
  loadingSpinner.style.display = "block";
  errorMessage.style.display = "none";
  submitButton.disabled = true;

  // Construct the post data
  const postData: PostData = {
    title: titleInput.value.trim(),
    media: [
      {
        url: imageInput.value.trim(),
        alt: `Image for ${titleInput.value.trim()}`, // Use title for alt text
      },
    ],
    description: bodyInput.value.trim(),
    endsAt: new Date(endsAtInput.value).toISOString(), // Convert to ISO format
  };

  try {
    const response = await createPost(postData);

    if (response.ok) {
      const data = await response.json();
      console.log("Post created:", data);
      alert("Post created successfully!");
      form.reset(); // Reset form inputs
    } else {
      const errorData = await response.json();
      const errorMessages = errorData.errors
        .map((e: { message: string }) => e.message)
        .join(", ");
      errorMessage.innerText = `Failed to create post: ${errorMessages}`;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error creating post:", error);
    errorMessage.innerText = `Creating post failed: ${
      (error as Error).message
    }`;
    errorMessage.style.display = "block";
  } finally {
    loadingSpinner.style.display = "none"; // Hide loading spinner
    submitButton.disabled = false; // Re-enable submit button
  }
}
