import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling'
import { ChevronDownIcon, ChevronRightIcon, AddIcon, DeleteIcon, SyncIcon, TimerIcon, PlayIcon, StopIcon, SendIcon } from '@fluentui/react-icons-mdl2'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { darkTheme, lightTheme } from '../styles/theme';
import { FrontEndController } from '../controller/frontEndController';
import { ColorTheme } from '../enums/colorTheme';
import { useEffect, useState } from 'react';
import { PWPThemeProvider } from '../components/PWPThemeProvider/PWPThemeProvider';

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(0);
  const [executed, setExecuted] = useState(false);
  
  if (!executed) {
    registerIcons({
      icons: {
        Germany: getUnicodeFlagIcon('DE'),
        US: getUnicodeFlagIcon('US'),
        ChevronDown: <ChevronDownIcon />,
        ChevronRight: <ChevronRightIcon />,
        Add: <AddIcon />,
        Delete: <DeleteIcon />,
        Sync: <SyncIcon />,
        Timer: <TimerIcon />,
        Play: <PlayIcon />,
        Stop: <StopIcon />,
        Send: <SendIcon />,
      }
    })
    initializeIcons();
    setExecuted(true);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTheme(FrontEndController.getTheme());
    // console.log("MyApp");
    
    document.body.dataset.theme = theme === ColorTheme.lightTheme ? "light" : "dark";
  })

  return (
    <PWPThemeProvider theme={theme === ColorTheme.lightTheme ? "light" : "dark"}>
      <ThemeProvider theme={theme === ColorTheme.darkTheme ? darkTheme : lightTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </PWPThemeProvider>
  )
}

export default appWithTranslation(MyApp)
