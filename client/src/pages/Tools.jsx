import { Link } from "react-router-dom";
import {
    Pipette,
    Palette,
    Contrast,
    Paintbrush,
    Search,
    Download,
} from "lucide-react";
import SEO from "../components/SEO";

const tools = [
    {
        icon: Pipette,
        title: "Image Color Picker",
        description:
            "Pick colors directly from an image and get accurate HEX, RGB and HSL values.",
    },
    {
        icon: Palette,
        title: "Color Palette Generator",
        description:
            "Extract dominant colors from an image and generate a useful color palette.",
    },
    {
        icon: Contrast,
        title: "Contrast Checker",
        description:
            "Check the contrast between colors to help create more readable designs.",
    },
    {
        icon: Paintbrush,
        title: "Gradient Generator",
        description:
            "Create gradients based on colors extracted from your image.",
    },
    {
        icon: Search,
        title: "Find Similar Colors",
        description:
            "Explore colors that are visually similar to the color you selected.",
    },
    {
        icon: Download,
        title: "Palette Export",
        description:
            "Export your extracted palette as CSS, JSON or PDF.",
    },
];

const Tools = () => {
    return (
        <div
            className="
                min-h-screen
                py-12
                px-5
                text-gray-900
                dark:text-gray-100
            "
        >
            <SEO
                title="Color Tools | PixelPick AI"
                description="Explore PixelPick AI color tools including image color picking, palette generation, contrast checking, gradients, similar colors and palette export."
                canonical="https://pixelpick-ai.vercel.app/tools"
            />
            <div className="max-w-6xl mx-auto">

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto">

                    <h1
                        className="
                            text-4xl
                            sm:text-5xl
                            font-bold
                            mb-5
                        "
                    >
                        PixelPick AI Color Tools
                    </h1>

                    <p
                        className="
                            text-lg
                            leading-8
                            text-gray-600
                            dark:text-gray-300
                        "
                    >
                        Explore a collection of image color tools
                        for picking colors, generating palettes,
                        checking contrast, creating gradients and
                        exporting your color combinations.
                    </p>

                    <Link
                        to="/"
                        className="
                            inline-block
                            mt-7
                            px-7
                            py-3
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            transition
                        "
                    >
                        Start Using the Color Picker
                    </Link>

                </div>


                {/* Tools */}
                <section className="mt-14">

                    <h2
                        className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-center
                            mb-8
                        "
                    >
                        Available Color Tools
                    </h2>


                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-5
                        "
                    >

                        {tools.map((tool) => {

                            const Icon = tool.icon;

                            return (
                                <div
                                    key={tool.title}
                                    className="
                                        p-6
                                        rounded-2xl
                                        bg-white
                                        dark:bg-gray-900
                                        border
                                        border-gray-200
                                        dark:border-gray-800
                                        shadow-sm
                                        hover:shadow-lg
                                        transition
                                    "
                                >

                                    <div
                                        className="
                                            w-12
                                            h-12
                                            rounded-xl
                                            flex
                                            items-center
                                            justify-center
                                            bg-blue-100
                                            dark:bg-blue-900/30
                                            text-blue-600
                                            dark:text-blue-400
                                            mb-4
                                        "
                                    >
                                        <Icon size={24} />
                                    </div>


                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            mb-2
                                        "
                                    >
                                        {tool.title}
                                    </h3>


                                    <p
                                        className="
                                            leading-7
                                            text-gray-600
                                            dark:text-gray-400
                                        "
                                    >
                                        {tool.description}
                                    </p>

                                </div>
                            );

                        })}

                    </div>

                </section>


                {/* How it works */}
                <section className="mt-16">

                    <h2
                        className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-center
                            mb-8
                        "
                    >
                        How PixelPick AI Works
                    </h2>


                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-6
                        "
                    >

                        <div className="text-center">

                            <div
                                className="
                                    text-3xl
                                    font-bold
                                    mb-3
                                "
                            >
                                1
                            </div>

                            <h3 className="font-bold text-lg mb-2">
                                Upload an Image
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400">
                                Upload an image using your device,
                                camera, URL, paste or drag and drop.
                            </p>

                        </div>


                        <div className="text-center">

                            <div
                                className="
                                    text-3xl
                                    font-bold
                                    mb-3
                                "
                            >
                                2
                            </div>

                            <h3 className="font-bold text-lg mb-2">
                                Pick and Analyze Colors
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400">
                                Select colors from your image and
                                explore their HEX, RGB, HSL and
                                palette information.
                            </p>

                        </div>


                        <div className="text-center">

                            <div
                                className="
                                    text-3xl
                                    font-bold
                                    mb-3
                                "
                            >
                                3
                            </div>

                            <h3 className="font-bold text-lg mb-2">
                                Export Your Palette
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400">
                                Save your extracted colors as CSS,
                                JSON or PDF for use in your projects.
                            </p>

                        </div>

                    </div>

                </section>


                {/* Bottom CTA */}
                <section
                    className="
                        mt-16
                        text-center
                        rounded-3xl
                        bg-gray-100
                        dark:bg-gray-900
                        border
                        border-gray-200
                        dark:border-gray-800
                        p-8
                    "
                >

                    <h2 className="text-2xl font-bold mb-3">
                        Ready to Extract Colors?
                    </h2>

                    <p
                        className="
                            text-gray-600
                            dark:text-gray-400
                            mb-6
                        "
                    >
                        Upload an image and start exploring its
                        colors with PixelPick AI.
                    </p>

                    <Link
                        to="/"
                        className="
                            inline-block
                            px-6
                            py-3
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            transition
                        "
                    >
                        Open PixelPick AI
                    </Link>

                </section>

            </div>
        </div>
    );
};

export default Tools;