let users = JSON.parse(localStorage.getItem('users'));
let usernameElement = document.getElementById('username');
let buttonsContainer = document.getElementById('buttons');

if (!users || users.length === 0) {
    usernameElement.textContent = '';
} else {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
 
        usernameElement.textContent = loggedInUser.username + '!';

        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
            logoutButton.style.display = 'inline';
        }

        const loginButton = document.querySelector('.login-button');
        if (loginButton) {
            loginButton.style.display = 'none'; 
        }
    } else {
        usernameElement.textContent = 'אורח!';

        const loginButton = document.createElement('a');
        loginButton.style = 'background-color: green; text-decoration: none; padding: 10px 15px; border-radius: 5px;cursor: pointer; '
        loginButton.textContent = 'התחבר';
        loginButton.className = 'login-button';
        loginButton.onclick = () => {
            window.location.href = "login.html";
        };

        buttonsContainer.appendChild(loginButton);

        const logoutButton = document.querySelector('.logout-btn');
        if (logoutButton) {
            logoutButton.style.display = 'none'; 
        }
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    location.reload(); 
}

function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}
