fetch('https://unsplash.com/napi/search/photos?query=iphone&per_page=1')
  .then(res => res.json())
  .then(data => console.log(data.results[0].urls.regular))
  .catch(err => console.log('Error:', err.message));
