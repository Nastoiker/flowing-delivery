import { SmartCaptcha } from "@yandex/smart-captcha";

export const ReactSmartCaptcha = ({ token, setToken }) => {
  return <SmartCaptcha sitekey="" onSuccess={setToken} />;
};
