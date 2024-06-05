document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Realizar una solicitud de inicio de sesión
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Inicio de sesión exitoso');
                    // Redireccionar a otra página o realizar alguna acción
                } else {
                    alert('Usuario o contraseña incorrectos');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
