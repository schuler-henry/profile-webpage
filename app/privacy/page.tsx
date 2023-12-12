import { Link, Typography } from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import styles from './styles.module.css';

export default function Privacy() {
  return (
    <div className={styles.privacyWrapper}>
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy describes how we ensures your privacy and protects
        your personal information when you visit our website, which is hosted on
        the{' '}
        <Typography
          component={'a'}
          href="https://vercel.com/"
          color={'secondary'}
        >
          Vercel
        </Typography>{' '}
        platform.
      </p>
      <br />
      <h2>No Data Collection</h2>
      <p>
        We do not collect or process any personal information or data from
        visitors to this website. This means that when you access our website,
        no personal data such as names, email addresses, or any other personally
        identifiable information is obtained or stored.
      </p>
      <br />
      <h2>Cookies and Analytics</h2>
      <p>
        We may use cookies or similar technologies to enhance your browsing
        experience, but these do not collect any personal data. These cookies
        may include those necessary for the website&apos;s functionality or for
        basic analytics to help us improve our website&apos;s performance.
      </p>
      <br />
      <h2>Hosting Platform</h2>
      <p>
        Our website is hosted on the Vercel platform. Vercel may collect and
        process certain data for operational and security purposes. Please
        review{' '}
        <Typography
          component={'a'}
          href="https://vercel.com/legal/privacy-policy"
          color={'secondary'}
        >
          Vercel&apos;s Privacy Policy
        </Typography>{' '}
        for more information on their data handling practices.
      </p>
      <br />
      <h2>Links to External Websites</h2>
      <p>
        Our website may contain links to external websites. We are not
        responsible for the privacy practices or content of these external
        sites. Please review the privacy policies of those websites for more
        information.
      </p>
      <br />
      <h2>Changes to This Privacy Policy</h2>
      <p>
        We reserve the right to update or change our Privacy Policy at any time.
        Any updates will be posted on this page with a revised date.
      </p>
      <br />
      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns regarding our Privacy Policy,
        please contact us at{' '}
        <Link
          href="mailto:contact@henryschuler.de"
          component={NextLink}
          color="secondary"
        >
          contact@henryschuler.de
        </Link>
        .
      </p>
      <br />
      <p className={styles.lastUpdated}>
        Last Updated: {new Date(2023, 9, 30).toLocaleDateString()}
      </p>
    </div>
  );
}
