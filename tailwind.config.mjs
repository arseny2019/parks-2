/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'sm': '375px',
            // => @media (min-width: 600px) { ... }

            'md': '601px',
            // => @media (min-width: 768px) { ... }

            'lg': '835px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1025px',
            // => @media (min-width: 1200px) { ... }

            '2xl': '1201px',

            '3xl': '1680px',
            // => @media (min-width: 1680px) { ... }
        },
        extend: {
            fontFamily: {
                roboto: ['var(--font-roboto)'],
                inter: ['var(--font-inter)'],
                'roboto-condensed': ['var(--font-roboto-condensed)'],
            },
            colors: {
                'main-black': '#0A0A0A',
                'background-black': 'rgba(10, 10, 10, 1)',
                'secondary-black': 'rgba(10, 10, 10, 0.8)',
                'secondary-white': 'rgba(255, 255, 255, 0.8)',
                'placeholder-black': 'rgba(10, 10, 10, 0.4)',
                'input-bg': 'rgba(10, 10, 10, 0.04)',
                'input-bg-focus': 'rgba(10, 10, 10, 0.06)',
                'input-bg-focus-border': 'rgba(10, 10, 10, 0.12)',
                'main-gray': 'rgba(10, 10, 10, 0.08)',
                'secondary-gray': 'rgba(10, 10, 10, 0.15)',
                'placeholder-white': 'rgba(255, 255, 255, 0.4)',
                'main-green': 'rgba(57, 180, 98, 1)',
                'main-blue': 'rgba(0, 148, 204, 1)',
                'secondary-green': 'rgb(49,155,84)',
                'error-red': 'rgb(210, 26, 10)',
            },
        },
    },
    plugins: [],
};
