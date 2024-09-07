// Multer configuration
import aws from "aws-sdk";
import multers3 from "multer-s3";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

aws.config.update({
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: process.env.region,
});

const myBucket = new aws.S3();

export const upload = multer({
  storage: multers3({
    s3: myBucket,
    acl: "public-read",
    bucket: "aprilfullstack",
    contentType: multers3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
