/* jshint esversion: 6 */
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * _ Search object
 * _ Current recipe object
 * _ Shopping list object
 * _ Liked recipes
 */
const state = {};
/*
* SEARCH CONTROLLER
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
*** RECIPE CONTROLLER
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
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    } catch (error) {
      alert('Error processing recipe..!');
      console.log(error);
    }
  }
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
*** LIST CONTROLLER
*/
const controlList = () => {
  // Create a new list if there is none yet
  if(!state.list) {
    state.list = new List();
  }

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const items = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(items);
  });
};
// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  
  const id = e.target.closest('.shopping__item').dataset.item_id;
  
  // Handle the delete item
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);
    // Delete from UI
    listView.deleteItem(id);

    // Handle the count update
  } else if(e.target.matches('.shopping__count-value, .shopping__count-value *')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


/*
*** LIKE CONTROLLER
*/
const controlLike = () => {
  if(!state.likes) {
    state.likes = new Likes();
  }
  const currentID = state.recipe.id;
  // user has not yet liked current recipe
  if(!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID, 
      state.recipe.title,
      state.recipe.author,
      state.recipe.img 
    );
    // Toggle the like button
      likesView.toggleLikeBtn(true);
    // Add like to UI List
    likesView.renderLike(newLike);
    // User HAS liked current recipe
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI List
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore like recipes on Page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  // Restore likes
  state.likes.readStorage();
  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render the existing likes
  state.likes.likes.forEach(like => {
    likesView.renderLike(like);
  })
});

// Handling Recipe Button Clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decreases button clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {

    // increases button clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
    listView.clearItem();
    // Add ingredients to the shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like Controller
    controlLike();
  }
});
