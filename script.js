//import arraYlist from another js /arraylist.js
import arrayList from "./arraylist.js";

//get id from html view
const items = document.getElementById("main");
const map = document.getElementById("map");
const search = document.getElementById("search");
const noData = document.getElementById("no-data");
const tag = document.getElementById("tags");
const details = document.getElementById("details");

//all tag list
function tagList() {
  const firstButton = document.createElement("button");
  firstButton.classList.add("unselected");
  firstButton.textContent = "All";
  firstButton.onclick = function () {
    filterAndShowData("All", firstButton);
    showData(arrayList);
  };
  tag.appendChild(firstButton);

  const uniquePointOfInterests = new Set();

  for (let index = 0; index < arrayList.length; index++) {
    const element = arrayList[index];
    const getPointOfInterest = element.PointOfIntrest;

    if (!uniquePointOfInterests.has(getPointOfInterest)) {
      const button = document.createElement("button");
      button.classList.add("unselected");
      button.textContent = getPointOfInterest;
      button.onclick = function () {
        filterAndShowData(getPointOfInterest, button);
      };

      tag.appendChild(button);

      uniquePointOfInterests.add(getPointOfInterest);
    }
  }
}

//call function tag , showdata, detailsview
tagList();
showData(arrayList);
detailsView(arrayList[0]);

//Show list of data to view
function showData(filteredItems) {
  let showDatas = "";
  filteredItems.forEach((element, index) => {
    showDatas += `
          <div class="border"></div>
          <div id="title_${index}" class="items">
              <div class="list">
                  <h3>${element.Title}</h3>
                  <p>${element.Subtitle}</p>
                  <div class="reviews">
                      <p>${element.Ratings}</p>
                      <div class="star">
                          ${generateStars(element.Star)}
                      </div>
                      <p class="links">${element.Reviews}</p>
                  </div>
              </div>
          </div>
      `;
  });

  items.innerHTML = showDatas;
  filteredItems.forEach((element, index) => {
    const titleElement = document.getElementById(`title_${index}`);
    titleElement.addEventListener("click", () => {
      MapView(element.Map);
      detailsView(element);
    });
  });
}

//generate stars/rating based on arrayList
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;

  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="bx bxs-star"></i>';
  }

  if (halfStar) {
    starsHTML += '<i class="bx bxs-star-half"></i>';
  }

  return starsHTML;
}

//after clicking show map in View
function MapView(mapUrl) {
  let data = `
  <iframe
  src="${mapUrl}"
  width="625"
  height="680"
  style="border: 0"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
  `;

  map.innerHTML = data;
}

//details view of each item
function detailsView(element) {
  details.innerHTML = "";

  const data = `
<h3> Details  </h3>
<div class="border"></div>

<div class="top-nav">
<div class="direction">
  <i class='bx bx-fullscreen'></i>
  <p id="direction">Show Full Map</p>
</div>
<div class="share">
  <i  class="bx bxs-share-alt"></i>
  <p id="share_facebook">Share</p>
</div>
</div>
<div class="border"></div>

<div class="descrption">
<div class="address">
  <i class="bx bx-map"></i>
  <p>${element.Subtitle}</p>
</div>

<div class="close">
  <i class="bx bxs-time"></i>
  ${
    element.Status === "Close"
      ? ` <p class="status_close"> ${element.Status} </p>
  |
  <span> Opening Time ${element.OpeningTime}

  </span>
   
  `
      : `<p class="status_open">${element.Status} </p>
  |
  <span> Closing Time ${element.ClosingTime}

  </span> 
  
  `
  }
  </p>
</div>

<div class="contact">
  <i  class="bx bxs-phone-call"></i>
  <p><a href="tel:${element.Phone}">${element.Phone}</a></p>
</div>
</div>

<div class="border"></div>

<div class="website">
<i class="bx bx-link"></i>
<p> <a href="${element.Website}"> Visit Website</a></p> 
</div>

<div class="border"></div>

<div class="title-photo"> 
<p> Photos & videos </p></div>
<div class="photos">
  ${
    element.image
      ? element.image
          .map(
            (image, index) => `
      <img src="${image.src}" id="${image.src}"  alt="${image.src}+ ${
              index + 1
            }">
    `
          )
          .join("")
      : "Photos & videos are Not available"
  }
</div>
<div id="imagePopup" class="popup">
<div class="popup-content">
  <img id="popupImage" src="" alt="Popup Image">
  <span id="close_popup" class="close">&times;</span>
</div>
</div>
`;

  details.innerHTML = data;

  const share = document.getElementById("share_facebook");
  const direction = document.getElementById("direction");

  share.addEventListener("click", () => shareFacebook(element.Share));
  direction.addEventListener("click", () => directions(element.Map));

  if (element.image) {
    for (let index = 0; index < element.image.length; index++) {
      const imageElement = document.getElementById(
        `${element.image[index].src}`
      );
      if (imageElement) {
        imageElement.addEventListener("click", () =>
          openImagePopup(element.image[index].src)
        );
      }
    }
  }
  closePopup();
}

//closepopup of image
function closePopup() {
  const popups = document.getElementById("close_popup");
  popups.addEventListener("click", () => {
    const popup = document.getElementById("imagePopup");
    popup.style.display = "none";
  });
}

//openpopup of image
function openImagePopup(imageSrc) {
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");

  popupImage.src = imageSrc;
  popup.style.display = "block";
}

//share map to facebook
function shareFacebook(Url) {
  const mapUrl = Url;
  const shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    mapUrl
  )}`;
  window.open(shareLink, "_blank");
}

//show full map
function directions(Url) {
  const mapUrl = Url;
  window.open(mapUrl, "_blank");
}

//get search item from user by  input event
search.addEventListener("input", searchFilter);

//filter data  through search
function searchFilter() {
  const searchTerm = search.value.toLowerCase();
  const filteredItems = arrayList.filter(
    (item) =>
      item.Title.toLowerCase().includes(searchTerm) ||
      item.Subtitle.toLowerCase().includes(searchTerm) ||
      item.Reviews.toLowerCase().includes(searchTerm) ||
      item.PointOfIntrest.toLowerCase().includes(searchTerm)
  );
  if (filteredItems.length === 0) {
    items.innerHTML = "";
    noData.style.display = "block";
    noData.innerHTML = "NO Data Available";
  } else {
    noData.style.display = "none";
    showData(filteredItems);
    resetButtonColors();
  }
}

//filter data through button of taglist
function filterAndShowData(selectedPointOfInterest, button) {
  const filteredItems = arrayList.filter(
    (item) => item.PointOfIntrest === selectedPointOfInterest
  );
  if (filteredItems) {
    showData(filteredItems);
    resetButtonColors();
    button.classList.add("selected");
    noData.style.display = "block";
    noData.innerHTML = "";
  }
}

//resetbutton active colors
function resetButtonColors() {
  const buttons = document.querySelectorAll(".unselected");
  buttons.forEach((button) => button.classList.remove("selected"));
}

// @ c - padam thapa
