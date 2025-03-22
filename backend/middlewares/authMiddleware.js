const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded; 

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn đăng nhập' });
    }
};

module.exports = { authenticateJWT };
