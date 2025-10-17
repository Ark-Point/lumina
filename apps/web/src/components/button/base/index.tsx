import { ButtonHTMLAttributes } from "react";
import { StrictPropsWithChildren } from "@/types";
import { StyledButton } from "./style";
import Loading from "@/components/loading";

export type ButtonSize = "md";

// FIXME: Line, Ghost 타입 추가 될 수도
export type ButtonVariant = "primary";

export type BaseButtonProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  isFullWidth?: boolean;
  width: number;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseButton = ({
  size = "md",
  variant = "primary",
  type = "button",
  isFullWidth = false,
  isLoading = false,
  width,
  color,
  children,
  ...rest
}: StrictPropsWithChildren<BaseButtonProps>) => {
  return (
    <StyledButton
      size={size}
      variant={variant}
      type={type}
      isFullWidth={isFullWidth}
      width={width}
      disabled={!!rest.disabled}
      isLoading={isLoading}
      aria-disabled={!!rest.disabled || isLoading}
      aria-busy={isLoading}
      color={color}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </StyledButton>
  );
};
