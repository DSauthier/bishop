const { Router } = require('express');
const axios = require('axios');
var parseString = require("xml2js").parseString;

// Notes: I added a link to the original API on each object of our new API so its easier to verify the information.

module.exports = new Router()
  .get('/' ,(req, res) => {
    // Code here
    searchApi()
    // first we call our searchApi function that will create our api
    .then((finalArray)=>{ 
      // once we have the api info, .then will be the positive answer to the promise
      res.status(200).json(finalArray);
    })
    .catch((err)=>{
      // .catch will be the error in case we have one.
      throw err
    })
  })
// we will use async/await to get each item, but will do the same thing that .then.catch does
  .get('/:id',async (req, res) => {
    // Code here
    let finalArray = await searchApi();
    let item = finalArray.find((eachItem)=>{
     return eachItem.id == req.params.id;
    })
    res.status(200).json(item);
  });


  // =-=-=-=--==-=--=-=-==--=-=-=-=-=-=Function to access the information on the apis=--=-=-=-=-==-=-
  
function searchApi(){
// console.log("hello")
// 
  let finalArray = [];
  // We run Axios to access the first Api and create a promise that should return the final array as json with the whole data.
  return axios.get(`https://pokeapi.co/api/v2/pokemon`)
  .then(result => {  
    // we will run a loop through the whole json data and push each item/element at a time and create a new Api.
    result.data.results.forEach((element, index) => {
      finalArray.push({ name: element.name, id: index, OriginalApi: `https://pokeapi.co/api/v2/pokemon/${index+1}`, image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${index}.png`})
      // the images links will change by the index(which we are accessing through the axios call)    // 
    });
    //inside of the first axios call, we will nest another call and pretty much repeat the process, but we will access the second api now and push the information to our new api.
      return axios.get(`http://www.clashapi.xyz/api/cards`)
      .then(cards => {
          // console.log(cards.data);  
          cards.data.forEach((card) => {
            finalArray.push({
              name: card.name,
              id: card._id,
              OriginalApi: `http://www.clashapi.xyz/api/cards/${card._id}`,
              image: `http://www.clashapi.xyz/images/cards/${card.idName}.png`
              // the images links "index" will change by the card.idName(which we are accessing through the axios call)
            });
          })
            // we will do the same thing with the XML api, but we will use a similar(but diferent) process to do it.
          return axios.get(`http://ergast.com/api/f1/drivers`)
          .then(drivers => {
            // We will use the parse string method to convert XML to Json ...(continue)
            var self = this;
            parseString(drivers.data, function (err, result) {
              self.events = result;

              // and we will push the converted data into our api

              result.MRData.DriverTable[0].Driver.forEach(driver => {
                finalArray.push({
                  name: driver.FamilyName[0],
                  id: driver.$.driverId,
                  OriginalApi: `http://ergast.com/api/f1/drivers/${
                    driver.$.driverId
                  }`,
                  image: `https://en.wikipedia.org/wiki/${driver
                    .GivenName[0] +
                    "_" +
                    driver.FamilyName[0]}`
                });
                // the wikipedia links will change by using the data from the api GivenName and FamilyName(index 0 as previewed on the json data)
              });
            
              //We ended up Chaining the events, therefore our axios call at first will ask for the pokemon api, but that will only return after getting the cards api, and that will only happen after returning the drivers api.
            });
        return finalArray
      })
    });

  });
  
}