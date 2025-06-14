// const jwt = require('jsonwebtoken')

// exports.identifier = (req, res, next) => {
// 	let token;

// 	if (req.headers.client === 'not-browser') {
// 		// token from mobile or Postman
// 		const authHeader = req.headers.authorization;
// 		if (authHeader && authHeader.startsWith('Bearer ')) {
// 			token = authHeader.split(' ')[1];
// 		}
// 	} else {
// 		// token from cookie
// 		token = req.cookies.token || (req.cookies.Authorization && req.cookies.Authorization.split(' ')[1]);
// 	}

// 	if (!token) {
// 		return res.status(403).json({ success: false, message: 'Unauthorized: No token provided' });
// 	}

// 	try {
// 		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
// 		req.user = decoded;
// 		next();
// 	} catch (err) {
// 		console.error('Token verification error:', err);
// 		return res.status(401).json({ success: false, message: 'Invalid or expired token' });
// 	}
// };
