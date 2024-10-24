import React from 'react';
import styles from './ThemeSwitcher.module.css';
import { FormControlLabel, Switch, Tooltip, styled } from '@mui/material';
import { useThemeContext } from '@/store/ThemeContextProvider';

const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 58,
  height: 32,
  padding: 8,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: 'transparent',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('light1.svg')`,
        transition: 'all .5s ease',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: 'transparent',
    width: 30,
    height: 30,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('dark1.svg')`,
      transition: 'all .5s ease',
    },
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
  },
}));

export default function ThemeSwitcher() {
  const { currentTheme, themeSwitchHandler } = useThemeContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    themeSwitchHandler(event.target.checked ? 'light' : 'dark');
  };

  return (
    <div>
      <Tooltip
        title={`Switch to ${
          currentTheme.palette.mode === 'light' ? 'dark' : 'light'
        } theme`}
      >
        <FormControlLabel
          control={
            <ThemeSwitch
              checked={currentTheme.palette.mode === 'light'}
              onChange={handleChange}
              sx={{ marginX: 1 }}
            />
          }
          label={'Theme'}
          labelPlacement="start"
          sx={{ marginLeft: '0px' }}
        />
      </Tooltip>
    </div>
  );
}
