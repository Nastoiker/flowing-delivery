import { useEffect, useState } from "react";
import { Container, StyledButton, Text } from "./styled";

const STORAGE_KEY = "isCookiePolicyAccepted";

export const CookieAlert = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onAccept = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  useEffect(() => {
    const isCookiePolicyAccepted = localStorage.getItem(STORAGE_KEY);
    setIsOpen(!isCookiePolicyAccepted);
  }, []);
  return (
    isOpen && (
      <Container>
        <Text>
          Food использует cookie, чтобы повысить удобство пользования сайтом.
        </Text>
        <StyledButton onClick={onAccept} variant="contained">
          Ок
        </StyledButton>
      </Container>
    )
  );
};
