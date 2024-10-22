'use client';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faHouse,
  faGear,
  faSun as faLightbulbSolid,
  faCircleInfo,
  faLock,
  faScaleBalanced,
  faBook,
  faSchool,
  faGraduationCap,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { faMoon as faLightbulbRegular } from '@fortawesome/free-regular-svg-icons';
import styles from './Header.module.css';
import Image from 'next/image';
import LogoWhite from '@/public/logos/logo_name_white.png';
import LogoBlack from '@/public/logos/logo_name_black.png';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AccountMenu from '../AccountMenu/AccountMenu';

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const [openStudies, setOpenStudies] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const { palette, direction } = useTheme();
  const router = useRouter();

  const iconWidth = 20;

  const handleClose = () => {
    setOpen(false);
    setOpenStudies(false);
    setOpenInfo(false);
    setOpenSettings(false);
  };

  const handleUrl = (url: string) => {
    router.push(url);
    handleClose();
  };

  const toggleOpenStudies = () => {
    setOpenStudies(!openStudies);
  };

  const toggleOpenInfo = () => {
    setOpenInfo(!openInfo);
  };

  const toggleOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  return (
    <AppBar
      position="fixed"
      component={'header'}
      color="transparent"
      sx={{ backdropFilter: 'blur(5px)' }}
    >
      <Toolbar>
        <Typography
          component="a"
          href="/"
          sx={{
            flexGrow: 1,
            display: 'flex',
          }}
        >
          <Image
            src={palette.mode === 'dark' ? LogoWhite : LogoBlack}
            alt="Logo"
            height={35}
          />
        </Typography>
        <Typography style={{ marginRight: '10px' }}>
          <AccountMenu />
        </Typography>
        <Tooltip title="Menu">
          <IconButton
            size="large"
            edge="end"
            onClick={() => setOpen(true)}
            color="inherit"
          >
            <FontAwesomeIcon icon={faBars} size="sm" />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <SwipeableDrawer
        anchor={'right'}
        open={open}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            <ListItemButton onClick={() => handleUrl('/')}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faHouse} width={iconWidth} />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={toggleOpenStudies}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faSchool} width={iconWidth} />
              </ListItemIcon>
              <ListItemText primary="Studies" />
              {openStudies ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openStudies} timeout="auto" unmountOnExit>
              <List component="div" className={styles.subList}>
                <ListItemButton onClick={() => handleUrl('/studies')}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faGraduationCap} width={iconWidth} />
                  </ListItemIcon>
                  <ListItemText primary="Studies" />
                </ListItemButton>
                <ListItemButton onClick={() => handleUrl('/studies/summaries')}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faFileLines} width={iconWidth} />
                  </ListItemIcon>
                  <ListItemText primary="Summaries" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider variant="middle" />
          <List>
            <ListItemButton onClick={toggleOpenInfo}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faCircleInfo} width={iconWidth} />
              </ListItemIcon>
              <ListItemText primary="Contact / Info" />
              {openInfo ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openInfo} timeout="auto" unmountOnExit>
              <List component="div" className={styles.subList}>
                <ListItemButton onClick={() => handleUrl('/impressum')}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faCircleInfo} width={iconWidth} />
                  </ListItemIcon>
                  <ListItemText primary="Impressum" />
                </ListItemButton>
                <ListItemButton onClick={() => handleUrl('/privacy')}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faLock} width={iconWidth} />
                  </ListItemIcon>
                  <ListItemText primary="Privacy Policy" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider variant="middle" />
          <List>
            <ListItemButton onClick={toggleOpenSettings}>
              <ListItemIcon>
                <FontAwesomeIcon icon={faGear} width={iconWidth} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {openSettings ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSettings} unmountOnExit>
              <List component="div" className={styles.subList}>
                <ListItem>
                  <ListItemIcon>
                    {palette.mode === 'dark' ? (
                      <FontAwesomeIcon
                        // @ts-ignore
                        icon={faLightbulbRegular}
                        width={iconWidth}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faLightbulbSolid}
                        width={iconWidth}
                      />
                    )}
                  </ListItemIcon>
                  <ThemeSwitcher />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Box>
      </SwipeableDrawer>
    </AppBar>
  );
}
