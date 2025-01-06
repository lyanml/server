const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // 使用环境变量中的端口，或者默认3000

// 配置上传目录
const uploadDir = path.join(__dirname, 'uploads');
ensureDirectoryExists(uploadDir);

// 设置存储引擎
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 初始化上传中间件，并设置文件大小限制为50MB
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// 处理文件上传的路由
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '没有文件被上传。' });
    }
    const imageUrl = `/uploads/${req.file.filename}`; // 假设你的前端可以通过这个URL访问上传的图片
    res.status(200).json({ message: '文件上传成功！', imageUrl }); // 返回上传成功的提示信息和图片URL给前端
});

// 错误处理中间件，处理文件大小超过限制的情况
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: '文件大小超过限制。' });
        }
    }
    next(err);
});

// 提供静态文件服务，允许前端访问上传的图片
app.use('/uploads', express.static(uploadDir));

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在端口 ${port} 上运行`);
});

// 确保目录存在的函数
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}
