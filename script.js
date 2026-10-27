
/* =====================================
   WebDev Member Registration
   JavaScript - Beginner Friendly
   ===================================== */

// Get the form and page elements
const regForm = document.getElementById("regform");
const theme = document.getElementById("theme");
const memberList = document.getElementById("memberList");
const count = document.getElementById("count");
const successMsg = document.getElementById("successMsg");
const emptyNote = document.getElementById("emptyNote");

// Get the input fields
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput =
    document.getElementById("confirm-password");
const genderInput = document.getElementById("gender");
const dobInput = document.getElementById("dob");
const countryInput = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const bioInput = document.getElementById("bio");

// Store registered members
let members = JSON.parse(
    localStorage.getItem("webdevMembers") || "[]"
);

// Display an error message
function showError(field, message) {
    const errorElement = document.getElementById(
        field + "Error"
    );

    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear error messages
function clearErrors() {
    document.querySelectorAll(".error").forEach(function (error) {
        error.textContent = "";
    });
}

// Validate the registration form
function validateForm() {
    clearErrors();

    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const gender = genderInput.value;
    const dob = dobInput.value;
    const country = countryInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate full name
    if (name.length < 2) {
        showError("name", "Enter your full name.");
        valid = false;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Enter a valid email address.");
        valid = false;
    }

    // Validate password
    if (password.length < 8) {
        showError(
            "password",
            "Password must have at least 8 characters."
        );
        valid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
        showError("confirmPassword", "Passwords do not match.");
        valid = false;
    }

    // Validate gender
    if (gender === "") {
        showError("gender", "Please select your gender.");
        valid = false;
    }

    // Validate date of birth
    if (dob === "") {
        showError("dob", "Enter your date of birth.");
        valid = false;
    } else if (new Date(dob) > new Date()) {
        showError("dob", "Date of birth cannot be in the future.");
        valid = false;
    }

    // Validate country
    if (country === "") {
        showError("country", "Enter your country.");
        valid = false;
    }

    // Validate phone number
    if (phone !== "" && !/^[+\d][\d\s()-]{6,19}$/.test(phone)) {
        showError("phone", "Enter a valid phone number.");
        valid = false;
    }

    return valid;
}

// Save members in the browser
function saveMembers() {
    localStorage.setItem(
        "webdevMembers",
        JSON.stringify(members)
    );
}

// Display registered members
function displayMembers() {
    memberList.innerHTML = "";

    count.textContent = members.length;

    if (members.length === 0) {
        const note = document.createElement("li");
        note.className = "empty";
        note.id = "emptyNote";
        note.textContent = "No members yet.";
        memberList.appendChild(note);
        return;
    }

    members.forEach(function (member) {
        const item = document.createElement("li");

        const name = document.createElement("strong");
        name.textContent = member.name;

        const details = document.createElement("p");
        details.textContent = member.email + " | " + member.country;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {
            members = members.filter(function(person) {
                return person.email !== member.email;
            });

            localStorage.setItem(
                "webfdevMembers",
                JSON.stringify(members)
            );

            displayMembers();
        });

        item.appendChild(name);
        item.appendChild(details);
        item.appendChild(removeButton);
        memberList.appendChild(item);
    });
}

// Register a new member
regForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        successMsg.classList.add("hidden");
        return;
    }

    const email = emailInput.value.trim().toLowerCase();

    // Prevent duplicate email addresses
    const alreadyRegistered = members.some(function (member) {
        return member.email.toLowerCase() === email;
    });

    if (alreadyRegistered) {
        showError("email", "This email is already registered.");
        successMsg.classList.add("hidden");
        return;
    }

    // Create a new member
    const newMember = {
        name: nameInput.value.trim(),
        email: email,
        gender: genderInput.value,
        dob: dobInput.value,
        country: countryInput.value.trim(),
        phone: phoneInput.value.trim(),
        bio: bioInput.value.trim()
    };

    // Add member to the list
    members.push(newMember);

    // Save and display members
    saveMembers();
    displayMembers();

    // Show success message
    successMsg.textContent =
        "Registration successful! Welcome, " + newMember.name + ".";

    successMsg.classList.remove("hidden");

    // Clear the form
    regForm.reset();
    clearErrors();
});

// Dark Mode button
theme.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const darkModeEnabled =
        document.body.classList.contains("dark-mode");

    themeBtn.textContent = darkModeEnabled
        ? "Light Mode"
        : "Dark Mode";

    localStorage.setItem(
        "webdevDarkMode",
        darkModeEnabled ? "enabled" : "disabled"
    );
});

// Restore the saved theme
if (localStorage.getItem("webdevDarkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "Light Mode";
}

// Show saved members when the page opens
displayMembers();