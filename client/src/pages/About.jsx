import SEO from "../components/SEO";


const About = () => {
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

            <div className="max-w-4xl mx-auto">
                <SEO
                    title="About PixelPick AI | Image Color Tools"
                    description="Learn about PixelPick AI, an online image color tool for extracting colors, generating palettes and working with HEX, RGB and HSL color values."
                    canonical="https://pixelpick-ai.vercel.app/about"
                />
                {/* Heading */}
                <h1
                    className="
            text-4xl
            sm:text-5xl
            font-bold
            text-center
            mb-6
          "
                >
                    About PixelPick AI
                </h1>


                {/* Introduction */}
                <p
                    className="
            text-lg
            leading-8
            text-gray-600
            dark:text-gray-300
            text-center
            max-w-3xl
            mx-auto
          "
                >
                    PixelPick AI is an online image color picker and
                    color palette generator designed to make working
                    with colors from images simple and accessible.
                </p>


                {/* What it does */}
                <section className="mt-12">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        What is PixelPick AI?
                    </h2>

                    <p className="leading-8 text-gray-600 dark:text-gray-300">
                        PixelPick AI allows you to upload an image and
                        identify colors directly from it. You can select
                        individual colors and view their HEX, RGB and HSL
                        values, or generate a palette based on the colors
                        present in your image.
                    </p>

                </section>


                {/* Features */}
                <section className="mt-10">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        What can you do with PixelPick AI?
                    </h2>

                    <ul
                        className="
              space-y-3
              text-gray-600
              dark:text-gray-300
            "
                    >
                        <li>✓ Pick colors directly from images</li>
                        <li>✓ Get HEX, RGB and HSL values</li>
                        <li>✓ Extract color palettes</li>
                        <li>✓ Find similar colors</li>
                        <li>✓ Check color contrast</li>
                        <li>✓ Generate gradients</li>
                        <li>✓ Export palettes as CSS, JSON and PDF</li>
                    </ul>

                </section>


                {/* Who is it for */}
                <section className="mt-10">

                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                        Who is PixelPick AI for?
                    </h2>

                    <p className="leading-8 text-gray-600 dark:text-gray-300">
                        PixelPick AI can be useful for web developers,
                        UI and UX designers, graphic designers, students,
                        artists and anyone who needs to identify or work
                        with colors from an image.
                    </p>

                </section>


                {/* CTA */}
                <section
                    className="
            mt-12
            text-center
            bg-gray-100
            dark:bg-gray-900
            rounded-3xl
            p-8
            border
            border-gray-200
            dark:border-gray-800
          "
                >

                    <h2 className="text-2xl font-bold mb-3">
                        Start Picking Colors
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Upload an image and start exploring its colors.
                    </p>

                    <a
                        href="/"
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
                        Open Color Picker
                    </a>

                </section>

            </div>

        </div>
    );
};

export default About;