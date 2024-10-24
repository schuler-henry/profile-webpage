'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/store/UserContextProvider';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, setUser, isLoading } = useUser();
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async () => {
    const client = createClient();
    client.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  const handleLogout = () => {
    const client = createClient();
    client.auth.signOut();
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <IconButton size="small" sx={{ ml: 2 }}>
          <FontAwesomeIcon
            icon={faSpinner}
            fontSize={22}
            style={{ padding: '5px' }}
          />
        </IconButton>
      ) : user ? (
        <Box
          sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  style={{ borderRadius: '50%' }}
                  src={user.user_metadata.avatar_url}
                  alt="Profile Picture"
                  width={32}
                  height={32}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  fontSize={22}
                  style={{ padding: '5px' }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ) : (
        <Button onClick={handleLogin}>Login</Button>
      )}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          {user && user.user_metadata?.avatar_url ? (
            <Image
              style={{ borderRadius: '50%', marginLeft: -4, marginRight: 8 }}
              src={user.user_metadata?.avatar_url}
              alt="Profile Picture"
              width={32}
              height={32}
            />
          ) : (
            <ListItemIcon>
              <FontAwesomeIcon
                icon={faUser}
                fontSize={20}
                width={20}
                height={20}
                style={{ padding: '0px' }}
              />
            </ListItemIcon>
          )}{' '}
          {user && user.user_metadata?.name ? user.user_metadata?.name : 'User'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
