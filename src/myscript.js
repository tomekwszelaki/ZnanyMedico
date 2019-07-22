function createStarScaleAsImgElements(numberOfStars) {
  function getImage(index, gold) {
    const name = `star-${gold ? 'gold' : 'gray'}-${index % 2 === 0 ? 'left' : 'right'}-10.png`;
    return chrome.extension.getURL(name)
  }

  let text = "";
  if (isNaN(numberOfStars)) {
    numberOfStars = 0;
  }
  const doubleNumberOfStarsInt = Math.ceil(numberOfStars * 2);
  for (let i = 0; i < 10; i++) {
    text = text + `<img src="${getImage(i, i < doubleNumberOfStarsInt)}" alt="star" width="5" height="10">`;
  }
  return text;
}

function generateInformation(noStars, noOpinions, url, title) {
  return `<a href="${url}" target="_blank" title="${title}" data-loc="znanymedico">
    <span style="white-space: nowrap; font-size: 10px;">${createStarScaleAsImgElements(noStars)} (${noOpinions} opinii)</span>
    </a>`;
}

function loadStars(doctorNames, favour, city) {
  for (let i = 0; i < doctorNames.length; i++) {
    let doctor = new Doctor(doctorNames[i], favour, city);
    doctor.load();
  }
}

function isStartPage() {
  const currentUrl = window.location.toString();
  return currentUrl.startsWith("https://www.medicover.pl/lekarze/");
}

function doctorsListPage() {
  const doctorNames = $("div.doctors-box > div.doctors-content h2.result-title");
  const service = $("#big-spec-search-box > input").value;
  const city = $("#big-loc-search-box > input").value;
  loadStars(doctorNames, service, city);
}

function isMolPage() {
  const currentUrl = window.location.toString();
  return currentUrl.startsWith("https://mol.medicover.pl/");
}

function molListPage() {
  const doctorNames = $(".freeSlot > div.row .doctorName");
  const service = $("#advancedSearchForm select.form-control[formcontrolname=\"services\"]")[0].selectedOptions[0].textContent;
  const city = $("#advancedSearchForm select.form-control[formcontrolname=\"regions\"]")[0].selectedOptions[0].textContent;
  loadStars(doctorNames, service, city);
}

function tryLoadStarsOnMolPageUntilAtLeastOneLoaded() {
  let molPageInterval = setInterval(() => {
    if (document.querySelector(".freeSlot > div.row .doctorName") !== null) {
      molListPage();
    }
    if (document.querySelectorAll("a[data-loc=\"znanymedico\"]").length > 0) {
      clearInterval(molPageInterval);
    }
  }, 1000);
  console.log(molPageInterval);
}

function start() {
  if (isStartPage()) {
    jQuery(document).ready(doctorsListPage);
    });
  }
  if (isMolPage()) {
    jQuery(document).ready(tryLoadStarsOnMolPageUntilAtLeastOneLoaded());
  }
}

start();
