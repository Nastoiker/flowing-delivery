import { Box, Button, TextField } from "@mui/material";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import styled from "styled-components";

interface FilterByPriceProps {
  onChange: ({ valueMax, valueMin }) => void;
  minCalories: number;
  maxCalories: number;
}
const WrapperFilter = styled.div``;
export const CaloriesSlider = ({
  minCalories = 200,
  maxCalories = 5000,
  onChange,
}: FilterByPriceProps): JSX.Element => {
  const [valueMax, setValueMax] = useState<number>(maxCalories);
  const [valueMin, setValueMin] = useState<number>(minCalories);

  const handleChange = ([low, high]: number[]) => {
    if (low > valueMax) return;
    if (low === valueMax) return;
    if (high === valueMin) return;
    if (high < valueMin) return;
    setValueMin(low);
    setValueMax(high);
  };
  return (
    <div>
      <Slider
        range
        // reverse={true}
        allowCross={true}
        value={[valueMin, valueMax]}
        step={1}
        min={20}
        max={2500}
        //@ts-ignore
        onChange={handleChange}
      />

      {/*<Input type="range" min={'10000'} max={'200000'} step={'500'} value={value} onChange={(e) => setValue(e.target.value)}/>*/}
      <Box gap="20px" margin="20px 0" display={"flex"}>
        <TextField
          onChange={(e) => {
            setValueMin(Number(e.target.value));
          }}
          label="Минимум"
          type={"number"}
          value={valueMin}
        />
        <TextField
          label="Максимум"
          onChange={(e) => {
            setValueMax(Number(e.target.value));
          }}
          value={valueMax}
        />
      </Box>
      <Button
        variant="contained"
        onClick={() => onChange({ valueMax, valueMin })}
      >
        Сохранить
      </Button>
    </div>
  );
};
