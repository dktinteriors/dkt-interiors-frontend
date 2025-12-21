import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light: '#e6c967',
          dark: '#b8941f',
        },
        cream: '#fafafa',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['clamp(1.875rem, 4vw, 2.25rem)', { lineHeight: '1.2' }],
        'display-md': ['clamp(2.25rem, 5vw, 3rem)', { lineHeight: '1.2' }],
        'display-lg': ['clamp(3rem, 6vw, 4rem)', { lineHeight: '1.1' }],
        'display-xl': ['clamp(3.5rem, 8vw, 5rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      aspectRatio: {
        portrait: '4 / 5',
        landscape: '16 / 10',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#525252',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              color: '#d4af37',
              textDecoration: 'none',
              '&:hover': {
                color: '#b8941f',
              },
            },
            h2: {
              fontFamily: 'var(--font-cormorant)',
              fontWeight: '300',
            },
            h3: {
              fontFamily: 'var(--font-cormorant)',
              fontWeight: '400',
            },
            blockquote: {
              fontStyle: 'normal',
              borderLeftColor: '#d4af37',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
