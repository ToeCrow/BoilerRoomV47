//insert din api key
const API_KEY = 'ec19788c6a6f48008d20c22404dea314'; 
//lägg in url du vill hämta data från
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

async function fetchNews(country = 'us', category = '', query = '') {
    try {
        const url = new URL(BASE_URL);
        url.searchParams.append('apiKey', API_KEY);
        url.searchParams.append('country', country);

        // Gör en GET-förfrågan
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fel vid hämtning: ${response.status}`);
        }

        // Parsar JSON-data
        const data = await response.json();

        console.log('Hämtade artiklar:', data.articles);
        
        return data.articles;

    } catch (error) {
        console.error('Ett fel uppstod vid hämtning av nyheter:', error);
        return []; 
    }
}

fetchNews()




    fetch(`https://newsapi.org/v2/top-headlines?country=SE&apiKey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const newsSection = document.getElementById("news-section");
        newsSection.innerHTML = "";
        data.articles.forEach(article => {
            const articleElement = document.createElement("div");
            articleElement.classList.add("article");
            articleElement.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Läs mer</a>
            `;
            newsSection.appendChild(articleElement);
        });

    })
const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListeners("change", (event) => {
    const selectedCategory = event.target.value;
    const newsSection = document.getElementById("news-section");
    newsSection.innerHTML = "";
});try {
  // code that might throw an error
} catch (error) {
  // code to handle the error
}