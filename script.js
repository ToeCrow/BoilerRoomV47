console.log(`API Key: ${API_KEY}`);

// Funktion för att formatera timestamp (svenskt datumformat utan sekunder)
//! kolla så paramertern stämmer
function formatDate(timestamp) {
 const date = new Date(timestamp);
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