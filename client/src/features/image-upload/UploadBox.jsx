import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";

const UploadBox = () => {
    const {
        setImageFile,
        setImageUrl,
    } = useApp();

    const inputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [mode, setMode] = useState("browse");
    const [imageLink, setImageLink] = useState("");
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraStarting, setCameraStarting] = useState(false);
    const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

    // ==========================================
    // HANDLE IMAGE
    // ==========================================

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

        toast.success(
            "Image uploaded successfully"
        );
    };

    // ==========================================
    // BROWSE
    // ==========================================

    const handleChange = (e) => {
        const file = e.target.files?.[0];

        handleFile(file);

        // Allow selecting the same file again
        e.target.value = "";
    };

    const openFilePicker = () => {
        inputRef.current?.click();
    };

    // ==========================================
    // DRAG & DROP
    // ==========================================

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

    // ==========================================
    // PASTE IMAGE
    // ==========================================

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

    // ==========================================
    // IMAGE URL
    // ==========================================

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
                    await response
                        .json()
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

    // ==========================================
    // CAMERA
    // ==========================================

    const stopCamera = () => {
        const stream = streamRef.current;

        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
        }

        setCameraReady(false);
        setCameraStarting(false);
    };

    const startCamera = async () => {
        // Stop any previous stream
        stopCamera();

        // Check browser support
        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {
            toast.error(
                "Camera is not supported by this browser."
            );
            return;
        }

        // Camera requires HTTPS or localhost
        if (!window.isSecureContext) {
            toast.error(
                "Camera requires a secure HTTPS connection."
            );
            return;
        }

        try {
            setCameraStarting(true);

            // ------------------------------------------
            // CAMERA CONSTRAINTS
            // ------------------------------------------

            const isMobile =
                /Android|iPhone|iPad|iPod/i.test(
                    navigator.userAgent
                );

            const constraints = {
                audio: false,

                video: isMobile
                    ? {
                        facingMode: {
                            ideal: "environment",
                        },

                        width: {
                            ideal: 1920,
                        },

                        height: {
                            ideal: 1080,
                        },
                    }
                    : {
                        width: {
                            ideal: 1920,
                        },

                        height: {
                            ideal: 1080,
                        },
                    },
            };

            // ------------------------------------------
            // REQUEST CAMERA
            // ------------------------------------------

            let stream;

            try {
                stream =
                    await navigator.mediaDevices.getUserMedia(
                        constraints
                    );
            } catch (error) {
                console.warn(
                    "Preferred camera settings failed:",
                    error
                );

                // Fallback to basic camera
                stream =
                    await navigator.mediaDevices.getUserMedia(
                        {
                            video: true,
                            audio: false,
                        }
                    );
            }

            streamRef.current = stream;

            // React has now been told that camera is starting.
            // The video element will be rendered because
            // cameraStarting === true.
            const video = videoRef.current;

            if (!video) {
                // Give React one more chance to render the video.
                await new Promise((resolve) =>
                    setTimeout(resolve, 100)
                );
            }

            const currentVideo = videoRef.current;

            if (!currentVideo) {
                stream
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );

                streamRef.current = null;

                throw new Error(
                    "Camera preview could not be initialized."
                );
            }

            // ------------------------------------------
            // ATTACH STREAM
            // ------------------------------------------

            currentVideo.srcObject = stream;

            currentVideo.muted = true;
            currentVideo.autoplay = true;
            currentVideo.playsInline = true;

            // ------------------------------------------
            // WAIT FOR VIDEO METADATA
            // ------------------------------------------

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(
                        new Error(
                            "Camera took too long to start."
                        )
                    );
                }, 10000);

                const handleReady = () => {
                    clearTimeout(timeout);

                    video.removeEventListener(
                        "loadedmetadata",
                        handleReady
                    );

                    resolve();
                };

                currentVideo.addEventListener(
                    "loadedmetadata",
                    handleReady
                );
                // Some browsers may already have metadata
                if (
                    currentVideo.readyState >= 1 &&
                    currentVideo.videoWidth > 0
                ) {
                    handleReady();
                }
            });

            // ------------------------------------------
            // START VIDEO
            // ------------------------------------------

            await currentVideo.play();

            // ------------------------------------------
            // VERIFY CAMERA
            // ------------------------------------------

            if (
                currentVideo.videoWidth === 0 ||
                currentVideo.videoHeight === 0
            ) {
                throw new Error(
                    "Camera started but no video frame is available."
                );
            }

            setCameraReady(true);
            setCameraStarting(false);

            toast.success(
                "Camera ready"
            );

        } catch (error) {
            console.error(
                "Camera error:",
                error
            );

            stopCamera();

            setCameraStarting(false);

            if (
                error.name ===
                "NotAllowedError"
            ) {
                toast.error(
                    "Camera permission was denied. Allow camera access in your browser settings and try again."
                );
            } else if (
                error.name ===
                "NotFoundError"
            ) {
                toast.error(
                    "No camera was found on this device."
                );
            } else if (
                error.name ===
                "NotReadableError"
            ) {
                toast.error(
                    "The camera is already being used by another application."
                );
            } else if (
                error.name ===
                "SecurityError"
            ) {
                toast.error(
                    "Camera access was blocked by browser security settings."
                );
            } else {
                toast.error(
                    error.message ||
                    "Unable to start the camera."
                );
            }
        }
    };

    const capturePhoto = async () => {
        const video = videoRef.current;

        if (
            !video ||
            !cameraReady ||
            !video.videoWidth ||
            !video.videoHeight
        ) {
            toast.error(
                "Please wait until the camera preview is ready."
            );

            return;
        }

        try {
            const canvas =
                document.createElement(
                    "canvas"
                );

            const width =
                video.videoWidth;

            const height =
                video.videoHeight;

            canvas.width = width;
            canvas.height = height;

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {
                throw new Error(
                    "Could not create image canvas."
                );
            }

            // ------------------------------------------
            // CAPTURE FRAME
            // ------------------------------------------

            ctx.drawImage(
                video,
                0,
                0,
                width,
                height
            );

            // ------------------------------------------
            // CONVERT TO IMAGE
            // ------------------------------------------

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        toast.error(
                            "Could not capture photo."
                        );

                        return;
                    }

                    const file = new File(
                        [blob],
                        "pixelpick-camera.jpg",
                        {
                            type: "image/jpeg",
                            lastModified:
                                Date.now(),
                        }
                    );

                    // Stop camera first
                    stopCamera();

                    // Send captured image
                    // through existing upload pipeline
                    handleFile(file);
                },
                "image/jpeg",
                0.92
            );

        } catch (error) {
            console.error(
                "Capture error:",
                error
            );

            toast.error(
                "Could not capture photo."
            );
        }
    };

























    // ==========================================
    // CLEANUP CAMERA
    // ==========================================

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }
        };
    }, []);

    // ==========================================
    // CHANGE MODE
    // ==========================================

    const changeMode = (newMode) => {
        if (newMode !== "camera") {
            stopCamera();
        }

        setMode(newMode);
    };

    // ==========================================
    // OPTION BUTTON
    // ==========================================

    const optionClass = (option) => `
        w-full
        min-h-[64px]
        px-4
        py-3
        rounded-2xl
        font-semibold
        text-sm
        sm:text-base
        flex
        items-center
        justify-center
        gap-2
        transition-all
        duration-200
        border
        ${mode === option
            ? `
                    bg-blue-600
                    text-white
                    border-blue-600
                    shadow-md
                    scale-[1.01]
                  `
            : `
                    bg-gray-100
                    dark:bg-gray-800
                    text-gray-700
                    dark:text-gray-200
                    border-gray-200
                    dark:border-gray-700
                    hover:bg-gray-200
                    dark:hover:bg-gray-700
                    hover:border-gray-300
                    dark:hover:border-gray-600
                  `
        }
    `;

    // ==========================================
    // UI
    // ==========================================

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="
                w-full
                max-w-4xl
                mx-auto
                bg-white
                dark:bg-gray-900
                rounded-3xl
                shadow-xl
                border
                border-gray-200
                dark:border-gray-700
                p-5
                sm:p-6
                md:p-8
                transition-colors
                duration-300
            "
        >

            {/* ======================================
                HEADING
            ====================================== */}

            <div className="text-center mb-7">

                <div className="text-5xl mb-3">
                    🖼️
                </div>

                <h2
                    className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-gray-900
                        dark:text-white
                    "
                >
                    Add an Image
                </h2>

                <p
                    className="
                        text-sm
                        sm:text-base
                        text-gray-500
                        dark:text-gray-400
                        mt-2
                    "
                >
                    Choose how you want to add your image
                </p>

            </div>


            {/* ======================================
                UPLOAD OPTIONS
            ====================================== */}

            <div
                className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-5
                    gap-3
                "
            >

                {/* Browse */}

                <button
                    type="button"
                    onClick={() => {
                        changeMode("browse");
                        setTimeout(
                            openFilePicker,
                            0
                        );
                    }}
                    className={optionClass("browse")}
                >
                    <span className="text-xl">
                        📁
                    </span>

                    <span>
                        Browse
                    </span>
                </button>


                {/* Camera */}

                <button
                    type="button"
                    onClick={() => {
                        changeMode("camera");
                    }}
                    className={optionClass("camera")}
                >
                    <span className="text-xl">
                        📷
                    </span>

                    <span>
                        Camera
                    </span>
                </button>


                {/* URL */}

                <button
                    type="button"
                    onClick={() =>
                        changeMode("url")
                    }
                    className={optionClass("url")}
                >
                    <span className="text-xl">
                        🔗
                    </span>

                    <span>
                        URL
                    </span>
                </button>


                {/* Paste */}

                <button
                    type="button"
                    onClick={() =>
                        changeMode("paste")
                    }
                    className={optionClass("paste")}
                >
                    <span className="text-xl">
                        📋
                    </span>

                    <span>
                        Paste
                    </span>
                </button>


                {/* Drop */}

                <button
                    type="button"
                    onClick={() =>
                        changeMode("drop")
                    }
                    className={optionClass("drop")}
                >
                    <span className="text-xl">
                        🖱️
                    </span>

                    <span>
                        Drop
                    </span>
                </button>

            </div>


            {/* Hidden file input */}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />


            {/* ======================================
                BROWSE
            ====================================== */}

            {mode === "browse" && (
                <div
                    onClick={openFilePicker}
                    className="
                        mt-5
                        border-2
                        border-dashed
                        border-gray-300
                        dark:border-gray-600
                        hover:border-blue-500
                        dark:hover:border-blue-500
                        rounded-2xl
                        p-8
                        sm:p-12
                        text-center
                        cursor-pointer
                        transition-all
                        duration-200
                        bg-gray-50
                        dark:bg-gray-800/50
                        hover:bg-blue-50
                        dark:hover:bg-gray-800
                    "
                >

                    <div className="text-5xl mb-4">
                        📁
                    </div>

                    <p
                        className="
                            text-lg
                            sm:text-xl
                            font-semibold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Click to browse
                    </p>

                    <p
                        className="
                            text-sm
                            sm:text-base
                            text-gray-500
                            dark:text-gray-400
                            mt-2
                        "
                    >
                        or drag & drop an image here
                    </p>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            openFilePicker();
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
                            transition
                        "
                    >
                        Choose Image
                    </button>

                </div>
            )}


            {/* ======================================
                CAMERA
            ====================================== */}

            {mode === "camera" && (
                <div
                    className="
            mt-5
            rounded-2xl
            border
            border-gray-200
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800/50
            p-4
            sm:p-5
        "
                >

                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <h3 className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-white
                ">
                                📷 Take a Photo
                            </h3>

                            <p className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mt-1
                ">
                                Use your camera to capture an image.
                            </p>
                        </div>

                    </div>


                    {/* CAMERA PREVIEW */}

                    <div
                        className="
                relative
                w-full
                min-h-[250px]
                rounded-2xl
                overflow-hidden
                bg-black
                flex
                items-center
                justify-center
            "
                    >

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="
                    w-full
                    max-h-[450px]
                    rounded-2xl
                    object-contain
                    bg-black
                "
                        />

                        {!cameraReady && (
                            <div
                                className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                        bg-gray-100
                        dark:bg-gray-800
                    "
                            >

                                <div className="text-5xl mb-4">
                                    📷
                                </div>

                                <p className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                        mb-4
                    ">
                                    {cameraStarting
                                        ? "Starting camera..."
                                        : "Camera is ready to start."}
                                </p>

                                {!cameraStarting && (
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-6
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                            "
                                    >
                                        📷 Start Camera
                                    </button>
                                )}

                            </div>
                        )}

                    </div>


                    {/* CAMERA CONTROLS */}

                    {cameraReady && (
                        <div
                            className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                    mt-4
                "
                        >

                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                            >
                                📸 Capture Photo
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    changeMode("browse")
                                }
                                className="
                        bg-gray-100
                        dark:bg-gray-700
                        hover:bg-gray-200
                        dark:hover:bg-gray-600
                        text-gray-800
                        dark:text-white
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                            >
                                Cancel
                            </button>

                        </div>
                    )}

                </div>
            )}

            {/* ======================================
                URL
            ====================================== */}

            {mode === "url" && (
                <div
                    className="
                        mt-5
                        border
                        border-gray-200
                        dark:border-gray-700
                        rounded-2xl
                        p-5
                        bg-gray-50
                        dark:bg-gray-800/50
                    "
                >

                    <h3
                        className="
                            font-semibold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        🔗 Image URL
                    </h3>

                    <p
                        className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            mt-1
                            mb-4
                        "
                    >
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
                            border-gray-300
                            dark:border-gray-600
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
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
                        type="button"
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
                            transition
                        "
                    >
                        Use Image URL
                    </button>

                </div>
            )}


            {/* ======================================
                PASTE
            ====================================== */}

            {mode === "paste" && (
                <div
                    className="
                        mt-5
                        border-2
                        border-dashed
                        border-gray-300
                        dark:border-gray-600
                        rounded-2xl
                        p-8
                        text-center
                        bg-gray-50
                        dark:bg-gray-800/50
                    "
                >

                    <div className="text-5xl mb-4">
                        📋
                    </div>

                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Paste an Image
                    </h3>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                            mt-2
                        "
                    >
                        Copy an image and press
                        <span className="font-semibold">
                            {" "}Ctrl + V
                        </span>
                        {" "}anywhere on this page.
                    </p>

                </div>
            )}


            {/* ======================================
                DROP
            ====================================== */}

            {mode === "drop" && (
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="
                        mt-5
                        border-2
                        border-dashed
                        border-blue-400
                        dark:border-blue-500
                        rounded-2xl
                        p-8
                        sm:p-12
                        text-center
                        bg-blue-50
                        dark:bg-blue-950/20
                        transition
                    "
                >

                    <div className="text-5xl mb-4">
                        🖱️
                    </div>

                    <h3
                        className="
                            text-lg
                            sm:text-xl
                            font-semibold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Drop your image here
                    </h3>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            dark:text-gray-400
                            mt-2
                        "
                    >
                        Drag and drop an image anywhere inside this area.
                    </p>

                </div>
            )}


            {/* ======================================
                HELP
            ====================================== */}

            <div
                className="
                    mt-5
                    text-center
                    text-xs
                    sm:text-sm
                    text-gray-400
                "
            >
                Supports JPG, PNG, WEBP and other
                browser-supported images.
            </div>

        </div>
    );
};

export default UploadBox;