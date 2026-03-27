const axios = require("axios");
const crypto = require("crypto");

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  if (cloudName === "your-cloud-name") {
    throw new Error("Cloudinary cloud name is still set to the placeholder 'your-cloud-name'. Update CLOUDINARY_CLOUD_NAME in server/.env.");
  }

  return { cloudName, apiKey, apiSecret };
};

const uploadComplaintImage = async (image, ticketId) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || "nagrik-ai/complaints";
  const publicId = `${ticketId || "complaint"}-${Date.now()}`;

  const signatureBase = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  const payload = new URLSearchParams({
    file: image,
    api_key: apiKey,
    timestamp: String(timestamp),
    folder,
    public_id: publicId,
    signature,
  });

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const { data } = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    maxBodyLength: Infinity,
  });

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};

module.exports = {
  uploadComplaintImage,
};
