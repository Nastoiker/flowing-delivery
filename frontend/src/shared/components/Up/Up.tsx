import { useScrollY } from "@/helpers/useScrollY";
import { IconButton } from "@mui/material";
import cn from "classnames";
import { useEffect, useState } from "react";
import styles from "./up.module.css";
import IconUp from "./up.svg";

export const Up = (): JSX.Element => {
  const [opacity, setOpacity] = useState(0);
  const y = useScrollY();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.body.scrollHeight;
      const scrollPosition = window.innerHeight + window.pageYOffset;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;
      setOpacity(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn(styles.up, { [styles.visible]: opacity > 0 })}>
      <IconButton onClick={scrollToTop}>
        <img src={IconUp} alt="" />
      </IconButton>
    </div>
  );
};
