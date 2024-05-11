/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Adjust this depending on where your files are located
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors : {
                xcodewhite : '#FFFFFF',
                xcodeoffwhite : '#F8F8F8',
                xcodegold : '#CA9B64',
                xcodegrey : '#939393',
                xcodedarkgrey : "#777777",
                xcodebblue : "#2C4364",
            },
            borderColor : theme => ({
                DEFAULT: theme('colors.gray.300', 'currentColor'),
                gold : '#CA9B64',
            }),
            backgroundColor : theme => ({
                white : '#FFFFFF',
            }),
        },
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
        },
    },
    plugins: [],
}