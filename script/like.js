const accessKey = "VjtWTJIo6Gd50a3fz-Wp4VWOe0PjhhoRez05xaqfE3c";

const container = document.querySelector(".liked-images-container");

function displayLikedImages() {
  container.innerHTML = "";

  const likedImages = JSON.parse(localStorage.getItem("likedImages")) || {};

  if (Object.keys(likedImages).length === 0) {
    container.innerHTML = "<p>Hali hech qanday rasmlar yoqilgan emas.</p>";
    return;
  }

  Object.values(likedImages).forEach((image) => {
    const imgBox = document.createElement("div");
    imgBox.classList = "img-box";

    const img = document.createElement("img");
    img.src = image.urls.thumb;
    img.className = "best-img";
    imgBox.appendChild(img);

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.innerText = isLiked(image.id) ? "❤️" : "🤍";

    likeBtn.onclick = () => {
      toggleLike(image.id, image);
      likeBtn.innerText = isLiked(image.id) ? "❤️" : "🤍";
      displayLikedImages();
    };

    img.onclick = () => {
      const loadingOverlay = document.createElement("div");
      loadingOverlay.className = "loading-overlay";
      loadingOverlay.innerText = "Loading...";
      imgBox.appendChild(loadingOverlay);

      setTimeout(() => {
        displayModal(image.id);
        loadingOverlay.remove();
      }, 1500);
    };

    imgBox.appendChild(likeBtn);
    container.appendChild(imgBox);
  });
}

function toggleLike(id, image) {
  let liked = JSON.parse(localStorage.getItem("likedImages")) || {};

  if (liked[id]) {
    delete liked[id];
  } else {
    liked[id] = image;
  }

  localStorage.setItem("likedImages", JSON.stringify(liked));
}

function isLiked(id) {
  const liked = JSON.parse(localStorage.getItem("likedImages")) || {};
  return liked.hasOwnProperty(id);
}

function displayModal(id) {
  fetch(`https://api.unsplash.com/photos/${id}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const modalBack = document.createElement("div");
      modalBack.className = "modal-back";

      const display = document.createElement("div");
      display.className = "modal";

      const img = document.createElement("img");
      img.src = data.urls.small;
      img.className = "modal-img";

      const btn = document.createElement("button");
      btn.className = "like-btn";
      btn.innerHTML = isLiked(data.id) ? "❤️" : "🤍";

      btn.onclick = () => {
        toggleLike(data.id, data);
        btn.innerHTML = isLiked(data.id) ? "❤️" : "🤍";
        displayLikedImages();
      };

      display.appendChild(img);
      display.appendChild(btn);
      modalBack.appendChild(display);
      document.body.appendChild(modalBack);

      modalBack.onclick = (e) => {
        if (e.target === modalBack) {
          modalBack.remove();
        }
      };
    })
    .catch((error) => {
      console.error("Xatolik yuz berdi:", error);
    });
}

document.addEventListener("DOMContentLoaded", displayLikedImages);
