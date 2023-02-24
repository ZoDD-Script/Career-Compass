const cloudinary = require("./cloudinary");

const fileupload = async (req, res, next) => {
  try {
    const result = await cloudinary.uploadFile(req.file.buffer, 'Media');
    req.url = result.secure_url
    next()
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = fileupload