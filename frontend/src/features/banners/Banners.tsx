import { useBanners } from "@/entities/banner/hooks/useCrudBanners";
import { HOST } from "@/helpers/api";
import { AppImage } from "@/shared/components/image/AppImage";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import styles from "./banner.module.css";
const Wrapper = styled.div`
  margin: 50px 0;
  max-height: 500px;
`;

export const Banners = () => {
  const { data } = useBanners();
  const navigate = useNavigate();
  if (!data?.data?.banner?.length) {
    return null;
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    // centerMode: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          variableWidth: false,
        },
      },
    ],
  };
  return (
    <Wrapper>
      <Slider {...settings}>
        {data?.data.banner.map(({ picture, alt, link }, index) => (
          <div key={index}>
            <AppImage
              className={styles["banner"]}
              onClick={() => navigate(link)}
              fallback={<Skeleton variant="rectangular" height={400} />}
              errorFallback={<Skeleton variant="rectangular" height={400} />}
              src={`${HOST + picture}`}
              alt={alt}
              height="400px"
              width="100%"
            />
          </div>
        ))}
      </Slider>
    </Wrapper>
  );
};
