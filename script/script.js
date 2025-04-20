const accessKey = "VjtWTJIo6Gd50a3fz-Wp4VWOe0PjhhoRez05xaqfE3c";
const imgContainer = document.querySelector(".img-container");
const base_url = `https://api.unsplash.com/photos/?client_id=${accessKey}`;

async function getFetch() {
  try {
    let result = await fetch(base_url);
    let data = await result.json();
    renderImg(data);
  } catch (error) {
    console.error(error);
    alert("Ma'lumot olishda xatolik bor");
  }
}

function renderImg(rasmlar) {
  imgContainer.innerHTML = "";
  rasmlar.forEach((rasm) => {
    const imgBox = document.createElement("div");
    imgBox.classList = "img-box";

    const img = document.createElement("img");
    img.src = rasm.urls.thumb;
    img.className = "best-img";
    imgBox.appendChild(img);
    imgContainer.appendChild(imgBox);

    img.onclick = () => {
      const loadingOverlay = document.createElement("div");
      loadingOverlay.className = "loading-overlay";
      loadingOverlay.innerText = "Loading...";
      imgBox.appendChild(loadingOverlay);

      setTimeout(() => {
        displayModal(rasm.id);

        loadingOverlay.remove();
      }, 1500);
    };
  });
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

function isLiked(id) {
  const liked = JSON.parse(localStorage.getItem("likedImages")) || {};
  return !!liked[id];
}

function toggleLike(id, data) {
  let liked = JSON.parse(localStorage.getItem("likedImages")) || {};

  if (liked[id]) {
    delete liked[id];
  } else {
    liked[id] = data;
  }

  localStorage.setItem("likedImages", JSON.stringify(liked));
}

document.getElementById("search").addEventListener("input", async (e) => {
  const keyword = e.target.value.trim().toLowerCase();

  if (keyword === "") {
    getFetch();
    return;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${accessKey}`
    );
    const result = await response.json();
    const filteredImages = result.results;

    renderImg(filteredImages);
  } catch (error) {
    console.error("Qidiruvda xatolik:", error);
  }
});

const btn = document.getElementById("btn");

btn.addEventListener("mouseover", () => {
  btn.textContent = "❤️";
});

btn.addEventListener("mouseout", () => {
  btn.textContent = "🤍";
});

document.addEventListener("DOMContentLoaded", getFetch);
