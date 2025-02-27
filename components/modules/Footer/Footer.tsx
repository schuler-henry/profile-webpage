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
          margin: '30px 0',
        }}
      >
        <Box className={styles.grid}>
          <Box>
            <Typography variant="h6">Social</Typography>
            <Typography
              component={'a'}
              href="https://github.com/schuler-henry"
              color="secondary"
            >
              GitHub
            </Typography>
            <Typography
              component={'a'}
              href="https://www.linkedin.com/in/henry-schuler-7bb247235/"
              color="secondary"
            >
              LinkedIn
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Contact</Typography>
            <Typography component={'a'} href="/impressum" color="secondary">
              Impressum
            </Typography>
            <Typography component={'a'} href="/privacy" color="secondary">
              Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography className={styles.copyright}>
        © 2023-2025 Henry Schuler
      </Typography>
    </Container>
  );
}
