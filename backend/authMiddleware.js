// backend/authMiddleware.js
const authenticate = (req, res, next) => {
    const { username, password } = req.body;
  
    if (username === 'admin' && password === 'admin123') {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  };
  
  module.exports = authenticate;
  