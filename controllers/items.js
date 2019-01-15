const searchApi = require("./promiseSearch");

const { Router } = require('express');


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
  

