/* jshint esversion: 6 */

import axios from "axios";

async function getResults(query) {
  const proxy = 'https://cors-anywhere.herokuapp.com/';
  const key = '9ad43adb53a6604608fd7d634aa47a48';
  try {
    const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
  } catch (error) {
    alert(error);
  }
}

getResults('pizza');
