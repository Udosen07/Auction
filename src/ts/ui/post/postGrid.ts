interface Media {
  url: string;
  alt: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  tags: string[];
  media: Media[];
  created: string;
  updated: string;
  endsAt: string;
  _count: {
    bids: number;
  };
}

export function renderPosts(posts: Post[]): void {
  const gridList = document.getElementById("gridMainPost");
  if (!gridList) {
    console.error("Element with ID 'gridMainPost' not found.");
    return;
  }

  gridList.innerHTML = "";

  if (posts.length === 0) {
    gridList.innerHTML = `<h3 class="text-2xl text-black ">No posts available</h3>`;
    return;
  }

  posts.forEach((item) => {
    const div = document.createElement("div");
    div.className = "border-2 p-[10px] cursor-pointer rounded-[20px]";

    const formattedDate = new Date(item.created).toLocaleString();
    const imageUrl =
      item.media[0]?.url ||
      "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=";

    div.innerHTML = `
        <div>
           <img src="${imageUrl}" alt="${
      item.media[0]?.alt || "No image available"
    }" class="w-full h-[200px] object-contain"/>
        <div>

        <div class="flex justify-between items-center">
            <div>
              <h2 class="mt-0 mb-[2px] text-[16px] font-bold">${item.title}</h2>
              <p class="text-[16px] text-[#ababab] mt-0">${formattedDate}</p>
            </div>
            <div>
            <button class="mt-5 py-[5px] px-5 rounded-[10px] text-[16px] font-bold cursor-pointer border-2 border-black" id="bidBtn">Bid</button>
            </div>

        </div>

        <p class="mt-2">${item.description}</p>
        `;

    div.addEventListener("click", () => {
      window.location.href = ` ./post/?id=${item.id}`;
    });

    gridList.appendChild(div);
  });
}

export function liveGridrenderPosts(posts: Post[]): void {
  const gridList = document.getElementById("liveGridPost");
  if (!gridList) {
    console.error("Element with ID 'liveGridPost' not found.");
    return;
  }

  gridList.innerHTML = "";

  if (posts.length === 0) {
    gridList.innerHTML = `<h3 class="text-2xl text-black">No posts available</h3>`;
    return;
  }

  posts.forEach((item) => {
    const container = document.createElement("div");
    container.className = "rounded-[20px] overflow-hidden mb-4"; // No positioning for the container

    const formattedEndDate = new Date(item.endsAt).toLocaleString();

    // Create the container for background and content using Flexbox
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "flex flex-col"; // Flexbox layout for stacking background and content

    // Background image container (no positioning)
    const bgImageDiv = document.createElement("div");
    bgImageDiv.className = "h-[200px] bg-cover bg-center bg-no-repeat w-full"; // Background image container
    bgImageDiv.style.backgroundImage = ` url(${
      item.media[0]?.url ||
      "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4="
    })`;

    // Bid count (using flex to align it at the top-left without positioning)
    const bidCountDiv = document.createElement("div");
    bidCountDiv.className =
      "flex items-center justify-start gap-2 p-2 bg-[#D32525] text-white text-sm font-bold rounded max-w-max"; // Flex to align bid count
    bidCountDiv.innerHTML = `
        <i class="fa-regular fa-eye"></i>
        <span>${item._count.bids || 0}</span> `;

    // Add the bid count to the background image container
    bgImageDiv.appendChild(bidCountDiv);

    // Content container (below the background image)
    const contentDiv = document.createElement("div");
    contentDiv.className = "p-3 bg-white";

    contentDiv.innerHTML = `
            <div class="flex justify-between items-center">
              <div>
                <h2 class="mt-0 mb-[2px] text-[16px] font-bold">${item.title}</h2>
                <p class="text-[16px] text-[#1E9600] mt-0 flex gap-5 items-center">Live <i class="fa-solid fa-circle text-[10px]"></i></p>
              </div>
              <div>
                <button class="mt-5 py-[5px] px-5 rounded-[10px] text-[16px] font-bold cursor-pointer border-2 border-black" id="bidBtn">Bid</button>
              </div>
            </div>
            <p class="mt-2">${item.description}</p>
            <p class="mt-4 mb-2 text-red-700">Ending: ${formattedEndDate}</p>
            `;

    // Navigation listener for container click
    contentWrapper.addEventListener("click", () => {
      window.location.href = `./post/?id=${item.id}`;
    });

    // Append the background image container and content container to the wrapper
    contentWrapper.appendChild(bgImageDiv);
    contentWrapper.appendChild(contentDiv);

    // Append the content wrapper to the container
    container.appendChild(contentWrapper);

    // Append the main container to the grid list
    gridList.appendChild(container);
  });
}

export function winGridrenderPosts(posts: Post[]): void {
  const gridList = document.getElementById("winGridPost");
  if (!gridList) {
    console.error("Element with ID 'liveGridPost' not found.");
    return;
  }

  gridList.innerHTML = "";

  if (posts.length === 0) {
    gridList.innerHTML = `<h3 class="text-2xl text-black">No Wins available</h3>`;
    return;
  }

  posts.forEach((item) => {
    const container = document.createElement("div");
    container.className = "rounded-[20px] overflow-hidden mb-4"; // No positioning for the container

    const formattedEndDate = new Date(item.endsAt).toLocaleString();

    // Create the container for background and content using Flexbox
    const contentWrapper = document.createElement("div");
    contentWrapper.className = "flex flex-col"; // Flexbox layout for stacking background and content

    // Background image container (no positioning)
    const bgImageDiv = document.createElement("div");
    bgImageDiv.className = "h-[200px] bg-cover bg-center bg-no-repeat w-full"; // Background image container
    bgImageDiv.style.backgroundImage = ` url(${
      item.media[0]?.url ||
      "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4="
    })`;

    // Bid count (using flex to align it at the top-left without positioning)
    const bidCountDiv = document.createElement("div");
    bidCountDiv.className =
      "flex items-center justify-start gap-2 p-2 bg-[#D32525] text-white text-sm font-bold rounded max-w-max"; // Flex to align bid count
    bidCountDiv.innerHTML = `
        <i class="fa-regular fa-eye"></i>
        <span>${item._count.bids || 0}</span> `;

    // Add the bid count to the background image container
    bgImageDiv.appendChild(bidCountDiv);

    // Content container (below the background image)
    const contentDiv = document.createElement("div");
    contentDiv.className = "p-3 bg-white";

    contentDiv.innerHTML = `
            <div class="flex justify-between items-center">
              <div>
                <h2 class="mt-0 mb-[2px] text-[16px] font-bold">${item.title}</h2>
                <p class="text-[16px] text-[#1E9600] mt-0 flex gap-5 items-center">Live <i class="fa-solid fa-circle text-[10px]"></i></p>
              </div>
              <div>
                <button class="mt-5 py-[5px] px-5 rounded-[10px] text-[16px] font-bold cursor-pointer border-2 border-black" id="bidBtn">Bid</button>
              </div>
            </div>
            <p class="mt-2">${item.description}</p>
            <p class="mt-4 mb-2 text-red-700">Ending: ${formattedEndDate}</p>
            `;

    // Navigation listener for container click
    contentWrapper.addEventListener("click", () => {
      window.location.href = `./post/?id=${item.id}`;
    });

    // Append the background image container and content container to the wrapper
    contentWrapper.appendChild(bgImageDiv);
    contentWrapper.appendChild(contentDiv);

    // Append the content wrapper to the container
    container.appendChild(contentWrapper);

    // Append the main container to the grid list
    gridList.appendChild(container);
  });
}
