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
        <div className="min-h-screen">
            <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-white">
                Image Color Picker & Palette Generator
            </h1>

            <p
                className="
                    text-center
                    mt-3
                    text-gray-500
                    dark:text-gray-400
                    max-w-2xl
                    mx-auto
                "
            >
                PixelPick AI lets you extract colors from
                any image, pick exact HEX, RGB and HSL
                colors, and generate beautiful color palettes.
            </p>

            {!preview ? (
                <div className="mt-10">
                    <UploadBox
                        processFile={processFile}
                    />
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