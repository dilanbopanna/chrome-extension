document.addEventListener('DOMContentLoaded', function () {
  // Check if a username is already set
  chrome.storage.local.get('username', (data) => {
    if (data.username) {
      // If a username is set, show it in the h2 element
      document.getElementById(
        'usernameStatus'
      ).textContent = `Current Username: ${data.username}`;
      document.getElementById('usernameInput').style.display = 'none'; // Hide the input and button
    } else {
      // If no username is set, show the input field and button
      document.getElementById('usernameInput').style.display = 'block';
    }
  });

  document
    .getElementById('submitUsername')
    .addEventListener('click', function () {
      const username = document.getElementById('username').value.trim();
      if (!username) {
        alert('Please enter a username.');
        return;
      }

      // Check if username exists on the server
      fetch(
        `https://chrome-extension-jnx7.onrender.com/api/check-username?username=${username}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.exists) {
            alert('Username already taken. Please choose another.');
          } else {
            // Save username in chrome.storage.local
            chrome.storage.local.set({ username: username }, () => {
              alert(
                'Username set successfully! Now go to the web app and use the same username.'
              );

              // Update the displayed username
              document.getElementById(
                'usernameStatus'
              ).textContent = `Current Username: ${username}`;
              document.getElementById('usernameInput').style.display = 'none'; // Hide the input and button
              setTimeout(() => {
                window.close(); // Closes the current tab
              }, 3000);
            });
          }
        })
        .catch((error) => console.error('Error:', error));
    });
});
