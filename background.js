// Listen for messages from content scripts
console.log('Loaded');
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SELECTED_TEXT') {
    console.log('Selected text from:', sender.url);
    console.log('Text:', message.text);

    fetch('http://localhost:9001/api/save-copy', {
      // Change to your local server URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ copiedContent: message.text }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Server response:', data))
      .catch((error) => console.error('Error:', error));
  }
});
