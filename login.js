function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    if (!username || !password) {
        errorMessage.textContent = "שם המשתמש והסיסמה חסרים";
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.username === username);
    console.log(user);
    
    if (!user) {
        errorMessage.textContent = "אין לך משתמש הירשם לאתר";
        return;
    }

    if (user.password !== password) {
        errorMessage.textContent = "הסיסמה לא תואמת לשם משתמש";
        return;
    }

    user.loggedOut = false;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert("התחברת בהצלחה!");
    window.location.href = "index.html";  
}
