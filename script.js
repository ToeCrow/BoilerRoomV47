// script.js
import { API_KEY } from "./config.js";
const apiKey = API_KEY;
//lägg in url du vill hämta data från
const BASE_URL = 'https://newsapi.org/v2/top-headlines';
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element


// async function fetchData(apiUrl, userQuery, apiKey) {
//     // Validering av användarens sökinput
    

//     const url = `${apiUrl}?query=${encodeURIComponent(userQuery)}&apiKey=${apiKey}`;

//     try {
//         const response = await fetch(url);

        

//         const data = await response.json();

        

//         return data; // Returnera resultaten om allt fungerar
//     } 
// };



async function fetchNews(url) {
    try {
        /* const url = new URL(BASE_URL);
        /* url.searchParams.append('country', country); */
        /* url.searchParams.append('category', category);
        url.searchParams.append('query', query);
        url.searchParams.append('apiKey', API_KEY); */

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
        if (!data || !data.articles || data.articles.length === 0) {
            console.log("Inga resultat hittades för din sökfråga");
            
            newsList.innerHTML = ""; // Clear existing news items

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Inga nyheter hittades.";
            newsList.appendChild(emptyMessage);
            return "Inga resultat hittades för din sökfråga.";
        }


        displayNews(data.articles);
        
        console.log("fetchNews output: ", data.articles);
        
        return data.articles; //  returns articles as JS list
        
        

    } catch (error) {
        // Logga felet för utveckling eller visa användarvänligt felmeddelande
        console.error("Ett fel inträffade:", error.message);
        return error.message;
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
    const query = "q=" + searchInput.value.trim() + "&";
    if (searchInput.value.trim() === "") {
        console.log("Sökfrågan kan inte vara tom. Ange ett giltigt sökord.");
        return "Sökfrågan kan inte vara tom. Ange ett giltigt sökord.";
    }

    const url = `https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`;    
    console.log("url som returneras: ", url);
    return url; // returns url
}

function displayNews(data) {
    console.log(newsList);
    
    newsList.innerHTML = ""; // Clear existing news items



    /* const title = data.title; // replace with actual input
    const description = data.description;  
    const source = data.name;
    const date = formatDate(data.publishedAt); //data.articles.publishedAt; */

/*     createNewsElement( // calls function to create new element based on input values
      title,
      description,
      source,
      date
    ); */

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