/* jshint esversion: 6 */

import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * _ Search object
 * _ Current recipe object
 * _ Shopping list object
 * _ Liked recipes
 */
const state = {};

/*
* Search Controller
*/
const controlSearch = async () => {
  // 1. Get the query from the view
  const query = searchView.getInput(); //TODO

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);
    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // 4. Search for recipes
      await state.search.getResults();
      // 5. Render result on UI
      clearLoader();
      searchView.renderResults(state.search.result); 
    } catch (error) {
      alert('Something wrong with the search..!');
      console.log(error);
    }   
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); // 10 means decimal
    console.log(goToPage);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage); 
  }
});


/*
*** Recipe Controller
*/
const controlRecipe = async () => {
  // Get the ID fro URL
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for 
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    
    // Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data 
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Error processing recipe..!');
      console.log(error);
    }
  }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));