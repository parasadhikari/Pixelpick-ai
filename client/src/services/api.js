const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

export const getImageFromUrl = async (imageUrl) => {
    const response = await fetch(
        `${API_URL}/api/image?url=${encodeURIComponent(imageUrl)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load image from URL");
    }

    return response;
};