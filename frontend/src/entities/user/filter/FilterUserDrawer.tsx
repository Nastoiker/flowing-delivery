import { FilterByPrice } from "@/features/food/PriceSlider/PriceSlider";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { CaretDown, Funnel, X } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
const optionsStatuses = [
  { status: "created" },
  { status: "confirmed" },
  { status: "delivery" },
  { status: "received" },
];
//
const Container = styled.div<{ $isShowPmBlock: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 50px;
  gap: 50px;
  transition: width 0.3s ease-in;
  height: 100%;
  padding-bottom: ${({ $isShowPmBlock }) => ($isShowPmBlock ? "172px" : "0px")};

  @media screen and (max-width: 640px) {
    width: 100%;
  }
`;
type Props = {
  onChangeFilter: (filter) => void;
  onChangeSort: (field, dir) => void;
  maxPrice?: number;
  minPrice?: number;
};

export const FilterOrderDrawer = ({
  onChangeFilter,
  onChangeSort,

  maxPrice = 20000,
  minPrice = 0,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [sortByDate, setSortByDate] = useState(false);
  const [cheap, setCheap] = useState(false);
  const [expensive, setExpensive] = useState(false);
  const [highRating, setHighRating] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [status, setStatus] = useState();
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleChangeSortByDate = (event) => {
    setSortByDate(event.target.checked);
    setSelectedSort("createdAt");
    onChangeSort("createdAt", event.target.checked ? "desc" : "asc");
  };

  const handleChangeCheap = (event) => {
    setCheap(event.target.checked);
    setSelectedSort("min-price");
    onChangeSort("totalPrice", event.target.checked ? "desc" : "asc");
  };

  const handleChangeExpensive = (event) => {
    setExpensive(event.target.checked);
    setSelectedSort("max-price");
    onChangeSort("totalPrice", event.target.checked ? "desc" : "asc");
  };

  return (
    <>
      <IconButton onClick={toggleDrawer(true)}>
        <Funnel size={35} />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Container $isShowPmBlock={false}>
          <IconButton
            onClick={toggleDrawer(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <X />
          </IconButton>
          <Accordion
            sx={{
              border: "none",
              boxShadow: "none",
            }}
          >
            <AccordionSummary
              expandIcon={<CaretDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Сортировать по</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ margin: "0 12px" }}>
              <FormGroup>
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                  }}
                  control={
                    <Switch
                      checked={selectedSort === "createdAt"}
                      onChange={handleChangeSortByDate}
                    />
                  }
                  label="По дате"
                />
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                  }}
                  control={
                    <Switch
                      checked={selectedSort === "min-price"}
                      onChange={handleChangeCheap}
                    />
                  }
                  label="Дешевые"
                />
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                  }}
                  control={
                    <Switch
                      checked={selectedSort === "max-price"}
                      onChange={handleChangeExpensive}
                    />
                  }
                  label="Дорогие"
                />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
          <Typography>Статус заказа</Typography>
          <Select
            placeholder="Статус заказа"
            value={status}
            onChange={(e) => {
              onChangeFilter({ status: e.target.value });
              //@ts-ignore
              setStatus({ status: e.target.value });
            }}
          >
            {optionsStatuses.map((m, index) => (
              <MenuItem key={index} value={m.status}>
                {m.status}
              </MenuItem>
            ))}
          </Select>
          <FilterByPrice
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={({ valueMax, valueMin }) => {
              onChangeFilter({ minPrice: valueMin, maxPrice: valueMax });
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              window.location.reload();
            }}
          >
            Сбросить фильтры
          </Button>
        </Container>
      </Drawer>
    </>
  );
};
