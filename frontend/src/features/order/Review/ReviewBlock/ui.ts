import { Button, CircularProgress, FormControlLabel } from "@mui/material";
import styled, { css } from "styled-components";

const textStyle = css`
  font-family: "Inter";
  font-weight: 500;
`;

export const SaveButton = styled(Button)`
  ${textStyle}
  width: 240px;
  min-width: 180px;
  background: #00a7ff;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #ed4567;
  }
`;

export const CustomFormControlLabel = styled(FormControlLabel)`
  align-items: flex-start;
  margin-left: 0;
`;

export const CustomCircularProgress = styled(CircularProgress)`
  .MuiCircularProgress-circle {
    color: #fff;
  }
`;

export const UserNameText = styled.div`
  ${textStyle}
  display: flex;
  align-items: center;
  color: #00a7ff;
  font-size: 16px;
`;

export const ReviewTime = styled.div`
  ${textStyle}
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #929ca6;
  font-weight: 500;
`;

export const ReviewText = styled.div`
  ${textStyle}
  word-wrap: break-word;
  color: #3f3f3f;
  font-size: 14px;
  letter-spacing: 0.25px;
  margin-top: 16px;
`;

export const ReviewGuaranteeName = styled.div`
  font-size: 16px;
  color: #929ca6;
`;

export const ReviewEditButton = styled(Button)`
  font-size: 12px;
  padding: 0;
`;

export const ReviewCancelEditButton = styled(Button)`
  font-size: 12px;
`;
