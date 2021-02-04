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

/*calls html input element*/
const input = document.querySelector('input');


/*listens for user input and waits 1000ms after user stops typing.
* This is to ensure not overusing api daily requests*/
const onInput = async event => {
    const movies = await fetchData(event.target.value);
    for (let movie of movies) {
        const div = document.createElement('div');
        div.innerHTML = `
       <img src="${movie.Poster}"/>
       <h1>${movie.Title}</h1>
       `;
        document.querySelector('#target').appendChild(div);
    }
};


/*event listener for html input. Calls onInput function when user stops typing*/
input.addEventListener('input', debounce(onInput, 1000));
