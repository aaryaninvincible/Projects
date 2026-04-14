document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value.trim();

            if (username === '' || password === '') {
                alert('Please enter both username and password.');
                return;
            }

            if (localStorage.getItem(username)) {
                alert('Username already exists. Please choose a different username.');
                return;
            }

            localStorage.setItem(username, password);
            alert('Registration successful! You can now log in.');
            window.location.href = 'index.html';
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (username === '' || password === '') {
                alert('Please enter both username and password.');
                return;
            }

            const storedPassword = localStorage.getItem(username);
            if (storedPassword && storedPassword === password) {
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = 'secured.html';
            } else {
                alert('Password is wrong. Please try again.');
            }
        });
    }
});
