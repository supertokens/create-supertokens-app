/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "golden-bell": {
                    50: "#fdf9ef",
                    100: "#fbf0d9",
                    200: "#f5ddb3",
                    300: "#efc682",
                    400: "#e7a550",
                    500: "#e28d31",
                    600: "#d37223",
                    700: "#af591f",
                    800: "#8c4720",
                    900: "#713b1d",
                    950: "#3d1d0d",
                },
            },
        },
    },
    plugins: [],
};
