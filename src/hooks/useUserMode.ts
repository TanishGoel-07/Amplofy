import { useState, useEffect, useCallback } from 'react';

export type UserMode = 'buyer' | 'seller';

const EVENT_NAME = 'amplofy_mode_change';

export function useUserMode() {
  const [mode, setModeState] = useState<UserMode>(() => {
    const saved = localStorage.getItem('amplofy_user_mode');
    return saved === 'seller' ? 'seller' : 'buyer';
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<UserMode>;
      if (custom.detail) {
        setModeState(custom.detail);
      } else {
        const saved = localStorage.getItem('amplofy_user_mode');
        setModeState(saved === 'seller' ? 'seller' : 'buyer');
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const setMode = useCallback((newMode: UserMode) => {
    localStorage.setItem('amplofy_user_mode', newMode);
    setModeState(newMode);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newMode }));
  }, []);

  const toggleMode = useCallback(() => {
    setModeState(prev => {
      const next = prev === 'buyer' ? 'seller' : 'buyer';
      localStorage.setItem('amplofy_user_mode', next);
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
      return next;
    });
  }, []);

  return { mode, setMode, toggleMode };
}

export default useUserMode;
