function validateForm() {
    let isValid = true;

    document.querySelectorAll(".error").forEach(error => error.textContent = "");

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const age = document.getElementById("age").value;

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        document.getElementById("emailError").textContent = "המייל לא בפורמט תקין";
        isValid = false;
    }

    if (username.length < 6) {
        document.getElementById("usernameError1").textContent = "שם משתמש קצר מדי";
        isValid = false;
    }

    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        document.getElementById("passwordError").textContent = "סיסמה לא תקינה: או לא מכילה אות או לא מכילה ספרה";
        isValid = false;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "הסיסמה החוזרת לא תואמת לסיסמה הראשונה";
        isValid = false;
    }

    if (firstName.length < 2) {
        document.getElementById("firstNameError").textContent = "שם פרטי קצר מדי";
        isValid = false;
    }

    if (lastName.length < 2) {
        document.getElementById("lastNameError").textContent = "שם משפחה קצר מדי";
        isValid = false;
    }

    if (age < 18 || age > 65) {
        document.getElementById("ageError").textContent = "גיל חייב להיות בין 18 ל-65";
        isValid = false;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        document.getElementById("usernameError1").textContent = "שם המשתמש כבר קיים במערכת";
        isValid = false;
    }

    const EmailExists = users.some(user => user.email === email);

    if (EmailExists) {
        document.getElementById("emailError").textContent = " האימייל כבר קיים במערכת";
        isValid = false;
    }



    if (isValid) {
        const newUser = {
            email,
            username,
            password,
            firstName,
            lastName,
            age,
            shifts : [],
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("הרשמה מוצלחת!");
        window.location.href = "login.html";
    }
}


function MovetoLogin() {
    window.location.href = "login.html";
}
