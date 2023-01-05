import arr from "./data.js";
import { c, q, GET } from "./utils.js";

const selectEl = document.getElementById("select-location");
const mainEl = q(".main");
const mainDivEl = q(".image-gallery");

////Menu cards with municipalities

const createCard = (nome, value, parent) => {
  const wrapperEl = c("div");
  wrapperEl.setAttribute("class", "wrapper-card");

  const cardEl = c("div");
  cardEl.setAttribute("class", "card");
  cardEl.setAttribute("id", value);
  cardEl.addEventListener("click", (e) => {
    mainDivEl.replaceChildren(); /// empty container with 3 images
    requestApi(cardEl.id);
    mainEl.classList.remove("active"); /// hide menu list
    searchFormEl.classList.remove("active"); /// hide search input
    if (cardEl.id == "bronte") {
      /// correct some incoherent images
      requestApiImages("cittabrontedicatania");
    } else if (cardEl.id == "catania") {
      requestApiImages("cittacatania");
    } else if (cardEl.id == "gravina+di+Catania") {
      requestApiImages("gravinaanfiteatro");
    } else if (cardEl.id == "milo") {
      requestApiImages("milocatania");
    } else if (cardEl.id == "Mineo") {
      requestApiImages("mineosicilia");
    } else if (cardEl.id == "paterno") {
      requestApiImages("paternocatania");
    } else if (cardEl.id == "san+cono") {
      requestApiImages("sanconocatania");
    } else if (cardEl.id == "valverde") {
      requestApiImages("valverdecatania");
    } else if (cardEl.id == "vizzini") {
      requestApiImages("vizzinidi");
    } else {
      requestApiImages(cardEl.id); /// request for images
    }
  });

  const titleEl = c("h4");
  titleEl.setAttribute("class", "cardtext");
  titleEl.textContent = nome;

  // appending
  cardEl.append(titleEl);
  wrapperEl.appendChild(cardEl);
  parent.append(wrapperEl);
};

arr.map((comune) => createCard(comune.name, comune.value, mainEl));

////_________________________________________________________________________

const wrapper = q(".wrapper"),
  inputPart = q(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  rainBackgroudEl = q(".rain-background"),
  clearBackgroudEl = q(".clear-background"),
  cloudBackgroudEl = q(".cloud-background"),
  snowBackgroudEl = q(".snow-background"),
  hazeBackgroudEl = q(".haze-background"),
  stormBackgroudEl = q(".storm-background"),
  buttonSelectEl = q(".button-select"),
  searchFormEl = q(".search-form");

let api;

function requestApi(comune) {
  if (comune == "milo") {
    /// exseption for milo location as far as api request returns milo in US instead of Italy
    api = `https://api.openweathermap.org/data/2.5/weather?lat=37.723&lon=15.1159&units=metric&appid=2bf9e92402cacc79e01315bd3466e378`;
  } else {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${comune}&units=metric&appid=37e64d32df1a5897bfae2b5672c5e514`;
  }
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details..."; /// loader
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

//// Image gallery

let comuneInfoList = [];

function requestApiImages(comune) {
  GET(
    `https://api.qwant.com/v3/search/images?count=3&q=${comune}&t=images&safesearch=1&locale=it_IT&offset=0&device=desktop`
  ).then((result) => {
    comuneInfoList = result;
    comuneInfoList.data.result.items.map((user) =>
      createCardGallery(user.media, mainDivEl)
    );
  });
}

const createCardGallery = (image, parent) => {
  const cardEl = c("div");
  cardEl.setAttribute("class", "card-gallery");

  const imageEl = c("img");
  imageEl.setAttribute("src", image);
  imageEl.className = "image-comune";

  cardEl.append(imageEl);
  parent.appendChild(cardEl);
};

//// Image gallery end

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${selectEl.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity, pressure } = info.main;
    const windspeed = info.wind.speed;

    if (id == 800) {
      wIcon.src = "icons/clear.png";
      clearBackgroudEl.classList.add("active");
      stormBackgroudEl.classList.remove("active");
      snowBackgroudEl.classList.remove("active");
      hazeBackgroudEl.classList.remove("active");
      cloudBackgroudEl.classList.remove("active");
      rainBackgroudEl.classList.remove("active");
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.png";
      clearBackgroudEl.classList.remove("active");
      stormBackgroudEl.classList.add("active");
      snowBackgroudEl.classList.remove("active");
      hazeBackgroudEl.classList.remove("active");
      cloudBackgroudEl.classList.remove("active");
      rainBackgroudEl.classList.remove("active");
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.png";
      clearBackgroudEl.classList.remove("active");
      stormBackgroudEl.classList.remove("active");
      snowBackgroudEl.classList.add("active");
      hazeBackgroudEl.classList.remove("active");
      cloudBackgroudEl.classList.remove("active");
      rainBackgroudEl.classList.remove("active");
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.png";
      clearBackgroudEl.classList.remove("active");
      stormBackgroudEl.classList.remove("active");
      snowBackgroudEl.classList.remove("active");
      hazeBackgroudEl.classList.add("active");
      cloudBackgroudEl.classList.remove("active");
      rainBackgroudEl.classList.remove("active");
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.png";
      clearBackgroudEl.classList.remove("active");
      stormBackgroudEl.classList.remove("active");
      snowBackgroudEl.classList.remove("active");
      hazeBackgroudEl.classList.remove("active");
      cloudBackgroudEl.classList.add("active");
      rainBackgroudEl.classList.remove("active");
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "icons/rain.png";
      clearBackgroudEl.classList.remove("active");
      stormBackgroudEl.classList.remove("active");
      snowBackgroudEl.classList.remove("active");
      hazeBackgroudEl.classList.remove("active");
      cloudBackgroudEl.classList.remove("active");
      rainBackgroudEl.classList.add("active");
    }
    setTimeout(addWrapper, 500); /// delay .5 sec after clicking "scegli comune" button
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    weatherPart.querySelector(".pressure span").innerText = `${pressure}hPa`;
    weatherPart.querySelector(".wind-speed span").innerText = `${windspeed}m/s`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    selectEl.value = "";
  }
}

function addWrapper() {
  wrapper.classList.add("active");
}

/// Scegli comune button event

buttonSelectEl.addEventListener("click", (e) => {
  mainEl.classList.toggle("active");
  searchFormEl.classList.toggle("active");
  wrapper.classList.remove("active");
  wrapper.classList.add("active-desktop");
});

//// Search comune
const inputEl = q(".search-input");
let inputValue = "";

inputEl.addEventListener("input", (e) => {
  inputValue = "";
  inputValue += e.target.value.toLowerCase();
  console.log(inputValue);
  mainEl.replaceChildren();
  const filteredByInput = arr.filter((comune) =>
    comune.value.includes(inputValue)
  );
  filteredByInput.map((comune) =>
    createCard(comune.name, comune.value, mainEl)
  );
});

/// onload Catania city location by default
(location.onload = requestApi("catania")), requestApiImages("cittacatania");
