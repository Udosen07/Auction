const modalOverlay = document.getElementById("modalOverlay");
const bidModal = document.getElementById("bidModal");
const bidAmountInput = document.getElementById("bidAmount") as HTMLInputElement;
const closeModalBtn = document.getElementById("closeModalBtn"); // Make sure close button has this ID

export function showModal(postId?: string): void {
  if (modalOverlay && bidModal) {
    modalOverlay.classList.remove("hidden");
    bidModal.classList.remove("hidden");

    if (postId) {
      console.log(`Modal opened for Post ID: ${postId}`);
    }
  }
}

export function hideModal(): void {
  if (modalOverlay && bidModal) {
    modalOverlay.classList.add("hidden");
    bidModal.classList.add("hidden");

    if (bidAmountInput) {
      bidAmountInput.value = ""; // Reset input value
    }
  }
}

// Event listener for overlay click
modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    // Make sure it's the overlay clicked, not inside modal
    hideModal();
  }
});

// Event listener for close modal button
closeModalBtn?.addEventListener("click", (e) => {
  e.stopPropagation(); // Stop the click event from bubbling up
  hideModal();
});
