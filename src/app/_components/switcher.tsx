'use client';

import { useEffect, useState } from 'react';
import styles from './switch.module.css';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'nextjs-blog-starter-theme';

const Switcher = () => {
  const [mode, setMode] = useState<ThemeMode>('light');

  // mount 시 저장된 값 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored) {
      setMode(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    }
  }, []);

  // mode가 바뀔 때마다 html 클래스, localStorage 갱신
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // 토글 함수
  const handleToggle = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      suppressHydrationWarning
      className={styles.switch}
      onClick={handleToggle}
    />
  );
};

export default Switcher;
