import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeMetaSync() {
  const theme = useSelector(state => state.theme);
  const faviconUrl = theme.favicon
    ? (theme.favicon.startsWith('http') ? theme.favicon : (import.meta.env.VITE_API_URL + theme.favicon))
    : null;
  const title = theme.title || 'TEAM HUB';

  useEffect(() => {
    if (!theme.favicon && !theme.title) return;
    document.title = title;
    // Use the favicon link with id for more reliable update
    let link = document.querySelector("link#dynamic-favicon");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.id = 'dynamic-favicon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl || '/vite.svg';
  }, [title, faviconUrl, theme.favicon, theme.title]);

  return null;
}
