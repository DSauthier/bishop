const { Router } = require('express');
const axios = require('axios');
var parseString = require("xml2js").parseString;

module.exports = new Router()
  .get('/' ,(req, res) => {
    // Code here
    searchApi()
    .then((finalArray)=>{ 
      res.status(200).json(finalArray);
    })
    .catch((err)=>{
      throw err
    })
  })

  .get('/:id',async (req, res) => {
    // Code here
    let finalArray = await searchApi();
    let item = finalArray.find((eachItem)=>{
     return eachItem.id == req.params.id;
    })
    res.status(200).json(item);
  });

function searchApi(){
// console.log("hello")
// 
  let finalArray = [];
  return axios.get(`https://pokeapi.co/api/v2/pokemon`)
  .then(result => {  
    // console.log(result)
    result.data.results.forEach((element, index) => {
      finalArray.push({ name: element.name, id: index, api: `https://pokeapi.co/api/v2/pokemon`, image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${index}.png`})
    });


   return axios.get(`http://www.clashapi.xyz/api/cards`)
   .then(cards => {
      // console.log(cards.data);  
      cards.data.forEach((card) => {
        finalArray.push({
          name: card.name,
          id: card._id,
          image: `http://www.clashapi.xyz/images/cards/${card.idName}.png`
        });
      })

      return axios.get(`http://ergast.com/api/f1/drivers`)
      .then(drivers => {
        // console.log(drivers);  
        var self = this;
        parseString(drivers.data, function (err, result) {
          self.events = result;
          // console.log(result.MRData.DriverTable[0].Driver);

          result.MRData.DriverTable[0].Driver.forEach(driver => {
            finalArray.push({ name: driver.FamilyName[0], id: driver.$.driverId, image: `https://en.wikipedia.org/wiki/${driver.GivenName[0] + '_' + driver.FamilyName[0]}`});
          });
         
          // console.log(finalArray);
        });
        return finalArray
      })
    });

  });
  
}