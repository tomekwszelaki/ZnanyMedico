let cache = {};
let titles = new RegExp(/(Dr n. med.)|(Dr n.med.)|(Dr hab. n. med)|(Lek. med.)|(Lek. stom.)|(Lek.)|(Technik)/i);

class Doctor {
  constructor(nameDiv, service, city) {
    this.nameDiv = nameDiv;
    this.service = service;
    this.city = city;
  }

  get name() {
    return this.nameDiv.textContent.trim();
  }

  load() {
    if (!this.name)
      return;
    this.makeRequest().done(data => {
      if (data.hits.length > 0) {
        const numberOfStars = parseFloat(data.hits[0].stars);
        const numberOfOpinions = parseInt(data.hits[0].opinionCount);
        const url = data.hits[0].url.replace("http://", "https://");
        this.addInformation(generateInformation(numberOfStars, numberOfOpinions, url,
          'Przejdź do strony znanylekarz.pl, żeby zobaczyć wszystkie opinie.'));
      } else {
        this.addInformation(generateInformation(0, 0, 'https://www.znanylekarz.pl/',
          'Brak opinii. Kliknij, żeby przejść na stronę znanylekarz.pl i spróbuj wyszukać lekarza ręcznie.'));
      }
    });
  }

  /**
   * Generate string needed by DocPlanner search engine, e.g.: query=chirurg%20Kowalski%20Jan&hitsPerPage=4
   */
  searchParams() {
    let text = "query=";
    text += this.service ? (this.service + " ") : "";
    text += this.city ? (this.city + " ") : "";
    text += getDoctorNameWithoutTitle(this.name) + "&hitsPerPage=4";
    return text.replace(/ /g, "%20");
  }

  makeRequest() {
    const params = this.searchParams();
    const args = {
      params: params,
      apiKey: "90a529da12d7e81ae6c1fae029ed6c8f",
      appID: "docplanner"
    };
    if (cache[params] == null) { // fetch if doesn't exist in cache
      cache[params] = $.post("https://docplanner-3.algolia.io/1/indexes/pl_autocomplete_doctor/query", JSON.stringify(args));
    }
    return cache[params];
  }

  addInformation(info) {
    switch (this.nameDiv.nodeType) {
      case Node.ELEMENT_NODE:
        $(this.nameDiv).append(info);
        break;
      case Node.TEXT_NODE:
        $(this.nameDiv).after(info);
        break;
    }
  }
}

function getDoctorNameWithoutTitle(name) {
  const sanitizedName = titles.test(name) ? name.replace(titles, "") : name;
  return sanitizedName.trim();
}
