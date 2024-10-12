document.getElementById('discountForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Generate a random discount code
    const discountCode = 'DISC-'
    // Send the data to the backend
    const response = await fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, discountCode }),
    });

    const result = await response.json();

    // Show confirmation message
    const message = result.success ?
        `Success! Your discount code is ${discountCode}. Check your email.` :
        `Error: ${result.message}`;
    document.getElementById('responseMessage').textContent = message;
});