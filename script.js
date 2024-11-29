// script.js
import { API_KEY } from "./config.js";
const apiKey = API_KEY;
// Add the url you want to retrieve data from
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element

let savedSelectedCategory = "general"; // Default category, can be changed by the user when filtering

document.addEventListener("DOMContentLoaded", () => {
    fetchAllCategories();
    categoryFilter.value = localStorage.getItem("savedSelectedCategory") || savedSelectedCategory;
    displayNews();
    
});

// The code above adds an event listener to the document object.
// When the "DOMContentLoaded" event is triggered, which is when the initial HTML document has been completely loaded and parsed,
// the fetchAllCategories function is called.

async function fetchNews(url) {
    try {
        // GET-request
        const response = await fetch(url);

        // Controlling fetching errors

        if (!response.ok) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");

            switch (response.status) {
                case 400:
                    errorMessage.textContent = "invalid request (400). Control your URL.";
                    break;
                    
                case 401:
                    errorMessage.textContent = "Unothorized access (401). Not a valid API key.";
                    break;
                    
                case 404:
                    errorMessage.textContent = "Resource not found (404).";
                    break;
                    
                case 429:
                    errorMessage.textContent = "Too many requests (429). Max requests is 1000 searches per day. Try again later.";
                    break;
                    
                case 500:
                    errorMessage.textContent = "Server error (500). Try again later.";
                    break;
                    
                default:
                    errorMessage.textContent = `Uknown error (${response.status}).`;
                    
            }

            newsList.innerHTML = ""; // Clear existing news items
            newsList.appendChild(errorMessage);

            throw new Error(errorMessage.textContent);
        }

        // Parse JSON-data
        const data = await response.json();

        // Manage cases where API returns no results
        if (!data || !data.articles || data.articles.length === 0) {
            console.log("No results found for your search.");
            
            newsList.innerHTML = ""; // Clear existing news items

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No results found for your search";
            newsList.appendChild(emptyMessage);
            return "No results found for your search.";
        }


        displayNews(data.articles);

        
        console.log("fetchNews output inside: ", data.articles);
        
        return data.articles; //  returns articles as JS list
        
        

    } catch (error) {
        // Log the error for development or show user-friendly error message
        console.error("An error occurred:", error.message);
        return error.message;
    }
}

    //uppdate formatdate
 function formatDate(publishedAt) {
    if (!publishedAt) return "Uknown date"; // Fallback if date is missing

    const date = new Date(publishedAt);

    // Controlls if date is valid
    if (isNaN(date.getTime())) return "Uknown date";

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    };
    return date.toLocaleString('en-SE', options);
}

function cleanInput(input) {
  return input.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "").trim();
}

function searchNews() {

  const cleanedQuery = cleanInput(searchInput.value);

  if (cleanedQuery === "") {
      console.log("Search bar is empty or contains only special characters. Write a valid search term.");
      newsList.innerHTML = "";
      const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Search bar is empty or contains only special characters. Write a valid search term.";
            emptyMessage.classList.add("error-message");
            newsList.appendChild(emptyMessage);
            
      return null;
  }
  
  const query = `q=${cleanedQuery}&`;
    
    const url = `https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`;    
    console.log("url that is returned: ", url);
    return url; // returns url
}

//updated function to remove "removed" articles and invalid dates

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
        !article.description.includes("[Removed]"); // && 
        // !(article.source && article.source.name && article.source.name.includes("[Removed]"));

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
            article.url,
            article.content, // Pass content only to the modal
            article.urlToImage // Pass content only to the modal
        );
    });

    if (validArticles.length === 0) {
        const noNewsMessage = document.createElement("p");
        noNewsMessage.textContent = "No news could be found.";
        newsList.appendChild(noNewsMessage);
    }

    if (data.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No news found for your search.";
        newsList.appendChild(noResultsMessage);
        return;
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

    //Add "Read More" button
    const readMoreButton = document.createElement("a");
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

// store array in localstorage
function fetchAllCategories() {
    const categoriesArray = ["general", "technology", "sports", "science", "health", "entertainment", "business"];
    
    categoriesArray.forEach(async (category) => {
        const url = await categorySearch(category);
        const articles = await fetchNews(url);
        storeArticlesArrayInLocalStorage(articles, category);
    });
}

function storeArticlesArrayInLocalStorage(articles, key) {
    localStorage.setItem(key, JSON.stringify(articles));
}

function categorySearch(category) {
    const selectedCategory = category;
    let categoryFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;

    console.log("categoryFetch: ", categoryFetch);
    return categoryFetch;
  };


// event listener search
searchButton.addEventListener("click", () => {
    
    const url = searchNews();
    
    if (!url) {
      console.log("No valid URL to fetch data from.");
      return; // Stops if no valid URL
    }  

    fetchNews(url); 

});


// FILTER

  const categoryFilter = document.getElementById("category-filter");

  categoryFilter.addEventListener("change", filterNews);

  
  function filterNews(event) {
    const selectedCategory = event.target.value;
    savedSelectedCategory = selectedCategory; // update value for savedSelectedCategory
    localStorage.setItem("savedSelectedCategory", selectedCategory);

    const localStorageKey = selectedCategory;
    const localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));

    if (localStorageValue) {
      displayNews(localStorageValue);
    } else {
      let filteredFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;
      fetchNews(filteredFetch).then(articles => {
        displayNews(articles);
        localStorage.setItem(localStorageKey, JSON.stringify(articles));
      });
    }

    searchInput.value = ""; // clear search field
  };
