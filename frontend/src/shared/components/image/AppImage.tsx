import noImg from "@/assets/no-image.jpg";
import { Skeleton } from "@mui/material";
import {
  ImgHTMLAttributes,
  ReactElement,
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
    errorFallback = <Skeleton variant="rectangular" width={140} height={140} />,
    fallback = <Skeleton variant="rectangular" width={140} height={140} />,
    height,
    width,
    ...otherProps
  } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    return fallback;
  }

  if (hasError && errorFallback) {
    return errorFallback;
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
