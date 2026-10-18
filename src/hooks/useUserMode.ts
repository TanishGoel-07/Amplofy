import { useState, useEffect } from 'react';

export type UserMode = 'buyer' | 'seller';

export function useUserMode() {
  const [mode, setMode] = useState<UserMode>(() => {
    const saved = localStorage.getItem('amplofy_user_mode');
    return saved === 'seller' ? 'seller' : 'buyer';
  });

  useEffect(() => {
    localStorage.setItem('amplofy_user_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'buyer' ? 'seller' : 'buyer'));
  };

  return { mode, setMode, toggleMode };
}

export default useUserMode;
