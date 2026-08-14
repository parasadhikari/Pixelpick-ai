import { useEffect } from "react";

const SEO = ({
    title,
    description,
    canonical,
}) => {
    useEffect(() => {
        document.title = title;

        const setMeta = (name, content) => {
            let tag = document.querySelector(
                `meta[name="${name}"]`
            );

            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("name", name);
                document.head.appendChild(tag);
            }

            tag.setAttribute("content", content);
        };

        setMeta("description", description);

        let canonicalTag = document.querySelector(
            'link[rel="canonical"]'
        );

        if (!canonicalTag) {
            canonicalTag = document.createElement("link");
            canonicalTag.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalTag);
        }

        canonicalTag.setAttribute(
            "href",
            canonical
        );

        return () => {};
    }, [title, description, canonical]);

    return null;
};

export default SEO;