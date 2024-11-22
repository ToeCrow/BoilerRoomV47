// script.js
import { API_KEY } from "./config.js";

/* console.log(`API Key: ${API_KEY}`); */

// Funktion för att formatera timestamp (svenskt datumformat utan sekunder)
//! kolla så paramertern stämmer
function formatDate(timestamp) {
 const date = new Date(timestamp);
 const options = {
   weekday: 'short',
   year: 'numeric',
   month: 'short',
   day: 'numeric',
   hour: 'numeric',
   minute: 'numeric',
   hour12: false
 };
 return date.toLocaleString('sv-SE', options);
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element

// createNewsElement - Function to create elements and append to newsList

function searchNews() {
    const query = searchInput.value + "&";
    const apiKey = API_KEY;
/*     const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`; */
    const url = `https://newsapi.org/v2/everything?q=${query}apiKey=${apiKey}`;    

    console.log("apiKey: ", apiKey);
    console.log("query: ", query);
    console.log("url som returneras: ", url);
    

    return url;
}

function displayNews() {
    console.log(newsList);
    
    newsList.innerHTML = ""; // Clear existing news items

    const titel = "TEST Nyhetstitel"; // replace with actual input
    const description = "TEST Nyhetstext";
    const source = "TEST Nyhetkalla";
    const date = "2024-01-01T00:00:00Z";

    createNewsElement( // calls function to create new element based on input values
      titel,
      description,
      source,
      date
    );

/*     news.forEach((article) => {
      createNewsElement(
        article.title,
        article.description,
        article.source.name,
        article.publishedAt
      );
    }); */

}

  function createNewsElement(title, description, source, date) {
    const newsItem = document.createElement("li");
    newsItem.classList.add("news-item");
  
    const newsTitle = document.createElement("h2");
    newsTitle.classList.add("news-title");
    newsTitle.textContent = title;
  
    const newsDescription = document.createElement("p");
    newsDescription.classList.add("news-description");
    newsDescription.textContent = description;
  
    const newsSource = document.createElement("small");
    newsSource.classList.add("news-source");
    newsSource.textContent = source;
  
    const newsDate = document.createElement("small");
    newsDate.classList.add("news-date");
    newsDate.textContent = formatDate(date);
  
    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsDescription);
    newsItem.appendChild(newsSource);
    newsItem.appendChild(newsDate);
  
    newsList.appendChild(newsItem);
}

// SEARCH NEWS function which returns url for fetch




// event listener search
searchButton.addEventListener("click", () => {
    
    const url = searchNews(); // returns url

    //! byt namn på function till rätt
  /*   fetchFunktion(url); *///todo gustavs funktion vad-den-nu-heter */

    displayNews(); // todo - byt namn på function till rätt - hämta nyheter, input från gustavs fetchFunktion
});