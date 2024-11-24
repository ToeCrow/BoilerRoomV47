// script.js
import { API_KEY } from "./config.js";
const apiKey = API_KEY;
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element

let currentPage = 1; // Keeps track of the current page
const pageSize = 9; // Amount of news items per page

async function fetchNews(url) {
    try {
        // Gör en GET-förfrågan
        const response = await fetch(url);

        // Kontrollera HTTP-statuskoder

        if (!response.ok) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");

            switch (response.status) {
                case 400:
                    errorMessage.textContent = "Ogiltig begäran (400). Kontrollera din input.";
                    break;
                    
                case 401:
                    errorMessage.textContent = "Obehörig åtkomst (401). Kontrollera din API-nyckel.";
                    break;
                    
                case 404:
                    errorMessage.textContent = "Resursen kunde inte hittas (404).";
                    break;
                    
                case 429:
                    errorMessage.textContent = "För många förfrågningar (429). Försök igen senare.";
                    break;
                    
                case 500:
                    errorMessage.textContent = "Serverfel (500). Försök igen senare.";
                    break;
                    
                default:
                    errorMessage.textContent = `Okänt fel (${response.status}).`;
                    
            }

            newsList.innerHTML = ""; // Clear existing news items
            newsList.appendChild(errorMessage);

            throw new Error(errorMessage.textContent);
        }

        // Parsar JSON-data
        const data = await response.json();

        // Hantera fall där API returnerar tomma resultat
        if (!data.articles || data.articles.length === 0) {
            console.log("Inga resultat hittades för din sökfråga");
            
            newsList.innerHTML = ""; // Clear existing news items

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Inga nyheter hittades.";
            newsList.appendChild(emptyMessage);
            return "Inga resultat hittades för din sökfråga.";
        }


        displayNews(data.articles);
        // Uppdate pagination based on API-results
        updatePaginationButtons(data.totalResults);
        console.log("fetchNews output: ", data.articles);
        
        return data.articles; //  returns articles as JS list
        
        

    } catch (error) {
        // Logga felet för utveckling eller visa användarvänligt felmeddelande
        console.error("Ett fel inträffade:", error.message);
        return error.message;
    }
}

function updatePaginationButtons(totalResults) {
    const totalPages = Math.ceil(totalResults / pageSize);
    document.getElementById("current-page").textContent = currentPage;

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");
    const paginationSection = document.querySelector(".pagination-section");

    // Shows or hides pagination based on the amount of articles
    // if (totalResults > pageSize) {
    //     paginationSection.style.display = "flex"; // Visa pagination
    // } else {
    //     paginationSection.style.display = "none"; // Dölj pagination
    // }
    // Activate or deactivate pagination buttons based on current page
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;

}

document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews(searchNews()); // Use the current search
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    currentPage++;
    fetchNews(searchNews()); // Use the current search
});


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

function cleanInput(input) {
  return input.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();
}

function searchNews() {

  const cleanedQuery = cleanInput(searchInput.value);

  if (cleanedQuery === "") {
      console.log("Sökfrågan kan inte vara tom eller endast specialtecken. Ange ett giltigt sökord.");
      newsList.innerHTML = "";
      const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Sökfrågan kan inte vara tom eller endast specialtecken. Ange ett giltigt sökord.";
            emptyMessage.classList.add("error-message");
            newsList.appendChild(emptyMessage);
            
      return null;
  }
  
  const query = `q=${cleanedQuery}&`;
    
    // const skip =  (currentPage - 1) * pageSize;
    const url = `https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`;    
    // `https://newsapi.org/v2/top-headlines?limit=${pageSize}&skip=${skip}&${query}apiKey=${apiKey}`
    console.log("url som returneras: ", url);
    return url; // returns url
}

function articleSkip(pageSize, currentPage) {

    return (currentPage - 1) * pageSize;
    
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
    currentPage = 1; // Reset to the first page
    const url = searchNews();
    
    if (!url) {
      console.log("Ingen giltig URL att hämta data från.");
      return; // Stops if no valid URL
    }  

    fetchNews(url); 

});


// FILTER

  const categoryFilter = document.getElementById("category-filter");
  categoryFilter.addEventListener("change", filterNews);
  function filterNews(event) {

      currentPage = 1; // Reset to the first page
  const selectedCategory = event.target.value;
    let filteredFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;
    fetchNews(filteredFetch);
    console.log("filteredFetch: ", filteredFetch);
    return filteredFetch;
  };