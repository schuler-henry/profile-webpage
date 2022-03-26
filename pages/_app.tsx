import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { initializeIcons } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

function MyApp({ Component, pageProps }: AppProps) {
  initializeIcons(/* optional base url */);
  registerIcons({
    icons: {
      Germany: getUnicodeFlagIcon('DE'),
      US: getUnicodeFlagIcon('US')
    }
  })
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
