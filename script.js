//  List of constants from index.html and others
const API_KEY = 'b486caf6eea84e339dda87749d83b89f';
const movieArea = document.querySelector('#movie-area');
const form1 = document.querySelector('#toSubmit');
const searchTerm = document.querySelector('input');
const pageHeading = document.getElementById('page-heading');
const loadMore = document.getElementById('load-more');
const removeResults = document.querySelector('#previous');

let page = 1;
let wordSearch = null;

/**
 * Function that returns an array  of objects containing the movies
 * @param {yurl} is the url to the api 
 */
async function getResults(yurl){
    let response = await fetch(yurl);
    resultJson = await response.json();
    return resultJson['results'];
}

/**
 * function that takes in an element representing a single movie object
 * and add the movie images to the html page.
 * @param {movieObj}
 */
function displayContent(movieObj){
    loadMore.style.display = 'initial';
    if(movieObj['poster_path']){
    movieArea.innerHTML += `
    <div class="image-format">
    <img src="https://image.tmdb.org/t/p/w500${movieObj['poster_path']}" 
    alt="Movie poster for ${movieObj['title']}">
            <span> ${movieObj['title']} </span>
            <h6> Score: ${movieObj['vote_average']} </h6>
        </div>`;
    }
    else{
        movieArea.innerHTML += `
    <div class="image-format">
    <img src="Default Image goes here" 
    alt="Movie poster for ${movieObj['title']}">
            <span> ${movieObj['title']} </span>
            <h6> Score: ${movieObj['vote_average']} </h6>
        </div>`;
    }
}

/**
 * When the window loads display the top current movies
 */ 
window.onload = async function (){
    // make the url
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
    //fetch the api data 
    let apiData = await getResults(url);
    //display the api data
    apiData.forEach(element => {
        displayContent(element);
    });
    addEventListeners();
}

function addEventListeners(){
    form1.addEventListener('submit', handleSearch);
    loadMore.addEventListener('click', getMore);
    removeResults.addEventListener('click', clearResults);
}

async function handleSearch(event){
    event.preventDefault();

    //variable for wordsearch
    wordSearch = searchTerm.value;
    searchTerm.value = '';
    page = 1;

    //make the url call
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&include_adult=false&query=${wordSearch}`;

    //fetch the api data 
    let apiData = await getResults(url);

    //display the search result and change the top string

    //clear the movies area
    movieArea.innerText = '';

    if (apiData.length == 0){
        pageHeading.innerText = `No Results were found for ${wordSearch}`;
    }
    else{
        pageHeading.innerText = `Results for ${wordSearch}`;

        apiData.forEach(element => {
            displayContent(element);
        });
    }
    removeResults.style.display = 'initial';
}

async function getMore(event){
    page += 1;

    if (wordSearch == null){
    // make the url
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
    //fetch the api data 
    let apiData = await getResults(url);
    //display the api data
    apiData.forEach(element => {
        displayContent(element);
    });}

    else{
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&include_adult=false&query=${wordSearch}&page=${page}`;

         //fetch the api data 
        let apiData = await getResults(url);

        //display the search result and change the top string
        if (apiData.length == 0 && page == 1){
            pageHeading.innerText = `No Results were found for ${wordSearch}`;
        }
        else if(apiData.length == 0 && page > 1){
            window.scrollTo(0, 0);
            loadMore.style.display = 'none';
        }
        else{
            pageHeading.innerText = `Results for ${wordSearch}`;
    
            apiData.forEach(element => {
                displayContent(element);
            });
        }
    }
}
async function clearResults(event){
    page = 1;
    wordSearch = null;
    // make the url
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
    //fetch the api data 
    let apiData = await getResults(url);
    //display the api data
    movieArea.innerText = '';
    removeResults.style.display = 'none';
    pageHeading.innerText = 'In Theatres';
    window.scrollTo(0,0);
    apiData.forEach(element => {
        displayContent(element);
    });
    addEventListeners();

}