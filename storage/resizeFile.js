const sharp = require('sharp')

const resizeUserPhoto = (async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${res.locals.jwt._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./fileUpload/storage/uploads${req.file.filename}`);
  next();
});

module.exports = resizeUserPhoto