import express from "express";
import dns from "dns/promises";
import net from "net";

const router = express.Router();

const MAX_SIZE = 10 * 1024 * 1024;

const isPrivateIP = (ip) => {
  if (net.isIP(ip) === 4) {
    const parts = ip.split(".").map(Number);

    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      parts[0] === 0 ||
      (parts[0] === 172 &&
        parts[1] >= 16 &&
        parts[1] <= 31) ||
      (parts[0] === 192 &&
        parts[1] === 168) ||
      (parts[0] === 169 &&
        parts[1] === 254)
    );
  }

  if (net.isIP(ip) === 6) {
    return (
      ip === "::1" ||
      ip.startsWith("fc") ||
      ip.startsWith("fd") ||
      ip.startsWith("fe80")
    );
  }

  return true;
};

const validateUrl = async (url) => {
  const parsed = new URL(url);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  const hostname = parsed.hostname;

  // Prevent obvious localhost access
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    throw new Error("Invalid image URL");
  }

  const addresses = await dns.lookup(hostname, {
    all: true,
  });

  for (const address of addresses) {
    if (isPrivateIP(address.address)) {
      throw new Error("Invalid image host");
    }
  }

  return parsed;
};

router.get("/image", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        message: "Image URL is required",
      });
    }

    const parsedUrl = await validateUrl(url);

    const response = await fetch(parsedUrl.href, {
      redirect: "manual",
      headers: {
        "User-Agent":
          "PixelPick-AI/1.0",
        Accept:
          "image/avif,image/webp,image/jpeg,image/png,image/*",
      },
    });

    // Handle redirects safely
    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location =
        response.headers.get("location");

      if (!location) {
        return res.status(400).json({
          message: "Invalid image redirect",
        });
      }

      const redirectUrl = new URL(
        location,
        parsedUrl.href
      );

      await validateUrl(
        redirectUrl.href
      );

      return res.status(400).json({
        message:
          "Redirected image URLs are not supported. Use the final image URL.",
      });
    }

    if (!response.ok) {
      return res.status(400).json({
        message:
          "Unable to download this image",
      });
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (!contentType.startsWith("image/")) {
      return res.status(400).json({
        message:
          "The URL does not point to an image",
      });
    }

    const contentLength =
      response.headers.get(
        "content-length"
      );

    if (
      contentLength &&
      Number(contentLength) > MAX_SIZE
    ) {
      return res.status(413).json({
        message:
          "Image is larger than 10 MB",
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    if (buffer.length > MAX_SIZE) {
      return res.status(413).json({
        message:
          "Image is larger than 10 MB",
      });
    }

    res.set({
      "Content-Type": contentType,
      "Content-Length": buffer.length,
      "Cache-Control":
        "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    });

    res.send(buffer);

  } catch (error) {
    console.error(
      "Image proxy error:",
      error.message
    );

    res.status(400).json({
      message:
        "Could not load this image URL",
    });
  }
});

export default router;