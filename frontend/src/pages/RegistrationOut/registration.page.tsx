import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Layout } from 'components/index';
import {
  RegistrationBanner,
  RegistrationForm,
  RegistrationRole,
} from 'features/registration';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { SupportPhone, SupportText } from './registration.styled';

const FormWidth = {
  xs: 327,
  sm: 340,
};

const FormMargin = {
  xs: 3,
  sm: 5,
};

export const RegistrationPage = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [formOffset, setFormOffset] = useState(0);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (formContainerRef.current !== null) {
        const newOffset = Math.max(
          (window.innerHeight - formContainerRef.current.clientHeight) / 2,
          0,
        );
        setFormOffset(newOffset);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [formContainerRef]);

  const [registrationRole, setRegistrationRole] =
    useState<RegistrationRole | null>(null);

  const handleRoleChange = useCallback((value: RegistrationRole | null) => {
    setRegistrationRole(value);
  }, []);

  return (
    <Layout>
      <Box width={isLg ? '44%' : '100%'} height="100%">
        <Box
          ref={formContainerRef}
          position="relative"
          width={FormWidth[isSm ? 'sm' : 'xs']}
          mx="auto"
          py={FormMargin[isSm ? 'sm' : 'xs']}
          my={`${formOffset}px`}
        >
          <RegistrationForm onRoleChange={handleRoleChange} />
          <SupportText>
            Если при создании аккаунта возникли сложности, обращайтесь по тел:{' '}
            <SupportPhone href="tel:8 (800) 100-76-78">
              8 (800) 100-76-78
            </SupportPhone>
          </SupportText>
        </Box>
      </Box>
      {isLg && (
        <Box width="56%" height="100vh" position="fixed" top={0} right={0}>
          <RegistrationBanner registrationRole={registrationRole} />
        </Box>
      )}
    </Layout>
  );
};
