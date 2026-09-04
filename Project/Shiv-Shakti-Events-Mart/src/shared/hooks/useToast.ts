import { useState, useCallback } from 'react';

export function useToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return {
    toastMessage,
    showToast,
  };
}

export default useToast;
