'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const search = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input--country');

///////////////////////////////////////

// api url
// https://countries-api-836d.onrender.com/countries/
// old way of making request using AJAX

// const getCountry = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   console.log(request.responseText);

//   request.addEventListener('load', function () {
//     console.log(this.responseText);
//     // destructructor by putting data in array
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     const languages = Object.values(data.languages);
//     const currencies = Object.values(data.currencies);
//     const html = `
//     <article class="country">
//       <img class="country__img" src="${data.flags.png}" />
//       <div class="country__data">
//         <h3 class="country__name">${data.name.common}</h3>
//         <h4 class="country__region">${data.region}</h4>
//         <p class="country__row"><span>👫</span>${(
//           +data.population / 1000000
//         ).toFixed(1)} million</p>
//         <p class="country__row"><span>🗣️</span>${languages[0]}</p>
//         <p class="country__row"><span>💰</span>${currencies[0].name}</p>
//       </div>
//     </article>
//   `;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// getCountry('portugal');
// getCountry('usa');
// getCountry('japan');

// Neighbor Quest
/////////////////////////////////
// Welcome to Callback Hell

const renderCountry = function (data, className = '') {
  const flag = data.flags.png;
  const countryName = data.name.common;
  const region = data.region;
  const population = (data.population / 1000000).toFixed(2);
  const language = Object.values(data.languages)[0];
  const currency = Object.values(data.currencies)[0].name;
  const html = `
    <article class="${className}">
      <img class="country__img" src="${flag}" />
      <div class="country__data">
        <h3 class="country__name">${countryName}</h3>
        <h4 class="country__region">${region}</h4>
        <p class="country__row"><span>👫</span>${+population} million</p>
        <p class="country__row"><span>🗣️</span>${language}</p>
        <p class="country__row"><span>💰</span>${currency}</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
/*
const getCountryAndNeighbor = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    // destructructor by putting data in array
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render Country 1
    renderCountry(data);

    // Get neighbour country (2)
    const neighbors = data.borders;

    if (!neighbors) return;

    // AJAX call country 2
    neighbors.forEach(neighbour => {
      let request2 = new XMLHttpRequest();
      request2.open(
        'GET',
        `https://restcountries.com/v3.1/alpha/${neighbour}
      `
      );
      request2.send();

      request2.addEventListener('load', function () {
        const [data2] = JSON.parse(this.responseText);
        console.log(data2);

        renderCountry(data2, 'neighbour');
      });
    });
  });
};
*/
// const clearCountries = function () {
//   countriesContainer.innerHTML = ''; // Clear the content of the container
// };

// const handleSearch = function () {
//   const searchTerm = searchInput.value;
//   clearCountries(); // Clear previous search results
//   getCountryAndNeighbor(searchTerm);
// };

// // Add event listener for the search button click
// search.addEventListener('click', handleSearch);

// // Add event listener for the "Enter" key press
// document.addEventListener('keypress', function (event) {
//   if (event.key === 'Enter') {
//     handleSearch();
//   }
// });
/////////////////////////////////////////////////
// Promises and Fetch API
// OLD WAY
// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
// request.send();
// Modern way to fetch a get request is just pass the url for the api
// const request = fetch('https://restcountries.com/v3.1/name/cambodia');
// console.log(request); // a fetch function returns a Promise
// Promise: is an object that is used as a placeholder for the future result of an asynchronous operation. A container for a future value
const getCountryAndNeighbor = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      console.log(data);
      const neighbour = data[0].borders;

      if (!neighbour) return;

      return neighbour.forEach(code => {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`)
          .then(response => response.json())
          .then(data => renderCountry(data[0], 'neighbour'));
      });
    });
};
// getCountryData('cambodia');

const clearCountries = function () {
  countriesContainer.innerHTML = ''; // Clear the content of the container
};

const handleSearch = function () {
  const searchTerm = searchInput.value;
  clearCountries(); // Clear previous search results
  getCountryAndNeighbor(searchTerm);
};

// Add event listener for the search button click
search.addEventListener('click', handleSearch);

// Add event listener for the "Enter" key press
document.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
});
