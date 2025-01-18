
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
    })
    document.addEventListener('DOMContentLoaded', () => {
        const shiftToUpdate = JSON.parse(localStorage.getItem('shiftToUpdate'));
        
        if (shiftToUpdate) {
            document.getElementById('shiftDate').value = shiftToUpdate.date;
            document.getElementById('startTime').value = shiftToUpdate.startTime;
            document.getElementById('endTime').value = shiftToUpdate.endTime;
            document.getElementById('hourlyRate').value = shiftToUpdate.hourlyRate;
            document.getElementById('branch').value = shiftToUpdate.branch;
            document.getElementById('role').value = shiftToUpdate.role;
            document.getElementById('notes').value = shiftToUpdate.notes;
        } else {
           
        }
    });
    
    function saveShift() {
        document.querySelectorAll('.error-message').forEach(span => span.innerHTML = '');
        
        const shiftData = {
            date: document.getElementById("shiftDate").value,
            startTime: document.getElementById("startTime").value,
            endTime: document.getElementById("endTime").value,
            hourlyRate: parseFloat(document.getElementById("hourlyRate").value),
            branch: document.getElementById("branch").value,
            role: document.getElementById("role").value.trim(),
            notes: document.getElementById("notes").value.trim(),
        };
        
        let hasErrors = false;
        
        if (!shiftData.date) {
            document.getElementById("errorDate").innerHTML = "אנא הזן תאריך";
            hasErrors = true;
        }
    
        if (!shiftData.startTime) {
            document.getElementById("errorStartTime").innerHTML = "אנא הזן שעת התחלה";
            hasErrors = true;
        }
    
        if (!shiftData.endTime) {
            document.getElementById("errorEndTime").innerHTML = "אנא הזן שעת סיום";
            hasErrors = true;
        }
    
        if (!shiftData.hourlyRate || isNaN(shiftData.hourlyRate) || shiftData.hourlyRate <= 0) {
            document.getElementById("errorHourlyRate").innerHTML = 
                !shiftData.hourlyRate ? 'אנא הזן שכר שעתי' : 'שכר שעתי חייב להיות מספר חיובי';
            hasErrors = true;
        }

    

        if (!shiftData.branch) {
            document.getElementById("errorBranch").innerHTML = "אנא בחר סניף";
            hasErrors = true;
        }
    
        if (shiftData.role.length < 1) {
            document.getElementById("errorRole").innerHTML = "אנא הזן תפקיד תקין";
            hasErrors = true;
        }
    
        if (hasErrors) return;
    
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            alert("התחבר למשתמש!");
            window.location.href = "login.html"; 
            return;
        }
    
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === loggedInUser.email);
        if (userIndex === -1) {
            alert("משתמש לא נמצא!");
            return;
        }
    
        const userShifts = users[userIndex].shifts || [];
        const shiftToUpdate = JSON.parse(localStorage.getItem('shiftToUpdate'));
    
        const newShiftStart = new Date(`${shiftData.date}T${shiftData.startTime}`);
        const newShiftEnd = new Date(`${shiftData.date}T${shiftData.endTime}`);
        
        const overlap = userShifts.some(existingShift => {
            const existingShiftStart = new Date(`${existingShift.date}T${existingShift.startTime}`);
            const existingShiftEnd = new Date(`${existingShift.date}T${existingShift.endTime}`);
            
            return (newShiftStart < existingShiftEnd && newShiftEnd > existingShiftStart);
        });
    
        if (overlap && !shiftToUpdate) {
            alert("המשמרת חופפת למשמרת קיימת, אנא בחר זמן אחר.");
            return;
        }
    
        if (shiftToUpdate) {
            const shiftIndex = userShifts.findIndex(
                shift =>
                    shift.date === shiftToUpdate.date &&
                    shift.startTime === shiftToUpdate.startTime &&
                    shift.endTime === shiftToUpdate.endTime
            );
    
            if (shiftIndex === -1) {
                alert("לא נמצאה משמרת לעדכון");
                return;
            }
    
            userShifts[shiftIndex] = shiftData;
        } else {
            userShifts.push(shiftData);
        }
    
        users[userIndex].shifts = userShifts;
        localStorage.setItem('users', JSON.stringify(users));
    
        localStorage.removeItem('shiftToUpdate');
    
        alert(shiftToUpdate ? "המשמרת עודכנה בהצלחה!" : "המשמרת נוספה בהצלחה!");
        window.location.href = "home.html";
    }
    