import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeModeDirectionSync({ setDarkMode, setDirection }) {
  const theme = useSelector(state => state.theme);

  useEffect(() => {
    if (theme.mode && setDarkMode) {
      setDarkMode(theme.mode === 'dark');
    }
    if (theme.direction && setDirection) {
      setDirection(theme.direction);
    }
  }, [theme.mode, theme.direction, setDarkMode, setDirection]);

  return null;
}
