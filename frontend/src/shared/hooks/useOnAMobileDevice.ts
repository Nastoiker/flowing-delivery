import { useEffect, useState } from "react";
/**
 * Хук-хелпер для получения нужных данных о приложении в мобильном браузере
 * @returns {
 *  isMobile: Индикатор, открыто приложение в мобильном браузере или нет
 * }
 */
export const useOnAMobileDevice = () => {
  const [isMobile, setIsMobile] = useState(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, [navigator.userAgent]);

  return isMobile;
};
