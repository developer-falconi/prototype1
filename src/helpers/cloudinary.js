import { Cloudinary } from "@cloudinary/url-gen";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.REACT_APP_CLOUD_NAME,
    apiKey: process.env.REACT_APP_API_KEY,
    apiSecret: process.env.REACT_APP_API_SECRET,
  },
});

export const cloudinaryImg = (image_url) => {
  const img = cloudinary.image(image_url);
  img.quality(100);
  return img;
};
