/* jshint esversion: 6 */

import Search from "./models/Search";
/** Global state of the app
 * _ Search object
 * _ Current recipe object
 * _ Shopping list object
 * _ Liked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1. Get the query from the view
  const query = "pizza"; //TODO

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results

    // 4. Search for recipes
    await state.search.getResults();
    // 5. Render result on UI
    console.log(state.search.result);
    
  }
};

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
