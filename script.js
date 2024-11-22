console.log(`API Key: ${API_KEY}`);

async function fetchData(apiUrl, userQuery, apiKey) {
    // Validering av användarens sökinput
    if (!userQuery || userQuery.trim() === "") {
        return "Sökfrågan kan inte vara tom. Ange ett giltigt sökord.";
    }

    const url = `${apiUrl}?query=${encodeURIComponent(userQuery)}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        // Kontrollera HTTP-statuskoder
        if (!response.ok) {
            switch (response.status) {
                case 400:
                    throw new Error("Ogiltig begäran (400). Kontrollera din input.");
                case 401:
                    throw new Error("Obehörig åtkomst (401). Kontrollera din API-nyckel.");
                case 404:
                    throw new Error("Resursen kunde inte hittas (404).");
                case 429:
                    throw new Error("För många förfrågningar (429). Försök igen senare.");
                case 500:
                    throw new Error("Serverfel (500). Försök igen senare.");
                default:
                    throw new Error(`Okänt fel (${response.status}).`);
            }
        }

        const data = await response.json();

        // Hantera fall där API returnerar tomma resultat
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return "Inga resultat hittades för din sökfråga.";
        }

        return data; // Returnera resultaten om allt fungerar
    } catch (error) {
        // Logga felet för utveckling eller visa användarvänligt felmeddelande
        console.error("Ett fel inträffade:", error.message);
        return error.message;
    }
}
