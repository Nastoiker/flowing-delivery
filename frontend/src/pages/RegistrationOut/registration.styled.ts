import { Link, styled, Typography } from '@mui/material';

export const SupportText = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(4)};
  color: ${(props) => props.theme.palette.text.secondary};
  font-size: 12px;
  line-height: 20px;
  text-align: center;
`;

export const SupportPhone = styled(Link)`
  color: ${(props) => props.theme.palette.primary.main};
  text-decoration: none;
`;
