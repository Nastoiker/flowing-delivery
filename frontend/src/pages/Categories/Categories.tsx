import { HOST } from "@/helpers/api";
import { useCategories } from "@/shared/category/hooks/useCategories";
import { AppImage } from "@/shared/components/image/AppImage";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import styles from "./category.module.css";

const CategoryBall = styled.div`
  display: inline-block;
  width: 230px;
  height: 230px;
  padding: auto;
  color: white;
  border-radius: 50%;
  position: relative;
  background-color: ${(props) => props.color};
  margin-right: 10px;
`;
const InnerElement = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;
const CategoryList = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 50px;
  justify-content: center;
  flex-wrap: wrap;
`;
const StyledImgBox = styled(Box)`
  border-radius: 50%;
`;
const getRandomColor = () => {
  const colors = [
    "#FF5733",
    "#C70039",
    "#900C3F",
    "#581845",
    "#FFC300",
    "#00A8E8",
    "#FF6F61",
    "#8B5C8D",
    "#FF9933",
    "#4B0082",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const CategoryBalls = ({ categories }) => {
  return (
    <CategoryList>
      {categories?.map((category) => (
        <>
          <Link to={`/categories/${category.id}`}>
            <CategoryBall key={category.id} color={getRandomColor()}>
              <InnerElement>
                <StyledImgBox>
                  <AppImage
                    className={styles.categoryImg}
                    fallback={<></>}
                    errorFallback={<></>}
                    src={`${HOST + category.pictures}`}
                    alt={category.name}
                    height="150px"
                    width="150px"
                  />
                </StyledImgBox>
              </InnerElement>
            </CategoryBall>
            <Typography textAlign={"center"} margin="auto">
              {category.name}
            </Typography>
          </Link>
        </>
      ))}
    </CategoryList>
  );
};

export const CategoriesPage = () => {
  const { data, isError } = useCategories();
  if (isError || !data) {
    return null;
  }

  return (
    <>
      <Typography margin={"50px"} variant="h4">
        Популярное
      </Typography>
      <CategoryBalls categories={data.data.categories} />
    </>
  );
};
