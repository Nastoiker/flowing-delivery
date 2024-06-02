import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import { CaretDown, Funnel, X } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
import { CaloriesSlider } from "../CaloriesSlider/CaloriesSlider";
import { FilterByPrice } from "../PriceSlider/PriceSlider";

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
  minCalories: number;
  maxCalories: number;
  maxPrice: number;
  minPrice: number;
};

export const FilterFoodDrawer = ({
  onChangeFilter,
  onChangeSort,
  minCalories,
  maxCalories,
  maxPrice,
  minPrice,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [sortByDate, setSortByDate] = useState(false);
  const [cheap, setCheap] = useState(false);
  const [expensive, setExpensive] = useState(false);
  const [highRating, setHighRating] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleChangeAvailability = (event) => {
    setAvailability(event.target.checked);
    setSelectedSort("in_stock");
    onChangeSort("in_stock", event.target.checked ? "desc" : "asc");
  };

  const handleChangeSortByDate = (event) => {
    setSortByDate(event.target.checked);
    setSelectedSort("createdAt");
    onChangeSort("createdAt", event.target.checked ? "desc" : "asc");
  };

  const handleChangeCheap = (event) => {
    setCheap(event.target.checked);
    setSelectedSort("min-price");
    if (event.target.checked) {
      onChangeSort("price", "asc");
    } else {
      onChangeSort("createdAt", "desc");
    }
  };

  const handleChangeExpensive = (event) => {
    setExpensive(event.target.checked);
    setSelectedSort("max-price");
    if (event.target.checked) {
      onChangeSort("price", "desc");
    } else {
      onChangeSort("createdAt", "desc");
    }
  };

  const handleChangeHighRating = (event) => {
    setHighRating(event.target.checked);
    setSelectedSort("rating");
    onChangeSort("rating", event.target.checked ? "desc" : "asc");
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
              sx={{ padding: 0 }}
              expandIcon={<CaretDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Сортировать по</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ margin: "0 0" }}>
              <FormGroup>
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row-reverse",
                  }}
                  control={
                    <Switch
                      checked={selectedSort === "in_stock"}
                      onChange={handleChangeAvailability}
                    />
                  }
                  label="В наличие"
                />
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
                {/* //TODO */}
                {/* <FormControlLabel
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row-reverse",
              }}
              control={
                <Switch
                  checked={selectedSort === "rating"}
                  onChange={handleChangeHighRating}
                />
              }
              label="Высокий рейтинг"
            /> */}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          <CaloriesSlider
            minCalories={minCalories}
            maxCalories={maxCalories}
            onChange={({ valueMax, valueMin }) => {
              onChangeFilter({ minCalories: valueMin, maxCalories: valueMax });
            }}
          />
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
