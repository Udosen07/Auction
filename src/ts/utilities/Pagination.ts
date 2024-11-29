// Declare or import the required interfaces
export interface Meta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface ApiResponse {
  data: any[]; // Adjust this type to match your actual data structure
  meta: Meta;
}

// UpdatePaginationControls function
export function updatePaginationControls(
  meta: Meta,
  currentPage: number, // Current page number
  limit: number, // Items per page
  readProfiles: (params: {
    limit: number;
    page: number;
    [key: string]: any;
  }) => Promise<ApiResponse>, // Generic API fetch function
  targetId: string, // ID of the target pagination container
  renderFunction: (posts: any[]) => void // Function to render the posts
): void {
  const paginationControls = document.getElementById(targetId);

  if (!paginationControls) {
    console.error(
      `Pagination controls element with ID '${targetId}' not found`
    );
    return;
  }

  paginationControls.innerHTML = ""; // Clear existing pagination controls

  const totalPages = meta.pageCount;
  const rangeStart = Math.floor((currentPage - 1) / 3) * 3 + 1;
  const rangeEnd = Math.min(rangeStart + 2, totalPages);

  // Previous Button
  if (!meta.isFirstPage) {
    const prevButton = document.createElement("button");
    prevButton.innerHTML = `&lt;`;
    prevButton.className =
      "text-[#06113e] text-xl font-bold rounded-lg mx-2 hover:text-[#0a1a50] transition-all";

    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        readProfiles({ limit, page: currentPage - 1 }).then((response) => {
          renderFunction(response.data);
          updatePaginationControls(
            response.meta,
            currentPage - 1,
            limit,
            readProfiles,
            targetId,
            renderFunction
          );
        });
      }
    });
    paginationControls.appendChild(prevButton);
  }

  // Page Numbers
  for (let i = rangeStart; i <= rangeEnd; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i.toString();
    pageButton.className =
      "px-4 py-2 bg-[#06113e] text-white font-bold rounded-lg mx-1 hover:bg-[#0a1a50] transition-all";

    if (i === currentPage) {
      pageButton.classList.add("bg-[#3b5a91]");
    }

    pageButton.addEventListener("click", () => {
      readProfiles({ limit, page: i }).then((response) => {
        renderFunction(response.data);
        updatePaginationControls(
          response.meta,
          i,
          limit,
          readProfiles,
          targetId,
          renderFunction
        );
      });
    });

    paginationControls.appendChild(pageButton);
  }

  // Next Button
  if (!meta.isLastPage) {
    const nextButton = document.createElement("button");
    nextButton.innerHTML = `&gt;`;
    nextButton.className =
      "text-[#06113e] text-xl font-bold rounded-lg mx-2 hover:text-[#0a1a50] transition-all";

    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        readProfiles({ limit, page: currentPage + 1 }).then((response) => {
          renderFunction(response.data);
          updatePaginationControls(
            response.meta,
            currentPage + 1,
            limit,
            readProfiles,
            targetId,
            renderFunction
          );
        });
      }
    });
    paginationControls.appendChild(nextButton);
  }
}
