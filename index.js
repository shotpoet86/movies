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

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
       <img src="${imgSrc}"/>
       ${movie.Title}
       `;
        resultsWrapper.appendChild(option);
    }
};


/*event listener for html input. Calls onInput function when user stops typing*/
input.addEventListener('input', debounce(onInput, 1000));
