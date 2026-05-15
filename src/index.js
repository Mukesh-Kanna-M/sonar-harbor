const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Sonar Harbour CI/CD', status: 'running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
