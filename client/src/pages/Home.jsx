import UploadBox from "../features/image-upload/UploadBox";
import ImagePreview from "../features/image-upload/ImagePreview";
import useImageUpload from "../hooks/useImageUpload";

const Home = () => {
  const {
    preview,
    processFile,
    removeImage,
  } = useImageUpload();

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-5xl font-bold text-center">
        PixelPick AI
      </h1>

      <p className="text-center mt-3 text-gray-500">
        Extract colors from any image instantly.
      </p>

      {!preview ? (
        <div className="mt-10">
          <UploadBox processFile={processFile} />
        </div>
      ) : (
        <ImagePreview
          preview={preview}
          removeImage={removeImage}
        />
      )}
    </div>
  );
};

export default Home;