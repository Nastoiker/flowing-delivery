import { Button, Input } from "@mui/material";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";

interface FilterByPriceProps {
  onChange: ({ valueMax, valueMin }) => void;
  cl;
}
export const FilterByPrice = ({
  onChange,
}: FilterByPriceProps): JSX.Element => {
  const [valueMax, setValueMax] = useState<number>(200000);
  const [valueMin, setValueMin] = useState<number>(10000);
  console.log(valueMax);

  const handleChange = ([low, high]: number[]) => {
    if (low > valueMax) return;
    if (low === valueMax) return;
    if (high === valueMin) return;
    if (high < valueMin) return;
    setValueMin(low);
    setValueMax(high);
    onChange({ valueMax, valueMin });
  };
  return (
    <div>
      <Slider
        range
        // reverse={true}
        allowCross={true}
        value={[valueMin, valueMax]}
        step={1000}
        min={10000}
        max={200000}
        //@ts-ignore
        onChange={handleChange}
      />

      {/*<Input type="range" min={'10000'} max={'200000'} step={'500'} value={value} onChange={(e) => setValue(e.target.value)}/>*/}
      <div className={"space-y-5 py-5"}>
        <Input
          onChange={(e) => {
            setValueMin(Number(e.target.value));
          }}
          type={"number"}
          value={valueMin}
        />
        <Input
          onChange={(e) => {
            setValueMax(Number(e.target.value));
          }}
          value={valueMax}
        />
      </div>
      <Button onClick={() => {}}>Сохранить</Button>
    </div>
  );
};
