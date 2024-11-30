// script.js
import { API_KEY, API_KEY_GUARDIAN } from "./config.js";
import { translateGuardianNews } from "./utils.js";
import { getCategoryApiUrl, storeArticlesArrayInLocalStorage } from "./data.js";

const apiKey = API_KEY;
const apiKeyGuardian = API_KEY_GUARDIAN;
// Add the urlNews you want to retrieve data from
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element

let savedSelectedCategory = "general"; // Default category, can be changed by the user when filtering

document.addEventListener("DOMContentLoaded", () => {
    const categoriesInLocalStorage = localStorage.getItem("general"); //! change to check all different keys
    if (!categoriesInLocalStorage) { // if there are no locally saved, then fetch them all and add to local storage
        fetchAllCategories();
    }

    
    const savedCategory = localStorage.getItem("savedSelectedCategory") || savedSelectedCategory;
    categoryFilterDropdown.value = savedCategory;
    categoryFilterDropdown.value = savedCategory;
    displayNews(savedCategory);
});

// The code above adds an event listener to the document object.
// When the "DOMContentLoaded" event is triggered, which is when the initial HTML document has been completely loaded and parsed,
// the fetchAllCategories function is called.

// async function fetchNews(urlNews) {
    async function fetchNews(url) {
        console.log(`Fetching news from URL: ${url}`);
        try {
            // Perform the fetch request
            const response = await fetch(url);
    
            // Handle HTTP response errors
            if (!response.ok) {
                const errorMessage = document.createElement("p");
                errorMessage.classList.add("error-message");
    
                switch (response.status) {
                    case 400:
                        errorMessage.textContent = "Invalid request (400). Please check the URL.";
                        console.error("Invalid request (400). Check your request parameters or syntax.");
                        break;
                    case 401:
                        errorMessage.textContent = "Unauthorized access (401). Check your API key.";
                        console.error("Unauthorized access (401). Ensure the API key is correct and has necessary permissions.");
                        break;
                    case 404:
                        errorMessage.textContent = "Resource not found (404).";
                        console.error("Resource not found (404). The requested URL or endpoint may not exist.");
                        break;
                    case 429:
                        errorMessage.textContent = "Too many requests (429). API rate limit exceeded.";
                        console.error("Too many requests (429). Ensure you adhere to the API usage limits.");
                        break;
                    case 500:
                        errorMessage.textContent = "Server error (500). Try again later.";
                        console.error("Server error (500). This issue is on the server's side.");
                        break;
                    default:
                        errorMessage.textContent = "An unexpected error occurred. Please try again.";
                        console.error(`Unexpected error (${response.status}). Review the API documentation or logs.`);
                        break;
                }
    
                // Show the error on the UI and return an empty array
                newsList.innerHTML = ""; // Clear existing news items
                newsList.appendChild(errorMessage); // Display error message to the user
                return [];
            }
    
            // Parse the JSON data
            const data = await response.json();
            console.log("Raw data fetched:", data);
    
            // Check if the response contains articles
            if ((!data.articles || data.articles.length === 0) && (!data.response?.results || data.response.results.length === 0)) {
                console.warn("No articles found in the response.");
                const noResultsMessage = document.createElement("p");
                noResultsMessage.classList.add("error-message");
                noResultsMessage.textContent = "No articles found for your request. Try a different category or search term.";
                newsList.innerHTML = ""; // Clear existing news items
                newsList.appendChild(noResultsMessage); // Display a no-results message to the user
                return [];
            }
    
            // Process Guardian API responses through `translateGuardianNews()`
            if (url.includes("content.guardianapis.com")) {
                console.log("Processing Guardian API data through translateGuardianNews()");
                const translatedArticles = translateGuardianNews(data.response.results);
                console.log("Translated Guardian articles:", translatedArticles);
                return translatedArticles;
            }
    
            // Return articles for other APIs (e.g., News API)
            console.log("Articles fetched from News API:", data.articles);
            return data.articles || [];
        } catch (error) {
            // Log any fetch or parsing errors
            console.error("Error during fetchNews execution:", error);
    
            // Show a generic error message to the user
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = "An error occurred while fetching the news. Please check your internet connection and try again.";
    async function fetchNews(url) {
        console.log(`Fetching news from URL: ${url}`);
        try {
            // Perform the fetch request
            const response = await fetch(url);
    
            // Handle HTTP response errors
            if (!response.ok) {
                const errorMessage = document.createElement("p");
                errorMessage.classList.add("error-message");
    
                switch (response.status) {
                    case 400:
                        errorMessage.textContent = "Invalid request (400). Please check the URL.";
                        console.error("Invalid request (400). Check your request parameters or syntax.");
                        break;
                    case 401:
                        errorMessage.textContent = "Unauthorized access (401). Check your API key.";
                        console.error("Unauthorized access (401). Ensure the API key is correct and has necessary permissions.");
                        break;
                    case 404:
                        errorMessage.textContent = "Resource not found (404).";
                        console.error("Resource not found (404). The requested URL or endpoint may not exist.");
                        break;
                    case 429:
                        errorMessage.textContent = "Too many requests (429). API rate limit exceeded.";
                        console.error("Too many requests (429). Ensure you adhere to the API usage limits.");
                        break;
                    case 500:
                        errorMessage.textContent = "Server error (500). Try again later.";
                        console.error("Server error (500). This issue is on the server's side.");
                        break;
                    default:
                        errorMessage.textContent = "An unexpected error occurred. Please try again.";
                        console.error(`Unexpected error (${response.status}). Review the API documentation or logs.`);
                        break;
                }
    
                // Show the error on the UI and return an empty array
                newsList.innerHTML = ""; // Clear existing news items
                newsList.appendChild(errorMessage); // Display error message to the user
                return [];
            }
    
            // Parse the JSON data
            const data = await response.json();
            console.log("Raw data fetched:", data);
    
            // Check if the response contains articles
            if ((!data.articles || data.articles.length === 0) && (!data.response?.results || data.response.results.length === 0)) {
                console.warn("No articles found in the response.");
                const noResultsMessage = document.createElement("p");
                noResultsMessage.classList.add("error-message");
                noResultsMessage.textContent = "No articles found for your request. Try a different category or search term.";
                newsList.innerHTML = ""; // Clear existing news items
                newsList.appendChild(noResultsMessage); // Display a no-results message to the user
                return [];
            }
    
            // Process Guardian API responses through `translateGuardianNews()`
            if (url.includes("content.guardianapis.com")) {
                console.log("Processing Guardian API data through translateGuardianNews()");
                const translatedArticles = translateGuardianNews(data.response.results);
                console.log("Translated Guardian articles:", translatedArticles);
                return translatedArticles;
            }
    
            // Return articles for other APIs (e.g., News API)
            console.log("Articles fetched from News API:", data.articles);
            return data.articles || [];
        } catch (error) {
            // Log any fetch or parsing errors
            console.error("Error during fetchNews execution:", error);
    
            // Show a generic error message to the user
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = "An error occurred while fetching the news. Please check your internet connection and try again.";
            newsList.innerHTML = ""; // Clear existing news items
            newsList.appendChild(errorMessage); // Display error message to the user
            return [];
        }
    }
    

// function translate Guardian API results to API News format



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
    
    const urlNews = [`https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`,`https://content.guardianapis.com/search?${query}api-key=${apiKeyGuardian}`];    
    console.log("urlNews that is returned: ", urlNews);
    return urlNews; // returns urlNews
}

//updated function to remove "removed" articles and invalid dates



function getValidArticles(articles) {
    if (!Array.isArray(articles)) {
        console.error("Expected an array, but got:", articles);
        return []; // Return an empty array to avoid further errors
    }

    return articles.filter(article => {
        const isValid =
            article.title &&
            (article.description || article.content) &&
            article.publishedAt &&
            article.url &&
            !article.title.includes("[Removed]") &&
            !article.description?.includes("[Removed]");

        if (!isValid) {
            console.warn("Invalid or removed article ignored:", article);
        }
        return isValid;
    });
}



function displayNews(data) {
    console.log(newsList);
    const categorySelect = document.getElementById("category-filter");

    const categoryIsSelected = categorySelect.value;
    
    newsList.innerHTML = ""; // Clear existing news items

    let articlesToDisplay = data;

    if (searchInput.value) {
        articlesToDisplay = data;
    } else if (categoryIsSelected) {
    if (searchInput.value) {
        articlesToDisplay = data;
    } else if (categoryIsSelected) {
        const localStorageKey = categorySelect.value;
        const localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));

        if (localStorageValue) {
            articlesToDisplay = localStorageValue;
        }
    }

    const validArticles = getValidArticles(articlesToDisplay);

    validArticles.forEach((article) => { 
        createNewsElement(
            article.title,
            article.description,
            article.source.name,
            /* article.name, */
            article.publishedAt,
            article.url,
            article.url,
            article.content, // Pass content only to the modal
            article.urlToImage // Pass content only to the modal
            article.urlToImage // Pass content only to the modal
        );
    });

}


  function createNewsElement(title, description, source, date, url, content, urlToImage) {
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
    let articleContent = article.content || "";
    //if the content contain the word " [+", remove it
    if (article.source !== "The Guardian" && articleContent.includes(" [+")) { //todo: fix this //rebecca
        articleContent = articleContent.split(" [+")[0];// Remove everything after " [+"
    }

    // If the first 10 words of content and description are the same, remove the description //todo check what this returns in console log //rebecca
    const contentWords = (articleContent || "").split(/\s+/).slice(0, 10).join(" ");
    const descriptionWords = (article.description || "").split(/\s+/).slice(0, 10).join(" ");
    console.log("contentwords, what is returned? : ", contentWords);
    console.log("descriptionWords, what is returned? : ", descriptionWords);
    
    if (contentWords === descriptionWords) {
        article.description = "";
    }

    // Populate modal with article details
    document.getElementById("modal-title").textContent = article.title;
    document.getElementById("modal-description").textContent = article.description || "No description available."; // Display description
    document.getElementById("modal-content").textContent = articleContent; 
    document.getElementById("modal-content").textContent = articleContent; 
    document.getElementById("modal-source").textContent = `Source: ${article.source}`;
    document.getElementById("modal-date").textContent = `Published: ${formatDate(article.date)}`;
    document.getElementById("modal-url").href = article.url; //! changed from urlNews //rebecca
    document.getElementById("modal-image").src = article.urlToImage || "";    

    console.log("url to image:", article.urlToImage);
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
async function fetchAllCategories() {
    const categoriesArray = ["culture", "general", "technology", "sports", "science", "health", "entertainment", "business"]; //todo remove culture if we are only displaying "top news, also remove from dropdown in HTML"
    console.log("Fetching all categories:", categoriesArray);

    await Promise.all(
        categoriesArray.map(async (category) => {
            // Fetch from News API
            const newsApiUrl = getCategoryApiUrl(category, "newsapi");
            console.log(`Fetching News API for category ${category}: ${newsApiUrl}`);
            const newsApiArticles = await fetchNews(newsApiUrl);

            // Fetch from Guardian API
            const guardianApiUrl = getCategoryApiUrl(category, "guardian");
            console.log(`Fetching Guardian API for category ${category}: ${guardianApiUrl}`);
            const guardianApiArticles = await fetchNews(guardianApiUrl);

            // Combine articles from both APIs
            const combinedArticles = [...newsApiArticles, ...guardianApiArticles];
            console.log(`Combined articles for category ${category}:`, combinedArticles);

            // Store in localStorage
            storeArticlesArrayInLocalStorage(combinedArticles, category);
        })
    );
}



//! not in use  ???
 function categorySearch(category) {
    const selectedCategory = category;
    let categoryFetch = `https://newsapi.org/v2/top-headlines?category=${selectedCategory}&apiKey=${apiKey}`;

    console.log("categoryFetch: ", categoryFetch);
    return categoryFetch;
  };
//! ....


// event listener search
searchButton.addEventListener("click", async () => {
    const urlSearch = searchNews();
    
    if (!urlSearch) {
        console.log("No valid urlNews to fetch data from.");
        return; // Stops if no valid urlSearch
    }

    console.log("Fetching articles from search URLs...");
    const fetchedArticles = await fetchNewsFromUrls(urlSearch); // Await the resolution of the promise
    console.log("Fetched articles:", fetchedArticles);

    const validArticles = getValidArticles(fetchedArticles); // Pass resolved articles to the filtering function
    console.log("Valid articles after filtering:", validArticles);

    displayNews(validArticles); // Display the filtered articles

    // Store in localStorage
    storeArticlesArrayInLocalStorage(validArticles, "saved search");
});


function temporaryArticlesArray(articles) {
    const temporaryArticlesArray = [];
    for (const article of articles) {
        if (article.title) {
            temporaryArticlesArray.push(article);
        }
    }
    return temporaryArticlesArray;
}

async function fetchNewsFromUrls(urlNews) {
    const results = [];
    for (const url of urlNews) {
        const articles = await fetchNews(url); // Await the fetchNews function
        if (Array.isArray(articles)) {
            results.push(...articles); // Add the fetched articles to the results array
        } else {
            console.warn("Non-array response from fetchNews:", articles);
        }
    }
    return results; // Return the combined array of articles
}



// FILTER

  const categoryFilterDropdown = document.getElementById("category-filter");
  const categoryFilterDropdown = document.getElementById("category-filter");

  categoryFilterDropdown.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    displayNews(JSON.parse(localStorage.getItem(selectedCategory)));
  });

  
  categoryFilterDropdown.addEventListener("change", async (event) => {
    const selectedCategory = event.target.value;
    console.log(`Category filter changed to: ${selectedCategory}`);

    const localStorageKey = selectedCategory;
    const localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));

    if (localStorageValue) {
        console.log(`Displaying articles from localStorage for category: ${selectedCategory}`);
        displayNews(localStorageValue);
    } else {
        console.log(`Fetching articles for category ${selectedCategory} from APIs.`);
        const newsApiUrl = getCategoryApiUrl(selectedCategory, "newsapi");
        const guardianApiUrl = getCategoryApiUrl(selectedCategory, "guardian");

        const [newsApiArticles, guardianApiArticles] = await Promise.all([
            fetchNews(newsApiUrl),
            fetchNews(guardianApiUrl)
        ]);

        const combinedArticles = [...newsApiArticles, ...guardianApiArticles];
        console.log(`Combined articles for category ${selectedCategory}:`, combinedArticles);

        // Save to localStorage for faster future access
        storeArticlesArrayInLocalStorage(combinedArticles, selectedCategory);

        // Display articles
        displayNews(combinedArticles);
    }
});

//! not currently in use
function sortArticlesByDate(articles) {
    return articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

/* // Example usage:
const combinedArticles = [...newsApiArticles, ...guardianApiArticles];
const sortedArticles = sortArticlesByDate(combinedArticles);
displayNews(sortedArticles);
 */
//! ....

//   fetchtimer (10 minuter)
let isFetching = false;

function fetchNewsTimer() {
    if (isFetching) return;

    isFetching = true;
    fetchNews().finally(() => {
        isFetching = false;
    });
}

setInterval(fetchNewsTimer, 600000);





