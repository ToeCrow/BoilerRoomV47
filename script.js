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

    //uppdaterat formatdate
 function formatDate(publishedAt) {
    if (!publishedAt) return "Okänt datum"; // Fallback om datum saknas

    const date = new Date(publishedAt);

    // Kontrollera om datumet är giltigt
    if (isNaN(date.getTime())) return "Okänt datum";

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

//uppdaterad function för att ta bort removed articles och invalid dates

function displayNews(data) {
    console.log(newsList);
    
    newsList.innerHTML = ""; // Clear existing news items

  const validArticles = data.filter(article => {
    const isValid = 
        article.title && 
        article.description && 
        article.publishedAt && 
        article.url && 
        !article.title.includes("[Removed]") && 
        !article.description.includes("[Removed]") && 
        !(article.source && article.source.name && article.source.name.includes("[Removed]"));
    
    if (!isValid) {
        console.warn("Ogiltig eller borttagen artikel ignorerad:", article);
    }
    return isValid;
});

    validArticles.forEach((article) => { 
        createNewsElement(
            article.title,
            article.description,
            article.source.name,
            article.publishedAt,
            article.url
        );
    });

    if (validArticles.length === 0) {
        const noNewsMessage = document.createElement("p");
        noNewsMessage.textContent = "Inga artiklar kunde hämtas.";
        newsList.appendChild(noNewsMessage);
    }

    if (data.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "Inga nyheter hittades för din sökning.";
        newsList.appendChild(noResultsMessage);
        return;
    }

}

  function createNewsElement(title, description, source, date, url) {
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

    //lagt till läs mer knapp
    const readMoreButton = document.createElement("a");
    readMoreButton.classList.add("read-more");
    readMoreButton.textContent = "Läs mer";
    readMoreButton.href = url;
    readMoreButton.target = "_blank"; 
    readMoreButton.rel = "noopener noreferrer"; 
  
    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsDescription);
    newsItem.appendChild(newsSource);
    newsItem.appendChild(newsDate);
    newsItem.appendChild(readMoreButton);
  
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