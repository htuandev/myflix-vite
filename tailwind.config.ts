import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import colors from './src/constants/colors';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    colors: colors
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({});
      addComponents({
        '.container': {
          maxWidth: '1536px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: theme('spacing.4'),
          minHeight: 'calc(100vh - 64px)',
          '@media (min-width: 1024px)': {
            padding: theme('spacing.8')
          }
        },
        '.flex-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        '.animate-skeleton': {
          background:
            'linear-gradient(90deg,rgba(237 237 237 / 0.12) 25%,rgba(237 237 237 / 0.24) 50%,rgba(237 237 237 / 0.12) 75%)',
          backgroundSize: '400% 100%',
          animation: 'skeleton 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        },
        '.text-heading': {
          marginBottom: theme('spacing.4'),
          fontSize: theme('fontSize.2xl'),
          lineHeight: theme('spacing.8'),
          fontWeight: theme('fontWeight.bold'),
          '@media (min-width: 768px)': {
            fontSize: theme('fontSize.3xl'),
            lineHeight: theme('spacing.9')
          }
        }
      });
      addUtilities({
        '.aspect-poster': {
          aspectRatio: '2/3'
        }
      });
    })
  ]
};
export default config;
