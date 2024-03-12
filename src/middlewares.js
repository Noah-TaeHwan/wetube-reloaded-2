import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: 'wetube-ai',
  acl: 'public-read',
  key: function (request, file, ab_callback) {
    const newFileName = Date.now() + '-' + file.originalname;
    const fullPath = 'images/' + newFileName;
    ab_callback(null, fullPath);
  },
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: 'wetube-ai',
  acl: 'public-read',
  key: function (request, file, ab_callback) {
    const newFileName = Date.now() + '-' + file.originalname;
    const fullPath = 'videos/' + newFileName;
    ab_callback(null, fullPath);
  },
});

//... localsMiddleware, protectorMiddleware, publicOnlyMiddleware ... //

export const avatarUpload = multer({
  dest: 'uploads/avatars/',
  limits: {
    fileSize: 3 * 1000 * 1000, //3 megabyte
  },
  storage: s3ImageUploader,
});

export const videoUpload = multer({
  dest: 'uploads/videos/',
  limits: {
    fileSize: 10 * 1000 * 1000, //10 megabyte
  },
  storage: s3VideoUploader,
});
