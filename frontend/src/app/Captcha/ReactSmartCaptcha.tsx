import { SmartCaptcha } from "@yandex/smart-captcha";

export const ReactSmartCaptcha = ({ token, setToken }) => {
  return (
    <SmartCaptcha
      sitekey="ysc1_x0xNpebboxFQnUH8LFWHtyBaEj5xc7hZv929dhvj6a7aff69"
      onSuccess={setToken}
    />
  );
};
