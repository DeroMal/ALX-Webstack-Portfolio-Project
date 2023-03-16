// Fetch the content for the content element from a separate file
fetch('/parts/float_settings.html')
  .then(response => {
    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the response as HTML
    return response.text();
  })
  .then(html => {
    // Insert the HTML into the content element
    document.getElementById('float_settings').innerHTML = html;
  })
  .catch(error => {
    console.error('There was a problem fetching the content:', error);
  });
