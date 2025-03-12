import noImg from "@/assets/no-image.jpg";
import { getRandomColor } from "@/helpers/getRandomColor";
import { Skeleton } from "@mui/material";
import {
  ImgHTMLAttributes,
  ReactElement,
  cloneElement,
  isValidElement,
  memo,
  useLayoutEffect,
  useState,
} from "react";
interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  fallback?: ReactElement;
  errorFallback?: ReactElement;
  height: string;
  width: string;
}

export const AppImage = memo((props: AppImageProps) => {
  const {
    className,
    src,
    alt = "image",
    errorFallback = (
      <Skeleton
        variant="rectangular"
        color={getRandomColor()}
        width={140}
        height={140}
      />
    ),
    fallback = (
      <Skeleton
        variant="rectangular"
        color={getRandomColor()}
        width={140}
        height={140}
      />
    ),
    height,
    width,
    ...otherProps
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const enhancedFallback = isValidElement(fallback)
    ? cloneElement(fallback as ReactElement, { color: getRandomColor() })
    : fallback;
  useLayoutEffect(() => {
    const img = new Image();
    img.src = src ?? "";
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      img.src = noImg;
      setIsLoading(false);
      setHasError(true);
    };
  }, [src]);

  if (isLoading && fallback) {
    return enhancedFallback;
  }

  if (hasError && errorFallback) {
    return enhancedFallback;
  }

  return (
    <img
      style={{ height, width }}
      className={className}
      src={src}
      alt={alt}
      {...otherProps}
    />
  );
});
