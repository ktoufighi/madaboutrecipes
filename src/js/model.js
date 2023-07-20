// data
import { async } from 'regenerator-runtime';
import { API_URL, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { RESULTS_PER_PAGE } from './config.js';
//state contains all the data about the application, so we store our search and display functionality after receiving the data in the state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // conditionally adding properties to objects when they do exist
    // key: recipe.key
    ...(recipe.key && { key: recipe.key }),
  };
};

//Load recipe functionality
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // formatting recipe object

    // using some() array method that uses true or false values
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarks = true;
    else state.recipe.bookmarks = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} *******`);
    throw err;
  }
};

//Search functionality
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} *******`);
    throw err;
  }
};

//Results by page functionality
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  //returning part of the results no all of it
  const start = (page - 1) * 10; // 0;
  const end = page * state.search.resultsPerPage; // 9;
  return state.search.results.slice(start, end); //first page returning results 1-10
};

// Update servings function
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });
  // update servings in state
  state.recipe.servings = newServings;
};

// function to persist in localstorage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Bookmark function which push a recipe into an arry of bookmark []
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarks = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarks = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    // entry at index 0 should include word ingredients
    // and entry at index 1 should not be an empty string
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(el => {
        const ingArr = el[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          // our entry should have three parts separated by ,
          throw new Error(
            'Wrong ingredient format! Please use correct format.'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // create a recipe object to upload to our app
    // post a recipe to API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
