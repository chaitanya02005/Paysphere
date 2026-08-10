fetch('http://localhost:3000/api/seed')
  .then(res => res.json())
  .then(data => console.log('Seed Result:', data))
  .catch(err => console.error('Seed Error:', err));
