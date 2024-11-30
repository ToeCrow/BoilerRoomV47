


function translateGuardianNews(data) {
    const translatedData = data.map((article) => ({
        title: article.webTitle,
        description: article.fields?.bodyText || "No description available.",
        name: "The Guardian",
        url: article.webUrl,
        publishedAt: article.webPublicationDate,
        image: article.fields?.thumbnail || "No image available",
        urlNews: article.webUrl,
    }));
    console.log("Translated Guardian articles:", translatedData);
    return translatedData;
}

export { translateGuardianNews };