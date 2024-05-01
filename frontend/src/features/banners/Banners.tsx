import { Typography } from "@mui/material";
import Slider from "react-slick";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 100px 0;
`;
const Banner = styled.div`
  height: 200px;
  padding: 20px;
  font-weight: 500;
  color: white;
  background: red;
  border-radius: 25px;
  margin: "0 30px";
`;
export const Banners = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    style: { marginRight: "20px" },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Wrapper>
      <style>
        {`
         .slick-slide {
            padding: 0 8px;
            box-sizing: border-box;
     }
        `}
      </style>
      <Slider {...settings}>
        <Banner>
          <Typography variant="h4" component="h2">
            Баннер
          </Typography>
          <Typography paragraph>Описание</Typography>
        </Banner>
        <Banner>
          <Typography variant="h4" component="h2">
            Баннер
          </Typography>
          <Typography paragraph>Описание</Typography>
        </Banner>
        <Banner>
          <Typography variant="h4" component="h2">
            Баннер
          </Typography>
          <Typography paragraph>Описание</Typography>
        </Banner>
        <Banner>
          <Typography variant="h4" component="h2">
            Баннер
          </Typography>
          <Typography paragraph>Описание</Typography>
        </Banner>
        <Banner>
          <Typography variant="h4" component="h2">
            Баннер
          </Typography>
          <Typography paragraph>Описание</Typography>
        </Banner>
        <Banner>
          <Typography variant="h4" component="h2">
            Баннер
          </Typography>
          <Typography paragraph>Описание</Typography>
        </Banner>
      </Slider>
    </Wrapper>
  );
};
