import { useOverlay } from "../../context/OverlayContext";

const ToleranceSlider = () => {

    const {
        tolerance,
        setTolerance,
    } = useOverlay();

    return (
        <div
            className="
                bg-white
                dark:bg-gray-900
                rounded-3xl
                shadow-xl
                border
                border-gray-200
                dark:border-gray-700
                p-5
                transition-colors
                duration-300
            "
        >

            <div
                className="
                    flex
                    justify-between
                    items-start
                    mb-4
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-bold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Tolerance
                    </h2>

                    <p
                        className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            mt-1
                        "
                    >
                        Controls how similar a color must be
                        to be highlighted.
                    </p>

                </div>

                <span
                    className="
                        font-bold
                        text-blue-600
                        dark:text-blue-400
                        text-lg
                    "
                >
                    {tolerance}
                </span>

            </div>

            <input
                type="range"
                min="0"
                max="120"
                value={tolerance}
                onChange={(e) =>
                    setTolerance(
                        Number(e.target.value)
                    )
                }
                className="
                    w-full
                    cursor-pointer
                    accent-blue-600
                "
            />

            <div
                className="
                    flex
                    justify-between
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mt-2
                "
            >
                <span>Exact</span>
                <span>Similar</span>
            </div>

        </div>
    );
};

export default ToleranceSlider;