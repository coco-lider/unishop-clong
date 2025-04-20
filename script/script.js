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

      let exit = document.createElement('div');
      exit.classList = 'exit'
      exit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#F3F3F3"><path d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg>';
      exit.onclick = () =>{
        modalBack.style.display = 'none'
      }

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
      modalBack.appendChild(exit);
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
