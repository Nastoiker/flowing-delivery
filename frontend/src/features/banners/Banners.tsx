import { useBanners } from "@/entities/banner/hooks/useCrudBanners";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  border-radius: 25px;
  margin: "0 30px";
`;
export const Banners = () => {
  const { data } = useBanners();
  const navigate = useNavigate();
  if (!data?.data?.banner?.length) {
    return null;
  }
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    style: { marginRight: "20px" },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
        {data?.data.banner.map(({ picture, alt, link }) => (
          <AppImage
            onClick={() => navigate(link)}
            fallback={<Skeleton variant="rectangular" height={140} />}
            errorFallback={<Skeleton variant="rectangular" height={140} />}
            src={`${HOST + picture}`}
            alt={alt}
            height="200px"
            width="100%"
          />
        ))}
      </Slider>
    </Wrapper>
  );
};
