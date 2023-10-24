const http = require('http');

module.exports = async () => {
  try {
    const res = await http.get('http://localhost:3000/');
    return res.statusCode === 200;
  } catch (err) {
    return false;
  }
};
