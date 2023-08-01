'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const search = document.querySelector('.search__btn');
const searchInput = document.querySelector('.search__input--country');

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
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};
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
// Create a helper function to not repeat code
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    // IF response is false
    // throw will terminate the function
    // this is the error.message
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};
////////////// reference
// const getCountryAndNeighbor = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(data => {
//       renderCountry(data[0]);
//       console.log(data);
//       const neighbour = data[0].borders;

//       if (!neighbour) return;

//       return neighbour.forEach(code => {
//         fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`)
//           .then(response => {
//             if (!response.ok) {
//               throw new Error(`${response.statusText}`);
//             }
//             return response.json();
//           })
//           .then(data => renderCountry(data[0], 'neighbour'));
//       });
//     })
//     // handle error response by using catch or finally
//     .catch(err => {
//       console.error(`${err.message} 🔥🔥🔥`);
//       renderError(
//         `Something went wrong 🔥🔥🔥 ${err.message}. Try again! Ex: usa`
//       );
//     })
//     // show the countries card appear
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

const getCountryAndNeighbor = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      // console.log(data);
      const neighbour = data[0].borders;
      console.log(neighbour);

      if (!neighbour) throw new Error('No neighbour found!');

      neighbour.forEach(code => {
        return getJSON(
          `https://restcountries.com/v3.1/alpha?codes=${code}`,
          'Country not found'
        ).then(data => renderCountry(data[0], 'neighbour'));
      });
    })
    // handle error response by using catch or finally
    .catch(err => {
      console.error(`${err.message} 🔥🔥🔥`);
      renderError(
        `Something went wrong 🔥🔥🔥 ${err.message}. Try again! Ex: usa`
      );
    })
    // show the countries card appear
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
// getCountryData('cambodia');
// btn.addEventListener('click', function () {
//   getCountryAndNeighbor(btn, 'neighbour');
//   return;
// });
// this clear previous Search results
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

////////////////////////////////////////////////////////////////////////
// Asynchronous JavaScript
/*
Coding Challenge #1
In this challenge you will build a function 'whereAmI' which renders a country 
only based on GPS coordinates. For that, you will use a second API to geocode 
coordinates. So in this challenge, you’ll use an API on your own for the first time �
Your tasks:
PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat') 
and a longitude value ('lng') (these are GPS coordinates, examples are in test 
data below).
2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means 
to convert coordinates to a meaningful location, like a city and country name. 
Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call 
will be done to a URL with this format: 
https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and 
promises to get the data. Do not use the 'getJSON' function we created, that 
is cheating �
3. Once you have the data, take a look at it in the console to see all the attributes 
that you received about the provided location. Then, using this data, log a 
message like this to the console: “You are in Berlin, Germany”
4. Chain a .catch method to the end of the promise chain and log errors to the 
console
5. This API allows you to make only 3 requests per second. If you reload fast, you 
will get this error with code 403. This is an error with the request. Remember, 
fetch() does not reject the promise in this case. So create an error to reject 
the promise yourself, with a meaningful error message
PART 2
6. Now it's time to use the received data to render a country. So take the relevant 
attribute from the geocoding API result, and plug it into the countries API that 
we have been using.
7. Render the country and catch any errors, just like we have done in the last 
lecture (you can even copy this code, no need to type the same code)
The Complete JavaScript Course 31
Test data:
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
§ Coordinates 2: 19.037, 72.873
§ Coordinates 3: -33.933, 18.474
GOOD LUCK �
*/
/*
const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};
// getting the country card by using geolocation
whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
*/
