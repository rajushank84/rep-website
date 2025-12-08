(function () {
  /* Burger menu */
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("burger--open");
      nav.classList.toggle("nav--open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav--open");
        burger.classList.remove("burger--open");
      });
    });

    document.addEventListener("click", (e) => {
      const withinHeader = e.target.closest("header");
      if (!withinHeader) {
        nav.classList.remove("nav--open");
        burger.classList.remove("burger--open");
      }
    });
  }

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const mediaContainer = document.getElementById("lightbox-media");
  const captionEl = document.getElementById("lightbox-caption");
  const indexEl = document.getElementById("lightbox-index");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");
  const btnClose = document.querySelector(".lightbox-close");

  let currentGroup = [];
  let currentIndex = 0;

  function showShimmer() {
    const shimmer = document.createElement("div");
    shimmer.className = "lightbox-shimmer";
    mediaContainer.appendChild(shimmer);
    return shimmer;
  }

  function openLightbox(groupItems, index) {
    currentGroup = groupItems;
    currentIndex = index;
    renderCurrent();
    lightbox.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-visible");
    document.body.style.overflow = "";
    mediaContainer.innerHTML = "";
  }

  function renderCurrent() {
    const item = currentGroup[currentIndex];
    if (!item) return;

    const type = item.getAttribute("data-type");
    const src = item.getAttribute("data-src");
    const caption = item.getAttribute("data-caption") || "";

    mediaContainer.innerHTML = "";
    const shimmer = showShimmer();

    if (type === "image") {
      const img = document.createElement("img");
      img.src = src || "";
      img.alt = caption;
      img.onload = () => shimmer.remove();
      mediaContainer.appendChild(img);
    } else if (type === "video") {
      const video = document.createElement("video");
      video.src = src || "";
      video.controls = true;
      video.playsInline = true;
      video.onloadeddata = () => shimmer.remove();
      mediaContainer.appendChild(video);
    } else if (type === "3d") {
      shimmer.remove();
      const placeholder = document.createElement("div");
      placeholder.className = "lightbox-placeholder";
      placeholder.textContent = "3D walkthrough comes here.";
      mediaContainer.appendChild(placeholder);
    }

    captionEl.textContent = caption;
    indexEl.textContent =
      currentGroup.length ? currentIndex + 1 + " / " + currentGroup.length : "";

    if (currentIndex === 0) {
      btnPrev.classList.add("is-disabled");
      btnPrev.disabled = true;
    } else {
      btnPrev.classList.remove("is-disabled");
      btnPrev.disabled = false;
    }

    if (currentIndex === currentGroup.length - 1) {
      btnNext.classList.add("is-disabled");
      btnNext.disabled = true;
    } else {
      btnNext.classList.remove("is-disabled");
      btnNext.disabled = false;
    }
  }

  function handleThumbClick(e) {
    const thumb = e.currentTarget;
    const groupName = thumb.getAttribute("data-group");
    const allThumbs = Array.from(
      document.querySelectorAll('.thumb[data-group="' + groupName + '"]')
    );
    const index = allThumbs.indexOf(thumb);
    if (index === -1) return;
    openLightbox(allThumbs, index);
  }

  const thumbs = document.querySelectorAll(".thumb[data-group]");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", handleThumbClick);
  });

  btnPrev.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderCurrent();
    }
  });

  btnNext.addEventListener("click", function () {
    if (currentIndex < currentGroup.length - 1) {
      currentIndex += 1;
      renderCurrent();
    }
  });

  btnClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-visible")) {
      closeLightbox();
    }
  });
})();
