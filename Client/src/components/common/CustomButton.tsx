import Button from "@mui/material/Button";

import { CustomButtonProps } from "../../interfaces/common";

const CustomButton = ({
  type,
  title,
  backgroundColor,
  color,
  fullWidth,
  icon,
  handleClick,
  disabled,
}: CustomButtonProps) => {
  return (
      <Button
          disabled={disabled}
          type={type === "submit" ? "submit" : "button"}
          sx={{
            flex: fullWidth ? 1 : "unset",
            padding: "8px 12px", // Reduced padding for smaller button size
            width: fullWidth ? "100%" : "fit-content",
            minWidth: 100, // Reduced minimum width
            backgroundColor,
            color,
            fontSize: 12, // Reduced font size
            fontWeight: 600, // Adjusted font weight for a lighter feel
            gap: "4px",
            textTransform: "capitalize",
            borderRadius: "20px", // More curvy with increased border-radius
            "&:hover": {
              opacity: 0.9,
              backgroundColor,
            },
          }}
          onClick={handleClick}
      >
          {icon}
          {title}
      </Button>
  );
};

export default CustomButton;