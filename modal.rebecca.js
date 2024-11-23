function deleteAllTasks() {
 // Avbryt om det inte finns nåt i arrayen
 if (!checkTasksBeforeAction()) {
   return; 
 }
 
 const confirmDelete = document.createElement("div");
 confirmDelete.id = "passwordModal";
 confirmDelete.classList.add("modal");  

 confirmDelete.innerHTML = `
 <div class="modal-content">
   <span class="close">&times;</span>
   <h2>Ange lösenord för att radera alla uppgifter</h2>
   <input type="password" id="passwordInput" placeholder="Ange lösenord">
   <button id="submitPassword">Bekräfta</button>
 </div>
 `;

 document.body.appendChild(confirmDelete); 

 const passwordModal = document.getElementById("passwordModal");
 const closeBtn = document.querySelector(".close");
 const submitPassword = document.getElementById("submitPassword");
 const passwordInput = document.getElementById("passwordInput");
 const h2 = confirmDelete.querySelector("h2");

 // Stäng modalen när användaren klickar på 'x'
 closeBtn.addEventListener("click", () => {
 passwordModal.style.display = "none";
 resetModal();
 });

// Stäng modalen om användaren klickar utanför modalen
 window.addEventListener("click", (event) => {
 if (event.target === passwordModal) {
   passwordModal.style.display = "none";
   resetModal();
 }
 });

 // Kontrollera lösenordet och radera alla uppgifter
 submitPassword.addEventListener("click", handlePasswordSubmit);
 
 // Lägg till en event listener för Enter-tangenten
 passwordInput.addEventListener("keydown", function(event) {
   if (event.key === "Enter") {
     event.preventDefault();
     handlePasswordSubmit();
   }
 });

 //! Milliondollarfunction :)
 function resetModal() {
   h2.innerText = "Ange lösenord för att radera alla uppgifter";
   h2.style.color = "black";
   h2.style.fontWeight = "normal";
   passwordInput.value = "";
 }

 function handlePasswordSubmit() {
   const enteredPassword = passwordInput.value;
   const correctPassword = "ja";
   if (enteredPassword === correctPassword) {
     clearTasks();
     passwordModal.style.display = "none";
     createForm();
     resetModal()
   } else {
     h2.innerText = "Skriv in 'ja' för att radera alla uppgifter.";
     h2.style.color = "red";
     h2.style.fontWeight = "bold";
     passwordInput.value = "";
     passwordInput.focus();
   }
 }

  // Visa modalen och fokus på passwordInput
  passwordModal.style.display = "block";
  passwordInput.focus();
}