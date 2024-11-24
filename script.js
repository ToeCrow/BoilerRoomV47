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
    const query = "q=" + searchInput.value.trim() + "&";
    if (searchInput.value.trim() === "") {
        console.log("Sökfrågan kan inte vara tom. Ange ett giltigt sökord.");
        return "Sökfrågan kan inte vara tom. Ange ett giltigt sökord.";
    }

    const url = `https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`;    
    console.log("url som returneras: ", url);
    return url; // returns url
}

//uppdaterad function för att ta bort removed articles och invalid dates

function displayNews(data) {
    newsList.innerHTML = ""; // Clear existing news items

    const validArticles = data.filter(article => {
        const isValid = 
            article.title && 
            article.description && 
            article.publishedAt && 
            article.url && 
           /*  article.content && // Ensure content exists */
            !article.title.includes("[Removed]") && 
            !article.description.includes("[Removed]") && 
            !(article.source && article.source.name && article.source.name.includes("[Removed]"));

        if (!isValid) {
            console.warn("Invalid or removed article ignored:", article);
        }
        return isValid;
    });

    validArticles.forEach((article) => { 
        createNewsElement(
            article.title,
            article.description,
            article.source.name,
            article.publishedAt,
            article.url,
            article.content // Pass content only to the modal
        );
    });

    if (validArticles.length === 0) {
        const noNewsMessage = document.createElement("p");
        noNewsMessage.textContent = "No articles could be retrieved.";
        newsList.appendChild(noNewsMessage);
    }
}


  function createNewsElement(title, description, source, date, url, content) {
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
    const readMoreButton = document.createElement("button");
    readMoreButton.classList.add("read-more");
    readMoreButton.textContent = "Read more";
    readMoreButton.addEventListener("click", (event) => {
        event.preventDefault();
        // Pass the content to the modal when "Read More" is clicked
        createInfoModal({
            title: title,
            description: description,
            content: content, // Content passed to modal
            source: source,
            date: date,
            url: url
        });
    });


  
    newsItem.appendChild(newsTitle);
    newsItem.appendChild(newsDescription);
    newsItem.appendChild(newsSource);
    newsItem.appendChild(newsDate);
    newsItem.appendChild(readMoreButton);
  
    newsList.appendChild(newsItem);
}

function createInfoModal(article) {
    const modal = document.getElementById("moreInfoModal");

    // Clean up the content
    const cleanedContent = article.content
    ? article.content.split(" [+")[0] // Remove everything after " [+"
    : "No additional content available.";

    if (article.content === null) {
        article.content = "No additional content available.";
    }

    if (article.description === null) {
        article.description = "No description available.";
    }

    // If the first 10 words of content and description are the same, remove the description
    const contentWords = article.content.split(/\s+/).slice(0, 10).join(" ");
    const descriptionWords = article.description.split(/\s+/).slice(0, 10).join(" ");
    if (contentWords === descriptionWords) {
        article.description = "";
    }

    // Populate modal with article details
    document.getElementById("modal-title").textContent = article.title;
    document.getElementById("modal-description").textContent = article.description || "No description available."; // Display description
    document.getElementById("modal-content").textContent = cleanedContent; // Display cleaned content
    document.getElementById("modal-source").textContent = `Source: ${article.source}`;
    document.getElementById("modal-date").textContent = `Published: ${formatDate(article.date)}`;
    document.getElementById("modal-url").href = article.url;

    // Show the modal
    modal.classList.remove("hidden");

    const modalCloseButton = document.createElement("button");
    modalCloseButton.classList.add("modal-close-button");
    modalCloseButton.textContent = "X";
    modalCloseButton.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    modal.appendChild(modalCloseButton);


    // Close modal on overlay click or button click
    const overlay = modal.querySelector(".modal-overlay");
    const closeButton = modal.querySelector(".modal-close-button");

    function closeModal() {
        modal.classList.add("hidden");
    }

    overlay.addEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);
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