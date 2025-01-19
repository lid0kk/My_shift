
fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
        const script = document.createElement('script');
        script.src = './nav.js';
        document.body.appendChild(script);
    });


function updateShift(shiftIndex) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser) {
        alert("התחבר למשתמש!");
        window.location.href = "login.html"; 
        return;
    }

    let users = JSON.parse(localStorage.getItem('users'));
    let loggedUser = users.find(user => user.email === loggedInUser.email);

    if (!loggedUser || !loggedUser.shifts || loggedUser.shifts.length === 0 || !loggedUser.shifts[shiftIndex]) {
        alert("משמרת לא נמצאה.");
        return;
    }

    let shift = loggedUser.shifts[shiftIndex];
    
    localStorage.setItem('shiftToUpdate', JSON.stringify(shift));
    
    window.location.href = 'shift-update-add.html';
}


let shiftsElement = document.getElementById('t-body');
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (loggedInUser) {
    let users = JSON.parse(localStorage.getItem('users'));
    let loggedUser = users.find(user => user.email === loggedInUser.email);

    if (!loggedUser || !loggedUser.shifts || loggedUser.shifts.length === 0) {
        shiftsElement.innerHTML = "<tr><td colspan='10' style='color:red; font-size: 22px; '>לא נמצאו משמרות.</td></tr>";
    } else {
        let shiftsHTML = ''; 
        let totalSalary = 0; 
        loggedUser.shifts.forEach((shift, index) => {

            let start = new Date(`${shift.date}T${shift.startTime}:00`);
            let end = new Date(`${shift.date}T${shift.endTime}:00`);
            
            if (end <= start) {
                end.setDate(end.getDate() + 1);
            }
            
     
            let timeDifference = end - start; 
            let hoursWorked = timeDifference / (1000 * 60 * 60); 
            let shiftSalary = hoursWorked * shift.hourlyRate;
            totalSalary += shiftSalary; 
            shiftsHTML += `
            <tr>
                <td>${shift.date}</td>
                <td>${shift.startTime}</td>
                <td>${shift.endTime}</td>
                <td>${shift.hourlyRate.toFixed(2)}&#8362;</td>
                <td>${shift.role}</td>
                <td>${shift.branch}</td>
                <td>${shiftSalary.toFixed(2)}&#8362;</td>
                <td>${shift.notes}</td>
                <td><button onclick="deleteShift(${index})">מחיקה</button></td>
                <td><button onclick="updateShift(${index})">עדכון</button></td>
            </tr>
            `;
        });
        

        shiftsElement.innerHTML = shiftsHTML; 

        let totalSalaryElement = document.getElementById('total-salary');
        console.log(totalSalaryElement);
        
        totalSalaryElement.innerHTML = totalSalary.toFixed(2) + '&#8362;';
    }
} else {

}

function deleteShift(shiftIndex) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); 

    if (!loggedInUser) {
        alert("התחבר למשתמש!");
        window.location.href = "login.html"; 
        return;
    }
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המשמרת?")) {
        return; 
    }
    let users = JSON.parse(localStorage.getItem('users')); 

    const userIndex = users.findIndex(user => user.email === loggedInUser.email);

    if (userIndex === -1) {
        alert("משתמש לא נמצא.");
        return;
    }
    users[userIndex].shifts.splice(shiftIndex, 1);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(users[userIndex]));
    location.reload()
   
}


function filterShifts(event) {
    if (event) {
        event.preventDefault();
    }
    let roleFilter = document.getElementById("role").value.trim().toLowerCase();
    let branchFilter = document.getElementById("branch").value;

    let shiftsElement = document.getElementById("t-body");
    shiftsElement.innerHTML = ""; 

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        shiftsElement.innerHTML = "<tr><td colspan='10' style='color:red; font-size: 22px; '>לא נמצאו משמרות.</td></tr>";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users"));
    let loggedUser = users.find(user => user.email === loggedInUser.email);

    if (!loggedUser || !loggedUser.shifts || loggedUser.shifts.length === 0) {
        shiftsElement.innerHTML = "<tr><td colspan='10' style='color:red; font-size: 22px; '>לא נמצאו משמרות.</td></tr>";
        let totalSalaryElement = document.getElementById('total-salary');
        totalSalaryElement.innerHTML = '0&#8362;'; 
        return;
    }

    let filteredShifts = loggedUser.shifts.filter(shift => {
        let roleMatches = roleFilter ? shift.role.toLowerCase().includes(roleFilter) : true;
        let branchMatches = branchFilter ? shift.branch === branchFilter : true;
        return roleMatches && branchMatches;
    });

    if (filteredShifts.length === 0) {
        shiftsElement.innerHTML = "<tr><td colspan='10' style='color:red; font-size: 22px; '> לא נמצאו משמרות שתואמות לסינון</td></tr>";
        let totalSalaryElement = document.getElementById('total-salary');
        totalSalaryElement.innerHTML = '0&#8362;'; 
    } else {
        let shiftsHTML = ''; 
        let totalSalary = 0; 

        filteredShifts.forEach((shift, index) => {
          
                let start = new Date(`${shift.date}T${shift.startTime}:00`);
                let end = new Date(`${shift.date}T${shift.endTime}:00`);
                
                if (end <= start) {
                    end.setDate(end.getDate() + 1); 
                }

                let timeDifference = end - start; 
                let hoursWorked = timeDifference / (1000 * 60 * 60); 
                let shiftSalary = hoursWorked * shift.hourlyRate;
                totalSalary += shiftSalary; 
                shiftsHTML += `
                <tr>
                    <td>${shift.date}</td>
                    <td>${shift.startTime}</td>
                    <td>${shift.endTime}</td>
                    <td>${shift.hourlyRate.toFixed(2)}&#8362;</td>
                    <td>${shift.role}</td>
                    <td>${shift.branch}</td>
                    <td>${shiftSalary.toFixed(2)}&#8362;</td>
                    <td>${shift.notes}</td>
                    <td><button onclick="deleteShift(${index})">מחיקה</button></td>
                    <td><button onclick="updateShift(${index})">עדכון</button></td>
                </tr>
                `;
            });
            

        shiftsElement.innerHTML = shiftsHTML; 
        
        let totalSalaryElement = document.getElementById('total-salary');
        totalSalaryElement.innerHTML = totalSalary > 0 ? totalSalary.toFixed(2) + '&#8362;' : '0&#8362;';
    }
}

function updateShift(shiftIndex) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    
    if (!loggedInUser) {
        alert("התחבר למשתמש!");
        window.location.href = "login.html"; 
        return;
    }

    let users = JSON.parse(localStorage.getItem('users'));
    let loggedUser = users.find(user => user.email === loggedInUser.email);

    if (!loggedUser || !loggedUser.shifts || loggedUser.shifts.length === 0 || !loggedUser.shifts[shiftIndex]) {
        alert("משמרת לא נמצאה.");
        return;
    }

    let shift = loggedUser.shifts[shiftIndex];
    localStorage.setItem('shiftToUpdate', JSON.stringify(shift));
    window.location.href = 'shift-update-add.html';
}
