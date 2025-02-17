// Listen for messages from content scripts
console.log('Loaded');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SELECTED_TEXT') {
    console.log('Selected text from:', sender.url);
    console.log('Text:', message.text);

    // Retrieve username from storage
    chrome.storage.local.get('username', (data) => {
      const username = data.username;

      // Check if username is available
      if (!username) {
        return;
      }

      // Now, make the API call with the username and copied content
      fetch('https://chrome-extension-jnx7.onrender.com/api/save-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Send the username here
          copiedContent: message.text,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log('Server response:', data))
        .catch((error) => console.error('Error:', error));
    });
  }
});

// Check for username when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('username', (data) => {
    if (!data.username) {
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 500,
        height: 800,
      });
    }
  });
});
