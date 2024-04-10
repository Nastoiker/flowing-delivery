import { useEffect, useState } from 'react';

const changeIntialScale = (newScale: number): void => {
  const el = document.querySelector("meta[name='viewport']");
  if (el) {
    el.setAttribute(
      'content',
      `width=device-width, initial-scale=${newScale}, shrink-to-fit=no, maximum-scale=1.0, user-scalable=0`,
    );
  }
};

/*
Хук начинает масштабировать viewport, начиная с заданной ширины
 */
export const useScaleViewPort = (width: number): void => {
  const [isViewPortChanged, setIsViewPortChanged] = useState(false);
  const updateInitialScale = () => {
    if (window.screen.width <= width && !isViewPortChanged) {
      setIsViewPortChanged(true);
      const newScale = window.screen.width / width;
      changeIntialScale(newScale);
    }
    if (window.screen.width > width && isViewPortChanged) {
      setIsViewPortChanged(false);
      changeIntialScale(1);
    }
  };

  useEffect(() => {
    if (window.screen.width <= width) {
      setIsViewPortChanged(true);
      const newScale = window.screen.width / width;
      changeIntialScale(newScale);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('resize', updateInitialScale);
    return () => window.removeEventListener('resize', updateInitialScale);
  }, []);
};
