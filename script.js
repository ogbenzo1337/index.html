// script.js

function buyNow() {
    // Tutaj można dodać logikę kupna
    alert("Funkcja kupna jest w trakcie implementacji.");
}

function openModal() {
    document.getElementById("loginModal").style.display = "block";
}

function closeModal() {
    document.getElementById("loginModal").style.display = "none";
}

function login(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Tutaj możesz dodać logikę uwierzytelniania
    // Na potrzeby przykładu sprawdzamy, czy użytkownik wpisał "admin" jako nazwę użytkownika i hasło
    if (username === "admin" && password ===



