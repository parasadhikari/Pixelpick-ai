import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";
console.log("🔥 NEW UploadBox.jsx LOADED");

const UploadBox = () => {
    const {
        setImageFile,
        setImageUrl,
    } = useApp();

    const inputRef = useRef(null);

    const [mode, setMode] = useState("browse");
    const [imageLink, setImageLink] = useState("");
    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";
    // --------------------------------
    // HANDLE IMAGE
    // --------------------------------

    const handleFile = (file) => {
        if (!file) return;

        // Check file type
        if (!file.type.startsWith("image/")) {
            toast.error(
                "Invalid file. Please select an image."
            );
            return;
        }

        // 10 MB limit
        const MAX_SIZE = 10 * 1024 * 1024;

        if (file.size > MAX_SIZE) {
            toast.error(
                "Image is too large. Maximum size is 10 MB."
            );
            return;
        }

        setImageFile(file);

        const url = URL.createObjectURL(file);

        setImageUrl(url);

        toast.success("Image uploaded successfully");
    };


    const testImageUrl = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.crossOrigin = "anonymous";

            img.onload = () => {
                resolve(true);
            };

            img.onerror = () => {
                reject(
                    new Error(
                        "Image cannot be accessed by canvas"
                    )
                );
            };

            img.src = url;
        });
    };
    // --------------------------------
    // BROWSE
    // --------------------------------

    const handleChange = (e) => {
        const file = e.target.files?.[0];

        handleFile(file);

        e.target.value = "";
    };

    // --------------------------------
    // DRAG & DROP
    // --------------------------------

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];

        handleFile(file);
    };

    // --------------------------------
    // PASTE IMAGE
    // --------------------------------

    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;

            if (!items) return;

            for (const item of items) {
                if (!item.type.startsWith("image/")) {
                    continue;
                }

                const file = item.getAsFile();

                if (file) {
                    handleFile(file);
                    break;
                }
            }
        };

        window.addEventListener(
            "paste",
            handlePaste
        );

        return () => {
            window.removeEventListener(
                "paste",
                handlePaste
            );
        };
    }, []);

    // --------------------------------
    // IMAGE URL
    // --------------------------------

    const handleUrlSubmit = async () => {
        const url = imageLink.trim();

        if (!url) {
            toast.error(
                "Please enter an image URL"
            );
            return;
        }

        try {
            new URL(url);
        } catch {
            toast.error(
                "Please enter a valid URL"
            );
            return;
        }

        const loadingId = toast.loading(
            "Loading image..."
        );

        try {
            const proxyUrl =
                `${API_URL}/api/image?url=${encodeURIComponent(
                    url
                )}`;

            const response = await fetch(
                proxyUrl
            );

            if (!response.ok) {
                const error =
                    await response.json()
                        .catch(() => null);

                throw new Error(
                    error?.message ||
                    "Unable to load image"
                );
            }

            const blob =
                await response.blob();

            if (
                !blob.type.startsWith("image/")
            ) {
                throw new Error(
                    "URL did not return an image"
                );
            }

            const file = new File(
                [blob],
                "url-image",
                {
                    type: blob.type,
                }
            );

            const localUrl =
                URL.createObjectURL(blob);

            setImageFile(file);
            setImageUrl(localUrl);

            toast.success(
                "Image loaded successfully",
                {
                    id: loadingId,
                }
            );

        } catch (error) {
            console.error(error);

            toast.error(
                error.message ||
                "Could not load this image",
                {
                    id: loadingId,
                }
            );
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="
        w-full
        max-w-2xl
        mx-auto
       bg-white dark:bg-gray-900
        rounded-3xl
        shadow-xl
        border
        border-gray-200
        p-6
      "
        >

            {/* Heading */}

            <div className="text-center mb-6">

                <div className="text-5xl mb-3">
                    🖼️
                </div>

                <h2 className="text-2xl font-bold">
                    Add an Image
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Choose how you want to add your image
                </p>

            </div>


            {/* OPTIONS */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <button
                    onClick={() => setMode("browse")}
                    className={`
            py-3
            rounded-xl
            font-semibold
            transition-all
            ${mode === "browse"
                            ? "bg-blue-600 text-white shadow-md"
                            : `
                        bg-gray-100
                        dark:bg-gray-800
                        text-gray-700
                        dark:text-gray-200
                        hover:bg-gray-200
                        dark:hover:bg-gray-700
                    `
                        }
        `}
                >
                    📁 Browse
                </button>

                <button
                    onClick={() => setMode("url")}
                    className={`
            py-3
            rounded-xl
            font-semibold
            transition-all
            ${mode === "url"
                            ? "bg-blue-600 text-white shadow-md"
                            : `
                        bg-gray-100
                        dark:bg-gray-800
                        text-gray-700
                        dark:text-gray-200
                        hover:bg-gray-200
                        dark:hover:bg-gray-700
                    `
                        }
        `}
                >
                    🔗 URL
                </button>

                <button
                    onClick={() => setMode("paste")}
                    className={`
            py-3
            rounded-xl
            font-semibold
            transition-all
            ${mode === "paste"
                            ? "bg-blue-600 text-white shadow-md"
                            : `
                        bg-gray-100
                        dark:bg-gray-800
                        text-gray-700
                        dark:text-gray-200
                        hover:bg-gray-200
                        dark:hover:bg-gray-700
                    `
                        }
        `}
                >
                    📋 Paste
                </button>

                <button
                    onClick={() => setMode("drop")}
                    className={`
            py-3
            rounded-xl
            font-semibold
            transition-all
            ${mode === "drop"
                            ? "bg-blue-600 text-white shadow-md"
                            : `
                        bg-gray-100
                        dark:bg-gray-800
                        text-gray-700
                        dark:text-gray-200
                        hover:bg-gray-200
                        dark:hover:bg-gray-700
                    `
                        }
        `}
                >
                    🖱️ Drop
                </button>

            </div>









            {/* BROWSE */}

            {mode === "browse" && (
                <div
                    onClick={() =>
                        inputRef.current?.click()
                    }
                    className="
    border-2
    border-dashed
    border-gray-300
    dark:border-gray-600

    hover:border-blue-500

    rounded-2xl
    p-8
    text-center
    cursor-pointer
    transition

    bg-white
    dark:bg-gray-900

    hover:bg-blue-50
    dark:hover:bg-gray-800
"
                >

                    <p className="text-4xl mb-3">
                        📁
                    </p>

                    <p
                        className="
        font-semibold
        text-gray-900
        dark:text-white
    "
                    >
                        Click to browse
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        or drag & drop an image here
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();

                            inputRef.current?.click();
                        }}
                        className="
              mt-5
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
            "
                    >
                        Choose Image
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />

                </div>
            )}


            {/* URL */}

            {mode === "url" && (
                <div className="
          border
          border-gray-200
          rounded-2xl
          p-5
        ">

                    <p className="font-semibold mb-2">
                        🔗 Image URL
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Paste a direct link to an image.
                    </p>

                    <input
                        type="url"
                        value={imageLink}
                        onChange={(e) =>
                            setImageLink(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleUrlSubmit();
                            }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="
              w-full
              border
              border-gray-300 dark:border-gray-600
              rounded-xl
              px-4
              py-3
              text-sm
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                    />

                    <button
                        onClick={handleUrlSubmit}
                        className="
              w-full
              mt-3
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              font-semibold
            "
                    >
                        Use Image URL
                    </button>

                </div>
            )}


            {/* HELP */}

            <div className="
        mt-5
        text-center
        text-xs
        text-gray-400
      ">
                Supports JPG, PNG, WEBP and other browser-supported images.
            </div>

        </div>
    );
};

export default UploadBox;