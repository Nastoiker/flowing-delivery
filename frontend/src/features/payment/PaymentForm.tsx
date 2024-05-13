import { Button, Checkbox, FormControlLabel, Input } from "@mui/material";
import { Label } from "@radix-ui/themes/dist/esm/components/context-menu.js";

export const PaymentForm = () => {
  return (
    <form method="POST" action="https://yoomoney.ru/quickpay/confirm">
      <Input type="hidden" name="receiver" value="4100118678288038" />
      <Input type="hidden" name="label" value="$order_id" />
      <Input type="hidden" name="quickpay-form" value="button" />
      <Input type="hidden" name="sum" value="4568.25" data-type="number" />
      <FormControlLabel
        control={<Checkbox name="paymentType" value="PC" />}
        label="ЮMoney"
      />
      <Label></Label>
      <FormControlLabel
        control={<Checkbox name="paymentType" value="AC" />}
        label="Банковской картой"
      />
      <Button type="submit">Перевести</Button>
    </form>
  );
};
