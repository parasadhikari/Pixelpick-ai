import { useEffect } from "react";

const SEO = ({
    title,
    description,
    canonical,
}) => {
    useEffect(() => {
        // ==============================
        // Basic SEO
        // ==============================

        document.title = title;

        const setMeta = (
            attribute,
            value,
            content
        ) => {
            let tag = document.querySelector(
                `meta[${attribute}="${value}"]`
            );

            if (!tag) {
                tag = document.createElement("meta");

                tag.setAttribute(
                    attribute,
                    value
                );

                document.head.appendChild(tag);
            }

            tag.setAttribute(
                "content",
                content
            );
        };

        // Meta description
        setMeta(
            "name",
            "description",
            description
        );


        // ==============================
        // Canonical URL
        // ==============================

        let canonicalTag =
            document.querySelector(
                'link[rel="canonical"]'
            );

        if (!canonicalTag) {
            canonicalTag =
                document.createElement(
                    "link"
                );

            canonicalTag.setAttribute(
                "rel",
                "canonical"
            );

            document.head.appendChild(
                canonicalTag
            );
        }

        canonicalTag.setAttribute(
            "href",
            canonical
        );


        // ==============================
        // Open Graph
        // ==============================

        setMeta(
            "property",
            "og:type",
            "website"
        );

        setMeta(
            "property",
            "og:url",
            canonical
        );

        setMeta(
            "property",
            "og:title",
            title
        );

        setMeta(
            "property",
            "og:description",
            description
        );

        setMeta(
            "property",
            "og:site_name",
            "PixelPick AI"
        );


        // ==============================
        // Twitter / X
        // ==============================

        setMeta(
            "name",
            "twitter:card",
            "summary"
        );

        setMeta(
            "name",
            "twitter:title",
            title
        );

        setMeta(
            "name",
            "twitter:description",
            description
        );

    }, [
        title,
        description,
        canonical,
    ]);

    return null;
};

export default SEO;