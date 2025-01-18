fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
        const script = document.createElement('script');
        script.src = '../JavaScript/nav.js';
        document.body.appendChild(script);
    });

document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("אין משתמש מחובר. נא להתחבר מחדש.");
        window.location.href = "login.html";
        return;
    }
});

const modal = document.getElementById("form-modal");
const formFields = document.getElementById("form-fields");
const formTitle = document.getElementById("form-title");
const cancelButton = document.getElementById("cancel-btn");
let loggedinUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;

cancelButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});

if (loggedinUser) {
    loggedinUser.education = loggedinUser.education || [];
    loggedinUser.experience = loggedinUser.experience || [];
} else {
    console.error("No loggedInUser found in localStorage");
}

function saveToStorage(field, list) {
    console.log("Saving data to storage:", field, list);
    loggedinUser[field] = list;
    localStorage.setItem("loggedInUser", JSON.stringify(loggedinUser));

    const userIndex = users.findIndex(user => user.email === loggedinUser.email);
    if (userIndex !== -1) {
        users[userIndex][field] = list;
        localStorage.setItem("users", JSON.stringify(users));
    } else {
        console.error("User not found in users array.");
    }
}

function openForm(title, fields, index = null, existingValues = [], placeholders = []) {
    formTitle.textContent = title;
    formFields.innerHTML = fields.map((field, idx) => {
        if (field === "תואר/תעודה") {
            return `
                <label>${field}:</label>
                <select>
                    <option value="">בחר...</option>
                    <option value="תעודה" ${existingValues[idx] === "תעודה" ? "selected" : ""}>תעודה</option>
                    <option value="תואר ראשון" ${existingValues[idx] === "תואר ראשון" ? "selected" : ""}>תואר ראשון</option>
                    <option value="תואר שני" ${existingValues[idx] === "תואר שני" ? "selected" : ""}>תואר שני</option>
                    <option value="תואר שלישי" ${existingValues[idx] === "תואר שלישי" ? "selected" : ""}>תואר שלישי</option>
                </select><br>
            `;
        } else if (field === "שנת סיום" || field === "תיאור") {
            return `
                <label>${field}:</label>
                <input type="text" value="${existingValues[idx] || ''}" placeholder="${placeholders[idx] || ''}"><br>
            `;
        } else {
            return `
                <label>${field}:</label>
                <input type="text" value="${existingValues[idx] || ''}" placeholder="${placeholders[idx] || ''}" required><br>
            `;
        }
    }).join("");
    formFields.dataset.index = index;
    modal.classList.remove("hidden");
}

document.getElementById("add-education-btn").addEventListener("click", () => {
    openForm(
        "השכלה",
        ["שנת התחלה", "שנת סיום", "שם מוסד לימודים", "תואר/תעודה", "תיאור"],
        null,
        [],
        ["הכנס שנת התחלה", "הכנס שנת סיום", "הכנס שם מוסד לימודים", "הכנס תואר/תעודה", "תאר את נושא הלימודים בקצרה"]
    );
});

document.getElementById("add-experience-btn").addEventListener("click", () => {
    openForm(
        "ניסיון תעסוקתי",
        ["שנת התחלה", "שנת סיום", "שם מעסיק", "תפקיד", "תיאור"],
        null,
        [],
        ["הכנס שנת התחלה", "הכנס שנת סיום", "הכנס שם מעסיק", "הכנס תפקיד", "הכנס תיאור"]
    );
});

document.getElementById("dynamic-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const values = Array.from(formFields.querySelectorAll("input, select")).map(input => input.value);
    console.log("Form submitted values:", values);

    if (!values[0] || !values[2] || !values[3]) { 
        alert("יש למלא את כל השדות החובה.");
        return;
    }

    if (values[0] > values[1] && values[1]) { 
        alert("שנת ההתחלה לא יכולה להיות גדולה משנת הסיום.");
        return;
    }

    const field = formTitle.textContent === "השכלה" ? "education" : "experience";
    let index = formFields.dataset.index;

    if (index === null || index === "null") {
        console.log(`Adding new entry to ${field}`);
        loggedinUser[field].push(values);
    } else {
        console.log(`Updating ${field} at index ${index}`);
        index = parseInt(index);
        loggedinUser[field][index] = values;
    }

    saveToStorage(field, loggedinUser[field]);
    displayData(field);
    modal.classList.add("hidden");
});

function displayData(field) {
    const container = document.getElementById(`${field}-list`);
    const data = loggedinUser[field];
    console.log(`Displaying ${field}:`, data);

    if (!data || data.length === 0) {
        container.innerHTML = `<h1>${field === "education" ? "השכלה" : "ניסיון תעסוקתי"}</h1><p style='color:red'> אנא הוסף ${field === "education" ? "השכלה" : "ניסיון תעסוקתי"}.</p>`;
    } else {
        container.innerHTML = `<h1>${field === "education" ? "השכלה" : "ניסיון תעסוקתי"}</h1>` + data.map((item, index) => `
            <div>
                <p><strong>תאריך התחלה:</strong> ${item[0]}</p>
                <p><strong>תאריך סיום:</strong> ${item[1]}</p>
                <p><strong>${field === "education" ? "שם מוסד" : "שם מעסיק"}:</strong> ${item[2]}</p>
                <p><strong>${field === "education" ? "תואר/תעודה" : "תפקיד"}:</strong> ${item[3]}</p>
                <p><strong>תיאור:</strong> ${item[4]}</p>
                <button onclick="editData('${field}', ${index})">ערוך</button>
                <button onclick="deleteData('${field}', ${index})">מחק</button>
            </div>
        `).join("");
    }
}

function editData(field, index) {
    const fields = field === "education" ? ["שנת התחלה", "שנת סיום", "שם מוסד", "תואר/תעודה", "תיאור"] : ["שנת התחלה", "שנת סיום", "שם מעסיק", "תפקיד", "תיאור"];
    const placeholders = field === "education" ?
        ["הכנס שנת התחלה", "הכנס שנת סיום", "הכנס שם מוסד", "הכנס תואר/תעודה", "הכנס תיאור"] :
        ["הכנס שנת התחלה", "הכנס שנת סיום", "הכנס שם מעסיק", "הכנס תפקיד", "הכנס תיאור"];
    openForm(field === "education" ? "השכלה" : "ניסיון תעסוקתי", fields, index, loggedinUser[field][index], placeholders);
    modal.addEventListener("hidden", () => {
        alert("הפרטים עודכנו בהצלחה!");
    }, { once: true });
}

function deleteData(field, index) {
    if (confirm("האם אתה בטוח שברצונך למחוק רשומה זו?")) {
        loggedinUser[field].splice(index, 1);
        saveToStorage(field, loggedinUser[field]);
        displayData(field);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (loggedinUser) {
        displayData("education");
        displayData("experience");
    }
});
