import { useState, useEffect } from 'react';
import System from '@/models/system';

export function useSettings() {
  const [settings, setSettings] = useState({
    showAllCustomizations: true
  });

  useEffect(() => {
    async function fetchSettings() {
      const systemKeys = await System.keys();
      if (systemKeys) {
        setSettings({
          showAllCustomizations: systemKeys.ShowAllCustomizations ?? true
        });
      }
    }
    fetchSettings();
  }, []);

  return { settings };
} 