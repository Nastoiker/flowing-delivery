import {
    useCreateReview,
    useReviewByFoodId,
} from "@/entities/review/hooks/useReview";
import { useFoodById } from "@/shared/food/hooks/useCrudFood";
import { useParams } from "react-router-dom";
import styled from "styled-components";
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
  const WrapperMain = styled.div`
    display: flex;
    margin: 50px 0;
    gap: 50px;
    flex-wrap: wrap;
  `;
  export const FoodById = () => {
    const { id } = useParams();
    const { data, isError, isLoading } = useFoodById(Number(id));
    const { createReview, isCreatingComment } = useCreateReview();
    const { data: reviews } = useReviewByFoodId(Number(id));
    if (isError || !data || !reviews) {
      return null;
    }
    return (
     <div>

      </div>
    );
  };
  