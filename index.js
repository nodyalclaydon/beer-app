// variables
const urlBase = "https://api.punkapi.com/v2/beers?page="
const filterABV = document.getElementById("filterABV");
const filterIBU = document.getElementById("filterIBU");
const pageText = document.getElementById("pageNumber");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
let optionsABV = "", optionsIBU = "", page = 1;

// filters
filterABV.addEventListener("change", e => {
    const value = e.target.value;

    switch (value) {
        case "all":
            optionsABV = "";
            break
        case "weak":
            optionsABV = "&abv_lt=4.6";
            break
        case "medium":
            optionsABV = "&abv_gt=4.5&abv_lt=7.6";
            break
        case "strong":
            optionsABV = "&abv_gt=7.5";
            break
    }
    page = 1;
    getBeers();
})

filterIBU.addEventListener("change", e => {
    const value = e.target.value;

    switch (value) {
        case "all":
            optionsIBU = "";
            break
        case "weak":
            optionsIBU = "&ibu_lt=35";
            break
        case "medium":
            optionsIBU = "&ibu_gt=34&abv_lt=75";
            break
        case "strong":
            optionsIBU = "&ibu_gt=74";
            break
    }
    page = 1;
    getBeers();
})

// async function using fetch to get our beer data from urlBase. 
// Then, rendering each beer name inside the div with class of "beers" inside html file
async function getBeers() {
    const url = urlBase + page + optionsABV + optionsIBU;
    // fetch
    const beerPromise = await fetch(url);
    const beerData = await beerPromise.json();

    // pagination
    pageText.innerText = page;

    if(page === 1) {
        prevPage.disabled = true;
    } else {
        prevPage.disabled = false;
    }
    if(beerData.length < 25) {
        nextPage.disabled = true;
    } else {
        nextPage.disabled = false;
    }

    // render data
    const beerDiv = document.querySelector(".beers");
    let beerHTML = "";
    const genericBottle = "https://cdn.pixabay.com/photo/2014/12/22/00/04/bottle-576717_960_720.png";

    beerData.forEach(beer => {
        beerHTML += `
        <div class="beer-wrapper card">
            <div class="beer">
                <img class="beer__img" src="${beer.image_url ? beer.image_url : genericBottle}">
                <h3>${beer.name}</h3>
                <span class="beer__info">
                    <span>ABV: ${beer.abv}%</span>
                    <span>IBU: ${beer.ibu}</span>
                </span>
            </div>
            <div class="beer__content">
                <div class="beer__name">${beer.name}</div>
                <div class="beer__tagline">${beer.tagline}</div>
                <div class="beer__description">${beer.description}</div>
                <div class="beer__food-paring">Pair with: <br>${beer.food_pairing.join(',<br>')}</div>
            </div>
        </div>
        `;
    });

    beerDiv.innerHTML = beerHTML;
}

// Pagination
prevPage.addEventListener("click", () => {
    page--;
    getBeers();
});
nextPage.addEventListener("click", () => {
    page++;
    getBeers();
})

getBeers();