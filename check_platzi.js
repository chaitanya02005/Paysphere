fetch('https://api.escuelajs.co/api/v1/products')
  .then(res => res.json())
  .then(data => {
      for(let i=0; i<10; i++) {
          console.log(data[i].title, '->', data[i].images[0]);
      }
  });
