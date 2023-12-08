import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { uid } = req.params;
    let uploadPath = "";

    if (file.fieldname === "profileImage") {
      uploadPath = `uploads/${uid}/profiles`;
    } else if (file.fieldname === "productImage") {
      uploadPath = `uploads/${uid}/products`;
    } else if (file.fieldname === "document") {
      uploadPath = `uploads/${uid}/documents`;
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
