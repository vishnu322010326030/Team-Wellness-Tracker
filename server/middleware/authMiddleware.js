const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// HR only middleware
const hrOnly = (req, res, next) => {
  if (req.user.role !== 'hr') {
    return res.status(403).json({ message: 'Access denied — HR only' });
  }
  next();
};

module.exports = { protect, hrOnly };