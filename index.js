/*calls movie api using free api key inside async function and
* returns user search results*/
const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apiKey: '32c05230',
            s: searchTerm
        }
    });
    if (response.data.Error) {
        return [];
    }
    return response.data.Search;
};


const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label><b>Search for a Movie</b></label>
<input class='input' type='text'/>
<div class='dropdown'>
    <div class='dropdown-menu'>
        <div class='dropdown-content results'></div>
    </div>
 </div>`;


const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


/*listens for user input and waits 1000ms after user stops typing.
* This is to ensure not overusing api daily requests*/
const onInput = async event => {
    const movies = await fetchData(event.target.value);
    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
       <img src='${imgSrc}' alt=''/>
       ${movie.Title}
       `;
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });
        resultsWrapper.appendChild(option);
    }
};


/*event listener for html input. Calls onInput function when user stops typing*/
input.addEventListener('input', debounce(onInput, 1000));

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});


const onMovieSelect = async movie => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apiKey: '32c05230',
            i: movie.imdbID,
        }
    });
    /*test to log respone from api*/
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
    return `
        <article class ='media'>
        <figure class ='media-left'>
        <p class='image'>
        <img src='${movieDetail.Poster}' alt=''/>
</p>
</figure>
<div class='media-content'>
<div class='content'>
<h1>${movieDetail.Title}</h1>
<h4>${movieDetail.Genre}</h4>
<p>${movieDetail.Plot}</p>
</div>
</div>
</article>
<article class='notification is-primary'>
<p class='title'>${movieDetail.Awards}</p>
<p class='subtitle'>Awards</p>
</article>
<article class='notification is-primary'>
<p class='title'>${movieDetail.BoxOffice}</p>
<p class='subtitle'>Box Office</p>
</article>
<article class='notification is-primary'>
<p class='title'>${movieDetail.Metascore}</p>
<p class='subtitle'>Meta Score</p>
</article>
<article class='notification is-primary'>
<p class='title'>${movieDetail.imdbRating}</p>
<p class='subtitle'>Imdb Rating</p>
</article>
<article class='notification is-primary'>
<p class='title'>${movieDetail.imdbVotes}</p>
<p class='subtitle'>Imbd Votes</p>
</article>

`;
};