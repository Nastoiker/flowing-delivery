import { Button, Checkbox, Input } from "@mui/material";

export const PaymentForm = ({ totalPrice }) => {
  return (
    <form method="POST" action="https://yoomoney.ru/quickpay/confirm">
      <Input type="hidden" name="receiver" value="4100118678288038" />
      <Input type="hidden" name="label" value="$order_id" />
      <Input type="hidden" name="quickpay-form" value="button" />
      <Input type="hidden" name="sum" value={totalPrice} data-type="number" />

      <Checkbox name="paymentType" value="AC" />
      <Button type="submit">Перевести</Button>
    </form>
  );
};
