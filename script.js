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
                    errorMessage.textContent = "Invalid request (400). Check your input.";
                    break;
                    
                case 401:
                    errorMessage.textContent = "Unauthorized access (401). Check your API key.";
                    break;
                    
                case 404:
                    errorMessage.textContent = "Resource not found (404).";
                    break;
                    
                case 429:
                    errorMessage.textContent = "Too many requests (429). Try again later.";
                    break;
                    
                case 500:
                    errorMessage.textContent = "Server error (500). Try again later.";
                    break;
                    
                default:
                    errorMessage.textContent = `Unknown error (${response.status}).`;
                    
            }

            newsList.innerHTML = ""; // Clear existing news items
            newsList.appendChild(errorMessage);

            throw new Error(errorMessage.textContent);
        }

        // Parsar JSON-data
        const data = await response.json();

        // Hantera fall där API returnerar tomma resultat
        if (!data.articles || data.articles.length === 0) {
            console.log("No results found for your search query.");
            
            newsList.innerHTML = ""; // Clear existing news items

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No news found.";
            newsList.appendChild(emptyMessage);
            return "No results found for your search query.";
        }


        displayNews(data.articles);
        // Uppdate pagination based on API-results
        updatePaginationButtons(data.totalResults);
        console.log("fetchNews output: ", data.articles);
        
        return data.articles; //  returns articles as JS list
        
        

    } catch (error) {
        // Logga felet för utveckling eller visa användarvänligt felmeddelande
        console.error("An error occurred:", error.message);
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
    if (!publishedAt) return "Unknown date"; // Fallback om datum saknas

    const date = new Date(publishedAt);

    // Kontrollera om datumet är giltigt
    if (isNaN(date.getTime())) return "Unknown date";

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    };
    return date.toLocaleString('en-GB', options);
}


function searchNews() {
    const query = "q=" + searchInput.value.trim() + "&";
    if (searchInput.value.trim() === "") {
        console.log("The search query cannot be empty. Please enter a valid keyword.");
        return "The search query cannot be empty. Please enter a valid keyword.";
    }
    // const skip =  (currentPage - 1) * pageSize;
    const url = `https://newsapi.org/v2/top-headlines?${query}language=en&apiKey=${apiKey}`;    
    // `https://newsapi.org/v2/top-headlines?limit=${pageSize}&skip=${skip}&${query}apiKey=${apiKey}`
    console.log("url som returneras: ", url);
    return url; // returns url
}

function articleSkip(pageSize, currentPage) {

    return (currentPage - 1) * pageSize;
    
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
            article.content, // Pass content only to the modal
            article.urlToImage // Pass content only to the modal
        );
    });

    if (validArticles.length === 0) {
        const noNewsMessage = document.createElement("p");
        noNewsMessage.textContent = "No articles could be retrieved.";
        newsList.appendChild(noNewsMessage);
    }
}


  function createNewsElement(title, description, source, date, url, content, urlToImage) {
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
            url: url,
            urlToImage: urlToImage
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

    
    if (article.content === null) {
        article.content = "No additional content available.";
    }

    if (article.description === null) {
        article.description = "No description available.";
    }
    
    // Clean up the content
    const cleanedContent = article.content.split(" [+")[0]; // Remove everything after " [+"
    

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
    document.getElementById("modal-image").src = article.urlToImage;    

    console.log("url to image:", article.urlToImage);
    

    // Show the modal
    modal.classList.remove("hidden");

    /* const modalCloseButton = document.createElement("button");
    modalCloseButton.classList.add("modal-close-button");
    modalCloseButton.textContent = "X";
    modalCloseButton.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    modal.appendChild(modalCloseButton); */


    // Close modal on overlay click or button click
    const overlay = modal.querySelector(".modal-overlay");
    const closeButton = modal.querySelector(".modal-close-button");
    const closeBtn = document.getElementById("close-modal");

    function closeModal() {
        modal.classList.add("hidden");
    }

    overlay.addEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
}

  

// SEARCH NEWS function which returns url for fetch


// event listener search
searchButton.addEventListener("click", () => {
    currentPage = 1; // Reset to the first page
    const url = searchNews();

    
    console.log("url: ", url);
    // returns url for search

    fetchNews(url); 

});

// FILTER

  const categoryFilter = document.getElementById("category-filter");
  categoryFilter.addEventListener("change", filterNews);
  function filterNews(event) {

    currentPage = 1; // Reset to the first page
    const selectedCategory = event.target.value;
    searchInput.value = "";
    let filteredFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;
    fetchNews(filteredFetch);
    console.log("filteredFetch: ", filteredFetch);
    return filteredFetch;
  };