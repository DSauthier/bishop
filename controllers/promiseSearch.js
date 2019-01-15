const { Router } = require("express");
const axios = require("axios");
var parseString = require("xml2js").parseString;

// i will define the search function and create 3 promises where we will fetch the data from the api's using axios call.

function searchApi() {
  let promise1 = axios.get(`https://pokeapi.co/api/v2/pokemon`).then(result => {
    return result
  });

  let promise2 = axios.get(`http://www.clashapi.xyz/api/cards`).then(cards => {
    return cards
  });

  let promise3 = axios.get(`http://ergast.com/api/f1/drivers`).then(drivers => {
    return drivers
  });

  // than the function will return a Promise.all with the promises we created
  return Promise.all([promise1, promise2, promise3]).then(function (values) {
    let finalArray=[];
    // we will create a new array where we will push the results one by one with a foreach loop.
    values[0].data.results.forEach((element, index) => {
      finalArray.push({
        name: element.name,
        id: index,
        OriginalApi: `https://pokeapi.co/api/v2/pokemon/${index + 1}`,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${index}.png`
      });
    });
    // we repeat the process but with the next item instead.
    let cards = values[1];
     cards.data.forEach(card => {
      finalArray.push({
        name: card.name,
        id: card._id,
        OriginalApi: `http://www.clashapi.xyz/api/cards/${card._id}`,
        image: `http://www.clashapi.xyz/images/cards/${card.idName}.png`
      });
    });

    // the only diference on our xml data is that we need to transform it into json, therefore we use parse string and repeat the previous process.
    parseString(values[2].data, function (err, result) {
       result.MRData.DriverTable[0].Driver.forEach(driver => {
        finalArray.push({
          name: driver.FamilyName[0],
          id: driver.$.driverId,
          OriginalApi: `http://ergast.com/api/f1/drivers/${
            driver.$.driverId
            }`,
          image: `https://en.wikipedia.org/wiki/${driver.GivenName[0] +
            "_" +
            driver.FamilyName[0]}`
        });
      });
    });
    // return the final array that creates the "new api"
    return finalArray
  });
}
  

module.exports = searchApi;
