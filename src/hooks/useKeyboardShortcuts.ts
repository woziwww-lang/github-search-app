import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onSearchFocus?: () => void;
  onQuickSearch?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = ({
  onSearchFocus,
  onQuickSearch,
  onEscape,
}: KeyboardShortcutsConfig) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Forward slash (/) - Focus search
      if (event.key === '/' && !isInputFocused && onSearchFocus) {
        event.preventDefault();
        onSearchFocus();
      }

      // Ctrl+K or Cmd+K - Quick search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k' && onQuickSearch) {
        event.preventDefault();
        onQuickSearch();
      }

      // Escape - Clear focus or close modals
      if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchFocus, onQuickSearch, onEscape]);
};
