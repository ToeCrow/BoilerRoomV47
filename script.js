// script.js
import { API_KEY } from "./config.js";
const apiKey = API_KEY;
//lägg in url du vill hämta data från
const BASE_URL = 'https://newsapi.org/v2/top-headlines';
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element

async function fetchNews(url) {
    try {
        /* const url = new URL(BASE_URL);
        /* url.searchParams.append('country', country); */
        /* url.searchParams.append('category', category);
        url.searchParams.append('query', query);
        url.searchParams.append('apiKey', API_KEY); */

        // Gör en GET-förfrågan
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fel vid hämtning: ${response.status}`);
        }

        // Parsar JSON-data
        const data = await response.json();

        displayNews(data.articles);
        
        console.log("fetchNews output: ", data.articles);
        
        return data.articles; //  returns articles as JS list
        
        

    } catch (error) {
        console.error('Ett fel uppstod vid hämtning av nyheter:', error);
        return []; 
    }
}



/* console.log(`API Key: ${API_KEY}`); */

// Funktion för att formatera timestamp (svenskt datumformat utan sekunder)
function formatDate(publishedAt) {
 const date = new Date(publishedAt);
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




function searchNews() {
    const query = "q=" + searchInput.value + "&";
    
    const url = `https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`;    

    console.log("url som returneras: ", url);
    

    return url; // returns url
}

function displayNews(data) {
    console.log(newsList);
    
    newsList.innerHTML = ""; // Clear existing news items

    // check if data is empty
    if (!articles || articles.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Inga nyheter hittades.";
      newsList.appendChild(emptyMessage);
      return;
  }

    const title = data.title; // replace with actual input
    const description = data.description;  
    const source = data.name;
    const date = formatDate(data.publishedAt); //data.articles.publishedAt;

    createNewsElement( // calls function to create new element based on input values
      title,
      description,
      source,
      date
    );

    data.forEach((article) => { 
      createNewsElement(
        article.title,
        article.description,
        article.source.name,
        article.publishedAt
      );
    });

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
    
    const url = searchNews();
    
    console.log("url: ", url);
    // returns url for search

    fetchNews(url); 

});


// FILTER

  const categoryFilter = document.getElementById("category-filter");
  categoryFilter.addEventListener("change", filterNews);
  function filterNews(event) {
  
  const selectedCategory = event.target.value;
  let filteredFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;
  
  fetchNews(filteredFetch);
  console.log("filteredFetch: ", filteredFetch);
  return filteredFetch
  };