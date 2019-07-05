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
  return `<a href="${url}" target="_blank" title="${title}">
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

function start() {
  if (isStartPage()) {
    jQuery(document).ready(doctorsListPage);
  }
}

start();
