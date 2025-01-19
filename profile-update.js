fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
        const script = document.createElement('script');
        script.src = './nav.js';
        document.body.appendChild(script);
    });

    


document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("אין משתמש מחובר. נא להתחבר מחדש.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("email").value = loggedInUser.email;
    document.getElementById("password").value = loggedInUser.password;
    document.getElementById("confirmPassword").value = loggedInUser.password;
    document.getElementById("firstName").value = loggedInUser.firstName;
    document.getElementById("lastName").value = loggedInUser.lastName;
    document.getElementById("age").value = loggedInUser.age;
});

function validateForm() {
    let isValid = true;

    document.querySelectorAll(".error").forEach(error => error.textContent = "");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const age = document.getElementById("age").value;

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        alert("המייל לא בפורמט תקין");
        isValid = false;
    }

    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        alert("סיסמה לא תקינה: חייבת לכלול לפחות 6 תווים, אותיות ומספרים.");
        isValid = false;
    }

    if (password !== confirmPassword) {
        alert("הסיסמה החוזרת אינה תואמת את הסיסמה הראשית.");
        isValid = false;
    }

    if (firstName.length < 2) {
        alert("שם פרטי קצר מדי.");
        isValid = false;
    }

    if (lastName.length < 2) {
        alert("שם משפחה קצר מדי.");
        isValid = false;
    }

    if (age < 18 || age > 65) {
        alert("גיל חייב להיות בין 18 ל-65.");
        isValid = false;
    }

    if (isValid) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        const userIndex = users.findIndex(user => user.email === loggedInUser.email);
        if (userIndex === -1) {
            alert("המשתמש לא נמצא במערכת.");
            return;
        }

        users[userIndex] = {
            ...users[userIndex],
            email,
            password,
            firstName,
            lastName,
            age
        };

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(users[userIndex]));

        alert("הפרופיל עודכן בהצלחה!");
        window.location.href = "home.html"; 
    }
}
