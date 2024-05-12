import { useCategories } from "@/shared/category/hooks/useCategories";
import * as Label from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill";

export const RichTextFieldController = ({
  defaultValue,
}: {
  defaultValue?: string;
}) => {
  const { data, isError } = useCategories();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  if (isError || !data) {
    return null;
  }

  return (
    <>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <>
            <Label.Root id="description-label">Описание</Label.Root>
            <ReactQuill
              id="description-label"
              theme="snow"
              value={value}
              onChange={onChange}
            />
          </>
        )}
      />
    </>
  );
};
