/*calls movie api using free api key inside async function and
* returns user search results*/
const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apiKey: '32c05230',
            s: searchTerm
        }
    });
    console.log(response.data);
};

/*calls html input element*/
const input = document.querySelector('input');

/*var for setTimeout on user search*/
let timeoutId;

/*listens for user input and waits 1000ms after user stops typing.
* This is to ensure not overusing api daily requests*/
const onInput = (event) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        fetchData(event.target.value);
    }, 1000);
};

/*event listener for html input. Calls onInput function when user stops typing*/
input.addEventListener('input', onInput);
