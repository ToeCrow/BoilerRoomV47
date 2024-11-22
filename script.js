
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