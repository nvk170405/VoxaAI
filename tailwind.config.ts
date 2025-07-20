import type {Config} from "tailwindcss";
import localFont from "next/font/local";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        
    ],
    theme: {
    	extend: {
    		screens: {
    			'2xl': '1400px'
    		},
    		colors: {
				
                
			
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
				emerald: {
					DEFAULT: 'hsl(var(--emerald-background))',
                    foreground: 'hsl(var(--emerald-foreground))',
                    hover: 'hsl(var(--emerald-hover))',
                    active: 'hsl(var(--emerald-active))',
                    disabled: 'hsl(var(--emerald-disabled))',
                 	loading: 'hsl(var(--emerald-loading))',
                 },
                orange: {
					DEFAULT: 'hsl(var(--orange-background))',
                    foreground: 'hsl(var(--orange-foreground))',
                    hover: 'hsl(var(--orange-hover))',
                    active: 'hsl(var(--orange-active))',
                    disabled: 'hsl(var(--orange-disabled))',
					loading: 'hsl(var(--orange-loading))',
                 },
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'background-shine': {
    				from: {
    					backgroundPosition: '0 0'
    				},
    				to: {
    					backgroundPosition: '-200% 0'
    				}
    			},
    			
    		},
    		
    		},
    		sidebar: {
    			DEFAULT: 'hsl(var(--sidebar-background))',
    			foreground: 'hsl(var(--sidebar-foreground))',
    			primary: 'hsl(var(--sidebar-primary))',
    			'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    			accent: 'hsl(var(--sidebar-accent))',
    			'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    			border: 'hsl(var(--sidebar-border))',
    			ring: 'hsl(var(--sidebar-ring))'
    		},
			fontFamily: {
				montserrat: [
					'var(--font-montserrat)'
				]
			},
    	},
	}


		


    


export default config;