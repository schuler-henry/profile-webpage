// 'use client';
import Header from '@/components/modules/Header/Header';
import Footer from '@/components/modules/Footer/Footer';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, Divider, Paper } from '@mui/material';
import ThemeContextProvider from '@/store/ThemeContextProvider';
import UserContextProvider from '@/store/UserContextProvider';
import SnackbarComponent from '@/components/elements/SnackbarComponent/SnackbarComponent';
import SnackbarContextProvider from '@/store/SnackbarContextProvider';

export const metadata: Metadata = {
  title: 'Henry Schuler',
  description: "Henry Schuler's personal website",
  manifest: '/manifest.json',
  icons: {
    shortcut: '/favicon.ico',
    apple: [
      { url: '/logos/logo-152x152.png', sizes: '152x152' },
      { url: '/logos/logo-192x192.png', sizes: '192x192' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Henry Schuler',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserContextProvider user={null}>
      <ThemeContextProvider>
        <SnackbarContextProvider>
          <CssBaseline />
          <html lang="en">
            <body>
              <Header />
              <main>
                <Paper
                  elevation={0}
                  square
                  sx={{
                    marginTop: 'calc(56px + 1rem)',
                    marginBottom: '1rem',
                    padding: '0 1rem',
                    minHeight: 'calc(100vh - 56px - 2rem)',
                  }}
                >
                  {children}
                </Paper>
                <Divider />
              </main>
              <Footer />
              <SnackbarComponent />
            </body>
          </html>
        </SnackbarContextProvider>
      </ThemeContextProvider>
    </UserContextProvider>
  );
}
