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

      let exit = document.createElement('div');
      exit.classList = 'exit'
      
      exit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg>';
      exit.onclick = () => {
        display.classList.add("closing");
        modalBack.classList.add("closing");
      
        setTimeout(() => {
          modalBack.remove();
        }, 300);
      };

      const display = document.createElement("div");
      display.className = "modal";

      const img = document.createElement("img");
      img.src = data.urls.small;
      img.className = "modal-img";

      const btn = document.createElement("button");
      btn.className = "modal-btn";
      btn.innerHTML = isLiked(data.id) ? "❤️" : "🤍";

      btn.onclick = () => {
        toggleLike(data.id, data);
        btn.innerHTML = isLiked(data.id) ? "❤️" : "🤍";
      };

      display.appendChild(img);
      display.appendChild(btn);
      modalBack.appendChild(exit);
      modalBack.appendChild(display);
      document.body.appendChild(modalBack);

      modalBack.onclick = (e) => {
        if (e.target === modalBack) {
          display.classList.add("closing");
          modalBack.classList.add("closing");
      
          setTimeout(() => {
            modalBack.remove();
          }, 300);
        }
      };
    })
    .catch((error) => {
      console.error("Xatolik yuz berdi:", error);
    });
}

document.addEventListener("DOMContentLoaded", displayLikedImages);
