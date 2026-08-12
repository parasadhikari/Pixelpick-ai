import { useApp } from "../../context/AppContext";

const ColorHistory = () => {

    const {
        history,
        setSelectedColor,
    } = useApp();

    if (!history.length) return null;

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

            <h2
                className="
                    text-xl
                    font-bold
                    mb-1
                    text-gray-900
                    dark:text-white
                "
            >
                Recent Colors
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-4
                "
            >
                Your recently selected colors. Click one to
                select it again.
            </p>

            <div className="grid grid-cols-5 gap-3">

                {history.map((color, index) => (

                    <button
                        key={index}
                        onClick={() =>
                            setSelectedColor(color)
                        }
                        className="
                            w-12
                            h-12
                            rounded-lg
                            border
                            border-gray-300
                            dark:border-gray-600
                            hover:scale-110
                            transition
                        "
                        style={{
                            backgroundColor:
                                color.hex,
                        }}
                        title={color.hex}
                    />

                ))}

            </div>

        </div>
    );
};

export default ColorHistory;