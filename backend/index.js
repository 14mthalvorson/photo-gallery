const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const dotenv = require('dotenv');
const serverlessExpress = require('aws-serverless-express');

dotenv.config();

const app = express();
app.use(cors());

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.status(200).json({ imageUrl: req.file.location });
});

app.get('/images', async (req, res) => {
    try {
        const data = await s3
            .listObjectsV2({ Bucket: process.env.S3_BUCKET_NAME })
            .promise();
        const images = data.Contents.map((item) => ({
            key: item.Key,
            url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        }));
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.delete('/delete/:key', async (req, res) => {
    try {
        const key = req.params.key;
        await s3
            .deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: key })
            .promise();
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Add the following lines:
const server = serverlessExpress.createServer(app);
exports.handler = (event, context) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    serverlessExpress.proxy(server, event, context);
};