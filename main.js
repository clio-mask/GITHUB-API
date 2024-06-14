
const searchInput = document.querySelector('.search');
const searchResults = document.querySelector('.search__results');
const list = document.querySelector('.list');
const listWrapper = document.querySelector('.list__wrapper');
const errorText = document.querySelector('.error__text');
const closeButton = document.querySelector('.close-button');

const githubApi = "https://api.github.com/search/repositories";

const newUrl = new URL(githubApi);

newUrl.searchParams.append('per_page', '5');

const debounce = (func, delay) => {
  let timeout;
  return function() {
    const fn = () => {
      func.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
};

const fetchApi = async (api) => {
  try {
    const response = await fetch(api);
    if(!response.ok) {
      throw new Error('Ошибка сервера, попробуйте повторить позже')
    }
    const data = await response.json();

    const dataItems = data.items;
if (dataItems.length != 0){
  dataItems.forEach(createListItem);
} else {
  throw new Error('Ничего не найдено')
}
  } catch (error) {
    errorText.textContent = error.message;
  }
};

const createListItem = (el) => {
  const repo = document.createElement('li');
  repo.classList.add('search__item');
  repo.textContent = el.name;
  searchResults.appendChild(repo);

  repo.addEventListener('click',  () => addItem(el.name, el.owner.login, el.stargazers_count) );
};
const addItem = (name, owner, stars) => {
    searchInput.value = ''

    let tmp = listWrapper.content.cloneNode(true);
    list.appendChild(tmp);

    const newItems = document.querySelectorAll('.list__item')
    const currentItem = newItems[newItems.length - 1]
    const cardName = currentItem.querySelector('.list__name-value')
    cardName.textContent = name
    const cardOwner = currentItem.querySelector('.list__owner-value')
    cardOwner.textContent = owner
    const cardStars = currentItem.querySelector('.list__stars-value')
    cardStars.textContent = stars
    removeSearchResults()

    currentItem.querySelector('.close-button').addEventListener('click', () => {
        currentItem.remove();
      });
}


const debouncedTimeout = debounce(fetchApi, 400);

const removeSearchResults = () => {
const allSearchResults = document.querySelectorAll('.search__item')
allSearchResults.forEach(searchItem => searchItem.remove());
};

searchInput.addEventListener('input', function(e) {
  errorText.textContent = '';
  removeSearchResults();

  const key = e.inputType === "insertText" ? e.data : "";

  if (key !== " ") {
    newUrl.searchParams.set('q', e.target.value.trim());

    if (e.target.value.trim().length > 0) {
      debouncedTimeout(newUrl.href);
    }
  }
});




