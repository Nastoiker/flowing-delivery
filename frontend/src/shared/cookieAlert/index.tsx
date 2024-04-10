import { useEffect, useState } from 'react';
import { Container, StyledButton, Text } from './styled';

const STORAGE_KEY = 'isCookiePolicyAccepted';

export const CookieAlert = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onAccept = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  useEffect(() => {
    const isCookiePolicyAccepted = localStorage.getItem(STORAGE_KEY);
    setIsOpen(!isCookiePolicyAccepted);
  }, []);
  return (
    isOpen && (
      <Container>
        <Text>
        FINLEO использует cookie, чтобы повысить удобство пользования сайтом.
          <a
            href="https://storage.yandexcloud.net/public-production/privacy_policy_FINLEO.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            &nbsp;Политика конфиденциальности.
          </a>
        </Text>
        <StyledButton onClick={onAccept} variant="contained">
          Ок
        </StyledButton>
      </Container>
    )
  );
};
