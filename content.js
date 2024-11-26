let lastSelectedText = ''; // Variable to store the previous selected text

// Add a listener for mouseup events to detect when the selection is complete
document.addEventListener('mouseup', () => {
  handleSelection();
});

// Add a listener for touchend events to handle touch-based selections (mobile devices)
document.addEventListener('touchend', () => {
  handleSelection();
});

function handleSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // Check if the selected text is non-empty and different from the previous selection
  if (selectedText && selectedText !== lastSelectedText) {
    lastSelectedText = selectedText;

    chrome.runtime.sendMessage({ type: 'SELECTED_TEXT', text: selectedText });
  }
}
