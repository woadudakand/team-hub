import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts = {}) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Skip if user is typing in input fields
            if (
                event.target.tagName === 'INPUT' ||
                event.target.tagName === 'TEXTAREA' ||
                event.target.isContentEditable
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const combo = [
                event.ctrlKey && 'ctrl',
                event.metaKey && 'meta', // For Mac
                event.altKey && 'alt',
                event.shiftKey && 'shift',
                key,
            ]
                .filter(Boolean)
                .join('+');

            // Check for exact match first
            if (shortcuts[combo]) {
                event.preventDefault();
                shortcuts[combo](event);
                return;
            }

            // Check for key-only shortcuts
            if (shortcuts[key]) {
                event.preventDefault();
                shortcuts[key](event);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

export default useKeyboardShortcuts;
