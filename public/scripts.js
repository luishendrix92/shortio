var form   = document.getElementById('shorten-form');
var urlBox = form.elements[0];
var link   = document.getElementById('link');
var shrBox = document.getElementById('shortened');

function displayShortenedUrl(response) {
  link.textContent = response.data.shortUrl;
  link.setAttribute('href', response.data.shortUrl);
  shrBox.style.opacity = '1';
  urlBox.value = '';
}

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  axios.post('/new', { url: urlBox.value })
    .then(displayShortenedUrl)
    .catch(function(error) {
      console.log(error);
      alert('Are you sure the URL is correct? Make sure it has http(s)://.');
    });
});
