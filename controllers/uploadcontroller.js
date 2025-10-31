// controllers/uploadController.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto'); // Built-in Node.js module

// Generate a random string for the file name
const randomImageName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * @desc    Get a pre-signed URL for file upload
 * @route   POST /api/uploads/get-signed-url
 * @access  Private (must be logged in)
 */
const getSignedS3Url = async (req, res) => {
  // We'll get fileType from the client
  const { fileType } = req.body;
  if (!fileType) {
    return res.status(400).json({ message: 'fileType is required' });
  }

  // Generate a unique file name
  const fileExtension = fileType.split('/')[1]; // e.g., 'jpeg' or 'png'
  const fileName = `${randomImageName()}.${fileExtension}`;

  // Create the command to put an object
  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    // ACL: 'public-read', // Uncomment this if you want files to be public by default
  });

  try {
    // Generate the pre-signed URL
    const signedUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 60 * 5, // URL expires in 5 minutes
    });

    // The URL of the file after it's uploaded
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;

    res.status(200).json({
      uploadUrl: signedUrl, // The URL to PUT the file to
      finalUrl: fileUrl,   // The URL to save in MongoDB
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSignedS3Url,
};