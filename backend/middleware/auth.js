import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
export const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // For development, temporarily allow all authenticated users to access admin routes
    // Remove this in production and use proper role checks
    if (process.env.NODE_ENV === 'development') {
      req.user = decoded.user;
      return next();
    }
    
    // Check if user is admin
    if (!decoded.user || decoded.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Admin auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 