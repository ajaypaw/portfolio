import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // Check if user is admin
    if (decoded.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 