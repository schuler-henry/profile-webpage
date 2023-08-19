import React from 'react';
import styles from './Footer.module.css';
import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  Link as MUILink,
} from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Container
      maxWidth="sm"
      component={'footer'}
      sx={{
        paddingLeft: '20px',
        paddingRight: '20px',
        margin: '0',
      }}
    >
      <Box
        sx={{
          padding: '30px 0',
        }}
      >
        <Box className={styles.grid}>
          <Box>
            <Typography variant="h6">Social</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Projects</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Contact</Typography>
            <Typography component={'a'} href="/impressum" color="secondary">
              Impressum
            </Typography>
            <Typography component={'a'} href="/privacy" color="secondary">
              Privacy Policy
            </Typography>
            <Typography component={'a'} href="/terms" color="secondary">
              Terms of Service
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Account</Typography>
          </Box>
        </Box>
      </Box>
      <Typography>Copyright © 2023</Typography>
    </Container>
  );
}
