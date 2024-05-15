import { useCreateBanner } from "@/entities/banner/hooks/useCrudBanners";
import { Button, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styled from "styled-components";

interface ICreateBanner {
  link: string;
  priority: number;
  alt: number;
  pictures: Array<File>;
}

const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  max-width: 500px;
  width: 100%;
`;
export const CreateBanner = () => {
  const { createBannerFetch, error, isLoading } = useCreateBanner();
  const { register, handleSubmit, reset } = useForm<ICreateBanner>();
  const submit = async (banner: ICreateBanner) => {
    try {
      const data = new FormData();
      for (let i = 0; i < banner?.pictures.length; i++) {
        data.append("picture", banner.pictures[i]);
      }
      data.append("alt", banner.alt?.toString());
      data.append("link", banner.link?.toString());
      data.append("priority", banner.priority?.toString());
      await createBannerFetch(data);
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    }
  };
  return (
    <Wrapper onSubmit={handleSubmit(submit)}>
      <Input placeholder="link" {...register("link")} />
      <Input placeholder="priority" type="number" {...register("priority")} />
      <Input placeholder="alt" {...register("alt")} />
      <Input
        required
        inputProps={{ accept: "image/jpeg" }}
        type="file"
        {...register("pictures")}
      />
      <Button variant="outlined" type="submit">
        Создать
      </Button>
    </Wrapper>
  );
};
