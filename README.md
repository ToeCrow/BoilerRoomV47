# BoilerRoomV47

### Konfigurera API-nyckel

1. Kopiera `config.template.js` och döp om filen till `config.js`.
2. Lägg till din API-nyckel i `config.js`:

```javascript
const API_KEY = "DIN_API_KEY_HÄR";


skriv 'config.js' i den filen efter du har lagt in nyckeln


Uppstart planering torsdag 15.30
Rebecca, Benjamin och Thomas.
Vi har valt att köra med nyhetsbyråns api, så vi får nyheterna på svenska.
har gjort en grovplanering i Trello och behöver komma överens om en layout på html för i morgon.
Vi behöver också ta upp vilka förväntningar vi har på varandra igen, då vi ofta är 3 st som kör igång.

Nästa möte kl 9, online hemifrån. Så ses vi på hotellet efter lunch.

Thomas skulle hämta api-key, så vi inte behöver vänta på en eventuelle aktivering i morgon. Dock säljer TT endast nyhter till företag.

Vi kör i stället newsapi.

22/11 morgonmöte/standup
Har delat in uppgifterna mellan oss. Och förtydligat varje uppgift med en todo-list.
Pratat ihop oss om att alla vill om möjligt börja med BoilerRoom på torsdag och att vi börjar kommunicera om när efter lektion på torsdag. Kan vara ett kort möte så vi har en start på fredagen och kan komma igång fortare.
Nästa standup på hotellet kl 13, vi hör av oss i slack om det är något.

standup på hotellet kl 1300
kollade över vad vi hade kvar och försöker merge:a våra brancher för att se hur de fungerar ihop.
Vi försöker hjälpa varandra och visa på storskärm medans vi slutför annat.

standup kl 15
Efter en välförtjänt rast.
Ser vi över vad som fortfarande felar behövs och bestämmer att även lördag kommer vi köra för att få det att funka.
Vi har lite fel meddelanden vi måste kolla över, samt köra igen.
Det har med olika tankar om hur vi kör varit en utmaning att få fetchen att fungera som vi vill och enligt uppgiften.


lördag delar vi upp det som är kvar att göra och alla gör sin del i helgen

måndag skulle vi endast fördelat presentationen, men fick githubproblem och satt i två timmar för att lösa.
retro går vi genom att det är svårt att planera i detalj och att vi skall försöka använda teamleader mer som klister och den som har planen.

v48
Möte på torsdag för att försöka se vad vi behöver göra. Lite forvirring med steg 1 och 2 hur vi skall kunna få till båda.
Vill hämta alla kategorier för att kunna köra promise.all och ändra på search för att välja source där.

fredag
vi kör en kort standup och kommer på att vi kan få problem att få till promise.all kravet då vi använder en foreach på kategorierna då det är snyggt i kod.
möte med Mandus för att få lite hjälp att hitta en lösning på detta. Vi bestämmar att vi hämtar ett nytt api, så vi kan ha dubbelt upp med api för vår fetch att köra promise.all. Det är guardian-apiet.

Vi måste översätta data från guardian till newsapi så vi får inte samma data till resten av koden.
Vi mergar allt till staging så vi har samma utgångspunkt.