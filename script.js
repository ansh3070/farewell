document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalDownload = document.getElementById("modal-download");
  const closeModal = document.getElementById("close-modal");
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("error");

  // 🔹 Replace these with your API Key & Folder ID
  const API_KEY = "AIzaSyChiR1c-41WZbHCjOI-iqrxlIpy3wGektQ";
  const FOLDER_ID = "17r67lCw9EXSiuLcRo-djsZ2kLgZxORqW";

  async function fetchImagesFromDrive() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}&fields=files(id,name,thumbnailLink,webContentLink,mimeType)`
      );
      const data = await response.json();

      if (!data.files || data.files.length === 0) {
        throw new Error("No images found in the folder.");
      }

      // ✅ Hide loading indicator
      loading.style.display = "none";

      data.files.forEach((file) => {
        if (!file.mimeType.startsWith("image/")) return; // Skip non-image files

        const imgContainer = document.createElement("div");
        imgContainer.className = "image-container";

        const img = document.createElement("img");
        img.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w500`; // Adjust size
        img.alt = file.name;
        img.classList.add("gallery-image");

        // 🔹 Open modal on click
        img.addEventListener("click", () => {
          modalImage.src = `https://drive.google.com/uc?id=${file.id}`;
          modalDownload.href = file.webContentLink;
          modal.style.display = "flex";
        });

        // 🔹 Download button
        const downloadBtn = document.createElement("a");
        downloadBtn.href = file.webContentLink;
        downloadBtn.download = file.name;
        downloadBtn.innerHTML = "⬇";
        downloadBtn.classList.add("download-btn");

        imgContainer.appendChild(img);
        imgContainer.appendChild(downloadBtn);
        gallery.appendChild(imgContainer);
      });
    } catch (error) {
      console.error("❌ Error fetching images:", error);
      loading.style.display = "none";
      errorMessage.style.display = "block";
    }
  }

  fetchImagesFromDrive();

  // 🔹 Close modal when clicking the close button
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 🔹 Close modal when clicking outside the image
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
