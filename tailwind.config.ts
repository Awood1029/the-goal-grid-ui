import { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
    	extend: {
    		colors: {
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				light: '#FFE5D1',
    				dark: '#E65C00',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			dark: {
    				'100': '#000000',
    				'200': '#0F1117',
    				'300': '#151821',
    				'400': '#212734',
    				'500': '#101012'
    			},
    			light: {
    				'400': '#858EAD',
    				'500': '#7B8EC8',
    				'700': '#DCE3F1',
    				'800': '#F4F6F8',
    				'850': '#FDFDFD',
    				'900': '#FFFFFF'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		backgroundImage: {
    			'primary-gradient': 'linear-gradient(129deg, #FF7000 0%, #E2995F 100%)',
    			'dark-gradient': 'linear-gradient(232deg, rgba(23, 28, 35, 0.41) 0%, rgba(19, 22, 28, 0.7) 100%)',
    			'light-gradient': 'linear-gradient(132deg, rgba(247, 249, 255, 0.5) 0%, rgba(229, 237, 255, 0.25) 100%)'
    		},
    		boxShadow: {
    			light: '0px 12px 20px rgba(184, 184, 184, 0.1)',
    			dark: '0px 2px 10px rgba(46, 52, 56, 0.1)'
    		},
    		fontFamily: {
    			inter: [
    				'var(--font-inter)',
    				'sans-serif'
    			],
    			'space-grotesk': [
    				'var(--font-space-grotesk)',
    				'sans-serif'
    			]
    		},
    		screens: {
    			xs: '420px'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
};

export default config;
