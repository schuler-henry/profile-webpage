import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { darkTheme, lightTheme } from '../styles/theme';
import { FrontEndController } from '../controller/frontEndController';
import { ColorTheme } from '../enums/colorTheme';
import { useEffect, useState } from 'react';



function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(0);
  initializeIcons(/* optional base url */);
  registerIcons({
    icons: {
      Germany: getUnicodeFlagIcon('DE'),
      US: getUnicodeFlagIcon('US')
    }
  })
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTheme(FrontEndController.getTheme());
  })

  useEffect(() => {
    const storageTokenListener = async (event: any) => {
      console.log("Hallo")
      if (event.key === FrontEndController.themeName) {
        setTheme(FrontEndController.getTheme());
      }
    }

    console.log("EventListener");

    window.addEventListener('storage', storageTokenListener);

    return function cleanup() {
      console.log("Cleanup");

      window.removeEventListener('storage', storageTokenListener);
    };
  })

  return (
    <ThemeProvider theme={theme === ColorTheme.darkTheme ? darkTheme : lightTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp)
