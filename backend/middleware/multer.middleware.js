import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG and PNG files are allowed'), false);
    }
    cb(null, true);
  },
});

export const handlefileUpload = (fieldName) =>{
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err)=>{
      if(err) return res.status(400).json({message: err.message});
      next();
    })
  }
}
