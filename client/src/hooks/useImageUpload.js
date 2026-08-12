import { useApp } from "../context/AppContext";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const useImageUpload = () => {
  const {
    imageFile,
    imageUrl,
    setImageFile,
    setImageUrl,
    clearAll,
  } = useApp();

  const processFile = (file) => {
    if (!file) {
      return {
        success: false,
        message: "No file selected.",
      };
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        success: false,
        message: "Only PNG, JPG and WEBP are allowed.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: "Maximum size is 10MB.",
      };
    }

    const url = URL.createObjectURL(file);

    setImageFile(file);
    setImageUrl(url);

    return {
      success: true,
      message: "Image uploaded successfully.",
    };
  };

  return {
    image: imageFile,
    preview: imageUrl,
    processFile,
    removeImage: clearAll,
  };
};

export default useImageUpload;