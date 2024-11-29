// script.js
import { API_KEY, API_KEY_GUARDIAN } from "./config.js";
const apiKey = API_KEY;
const apiKeyGuardian = API_KEY_GUARDIAN;
// Add the urlNews you want to retrieve data from
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const newsList = document.getElementById("news-list"); // ul element

let savedSelectedCategory = "general"; // Default category, can be changed by the user when filtering

document.addEventListener("DOMContentLoaded", () => {
    fetchAllCategories();
    const savedCategory = localStorage.getItem("savedSelectedCategory") || savedSelectedCategory;
    categoryFilter.value = savedCategory;
    displayNews(savedCategory);
    
});

// The code above adds an event listener to the document object.
// When the "DOMContentLoaded" event is triggered, which is when the initial HTML document has been completely loaded and parsed,
// the fetchAllCategories function is called.

// async function fetchNews(urlNews) {
async function fetchNews(urlNews) {
    console.log("fetchNews running for url:", url);
    
    try {
        // GET-request
        const response = await fetch(urlNews);

        // Controlling fetching errors

        if (!response.ok) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");

            switch (response.status) {
                case 400:
                    errorMessage.textContent = "Oops! Something went wrong with your request. Please check the URL and try again.";
                    console.error("Invalid request (400). Check your URL.");
                    break;
                    
                case 401:
                    errorMessage.textContent = "Access denied. Please check your API key and try again.";
                    console.error("Unauthorized access (401). Invalid API key.");
                    break;
                    
                case 404:
                    errorMessage.textContent = "We couldn't find what you're looking for. Please check the URL and try again.";
                    console.error("Resource not found (404).");
                    break;
                    
                case 429:
                    errorMessage.textContent = "You're making too many requests! Please wait a while before trying again.";
                    console.error("Too many requests (429). Max limit of 1000 searches per day reached.");
                    break;
                    
                case 500:
                    errorMessage.textContent = "Something went wrong on our end. Please try again later.";
                    console.error("Server error (500). Try again later.");
                    break;
            
                default:
                    errorMessage.textContent = "An unexpected error occurred. Please try again.";
                    console.error(`Unexpected error (${response.status}).`);
                    break;
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


       /*  displayNews(data.articles); */

        
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
    
    const urlNews = [`https://newsapi.org/v2/top-headlines?${query}apiKey=${apiKey}`,`https://content.guardianapis.com/search?${query}api-key=${apiKeyGuardian}`];    
    console.log("urlNews that is returned: ", urlNews);
    return urlNews; // returns urlNews
}

//updated function to remove "removed" articles and invalid dates



function displayNews(data) {
    console.log(newsList);
    const categorySelect = document.getElementById("category-filter");

    const categoryIsSelected = categorySelect.value;
    
    newsList.innerHTML = ""; // Clear existing news items

    let articlesToDisplay = data;

    if (categoryIsSelected) {
        const localStorageKey = categorySelect.value;
        const localStorageValue = JSON.parse(localStorage.getItem(localStorageKey));

        if (localStorageValue) {
            articlesToDisplay = localStorageValue;
        }
    }

  const validArticles = articlesToDisplay.filter(article => {
    const isValid = 
        article.title && 
        article.description && 
        article.publishedAt && 
        article.urlNews && 
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
            article.urlNews,
            article.content, // Pass content only to the modal
            article.urlNewsToImage // Pass content only to the modal
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


  function createNewsElement(title, description, source, date, urlNews, content, urlNewsToImage) {
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
            urlNews: urlNews,
            urlNewsToImage: urlNewsToImage
            
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
    document.getElementById("modal-urlNews").href = article.urlNews;
    document.getElementById("modal-image").src = article.urlNewsToImage;    

    console.log("urlNews to image:", article.urlNewsToImage);
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
    
    async function fetchCategoriesArray() {
        await Promise.all(categoriesArray.map(async (category) => {
            const urlCategory = await categorySearch(category);
            const articles = await fetchNews(urlCategory);
            storeArticlesArrayInLocalStorage(articles, category);
        }));
    }
    fetchCategoriesArray();

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
    
    const urlNews = searchNews();
    
    if (!urlNews) {
      console.log("No valid urlNews to fetch data from.");
      return; // Stops if no valid urlNews
    }  
    async function fetchNewsFromUrls() {
        for (const url of urlNews) {
            await fetchNews(url);
        }
    }
    const articles = fetchNewsFromUrls();
    displayNews(articles);
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