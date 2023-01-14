import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import { registerIcons } from '@fluentui/react/lib/Styling'
import { ChevronDownIcon, ChevronRightIcon, AddIcon, DeleteIcon, SyncIcon, TimerIcon, PlayIcon, StopIcon, SendIcon, ContactIcon, LockIcon, MoreSportsIcon, ContactCardSettingsIcon } from '@fluentui/react-icons-mdl2'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { darkTheme, lightTheme } from '../styles/theme';
import { FrontEndController } from '../controller/frontEndController';
import { ColorTheme } from '../enums/colorTheme';
import { useEffect, useState } from 'react';
import { PWPThemeProvider } from '../components/PWPThemeProvider/PWPThemeProvider';
import { PWPAuthProvider } from '../components/PWPAuthProvider/PWPAuthProvider';
import BadmintonIcon from '../public/icons/badminton.png'
import VolleyballIcon from '../public/icons/volleyball.png'
import Image from 'next/image';

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(0);
  const [user, setUser] = useState(undefined);
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
        Contact: <ContactIcon />,
        Lock: <LockIcon />,
        MoreSports: <MoreSportsIcon />,
        ContactCardSettingsIcon: <ContactCardSettingsIcon />,
        Badminton: <Image src={BadmintonIcon} alt="icon" />,
        Volleyball: <Image src={VolleyballIcon} alt="" />
      }
    })
    initializeIcons();
    setExecuted(true);
  }
  
  // renew Token each time the users switches to the tab
  useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  let onFocus = () => {
    FrontEndController.renewToken();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTheme(FrontEndController.getTheme());
    // console.log("MyApp");
    
    document.body.dataset.theme = theme === ColorTheme.lightTheme ? "light" : "dark";
  })

  useEffect(() => {
    const getUser = async () => {
      setUser(await FrontEndController.getUserFromToken(FrontEndController.getUserToken()));
      // console.log("SetUser", user)
    }

    /**
     * This method checks whether the event contains a change in the user-token. If it does, it updates the login state.
     */
    const storageTokenListener = async (event: any) => {
      // console.log("EVENT", event)
      if (event.key === FrontEndController.userTokenName) {
        setUser(await FrontEndController.getUserFromToken(FrontEndController.getUserToken()))
        dispatchEvent(new CustomEvent("userContextChanged"))
      }
    }

    window.addEventListener('storage', storageTokenListener)

    getUser();

    return () => {
      window.removeEventListener('storage', storageTokenListener)
    }
  }, [])

  return (
    <PWPThemeProvider theme={theme === ColorTheme.lightTheme ? "light" : "dark"}>
      <ThemeProvider theme={theme === ColorTheme.darkTheme ? darkTheme : lightTheme}>
        <PWPAuthProvider user={user}>
          <Component {...pageProps} />
        </PWPAuthProvider>
      </ThemeProvider>
    </PWPThemeProvider>
  )
}

export default appWithTranslation(MyApp)
