// Cache DOM elements in memory
var form   = document.getElementById('shorten-form');
var urlBox = form.elements[0];
var link   = document.getElementById('link');
var hash   = document.getElementById('hash');
var shrBox = document.getElementById('shortened');

function shortUrl(hash) {
  var baseUrl = 'http://shortio.herokuapp.com/';
  
  return baseUrl + hash;
} // End of URL assembly with the redir hash

function displayShortenedUrl(response) {
  hash.textContent = response.data.hash;
  
  link.setAttribute(
    'href', shortUrl(response.data.hash)
  ); // Set the link's href attribute
  
  shrBox.style.opacity = '1';
  urlBox.value = ''; // Reset input
} // End of function to update the view

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Send the POST request to the backend  
  axios.post('/new', { url: urlBox.value })
    .then(displayShortenedUrl)
    .catch(function(error) {
      // Handle server or validation errors
      alert('Are you sure the URL is correct?');
    });
});
