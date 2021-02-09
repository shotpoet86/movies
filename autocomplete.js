const createAutoComplete = ({root}) => {
    root.innerHTML = `
        <label><b>Search for a Movie</b></label>
        <input class='input' type='text'/>
        <div class='dropdown'>
            <div class='dropdown-menu'>
                <div class='dropdown-content results'></div>
            </div>
        </div>`;


    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');


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

};

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});
