import UploadBox from "../features/image-upload/UploadBox";
import ImagePreview from "../features/image-upload/ImagePreview";
import useImageUpload from "../hooks/useImageUpload";
import SEO from "../components/SEO";

const Home = () => {
    const {
        preview,
        processFile,
        removeImage,
    } = useImageUpload();

    return (
        <div className="min-h-screen">

            <SEO
                title="Image Color Picker & Palette Generator | PixelPick AI"
                description="Extract colors from images with PixelPick AI. Pick exact HEX, RGB and HSL colors, generate color palettes, check contrast, create gradients and export palettes."
                canonical="https://pixelpick-ai.vercel.app/"
            />
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
            {/* SEO / Helpful Content */}
            <section
                className="
        mt-16
        max-w-5xl
        mx-auto
        px-4
        pb-16
        text-gray-700
        dark:text-gray-300
    "
            >
                <div className="space-y-10">

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            What is an Image Color Picker?
                        </h2>

                        <p className="leading-7">
                            PixelPick AI is an online image color picker that
                            helps you identify colors directly from an image.
                            Upload an image, select any point, and get its
                            HEX, RGB and HSL color values.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Extract a Color Palette from an Image
                        </h2>

                        <p className="leading-7">
                            Generate a color palette from the colors found in
                            your image. PixelPick AI identifies dominant colors
                            and their approximate coverage, making it easier to
                            find matching colors for websites, UI designs,
                            graphics and other creative projects.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            PixelPick AI Features
                        </h2>

                        <ul className="grid sm:grid-cols-2 gap-3">
                            <li>✓ Pick colors directly from images</li>
                            <li>✓ HEX, RGB and HSL color values</li>
                            <li>✓ Automatic color palette extraction</li>
                            <li>✓ Color names and color coverage</li>
                            <li>✓ Contrast checking</li>
                            <li>✓ Gradient generation</li>
                            <li>✓ Find similar colors</li>
                            <li>✓ CSS, JSON and PDF palette export</li>
                        </ul>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;