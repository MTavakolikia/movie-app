import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ============================================================
   Button — one pill for every call to action.
   Renders a Next Link when `href` is given, otherwise <button>.
   ============================================================ */

export type ButtonVariant = "primary" | "glass" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type AnchorProps = StyleProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type NativeButtonProps = StyleProps & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export type ButtonProps = AnchorProps | NativeButtonProps;

const BASE =
  "group/btn relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold tracking-wide transition-[background-color,color,border-color,box-shadow,scale] duration-300 ease-cinematic active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent shadow-[0_14px_34px_-14px_rgb(232_185_84/0.6)] hover:bg-accent-strong",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/[0.16]",
  outline: "border border-line-strong text-ink hover:border-accent hover:text-accent",
  ghost: "text-muted hover:bg-surface-2 hover:text-ink",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-7 text-sm sm:text-[15px]",
};

function stripStyleProps<T extends StyleProps>(props: T): Omit<T, "variant" | "size" | "className" | "children"> {
  const { variant, size, className, children, ...rest } = props;
  void variant;
  void size;
  void className;
  void children;
  return rest;
}

export default function Button(props: ButtonProps) {
  const { variant = "outline", size = "md", className, children } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (props.href !== undefined) {
    const anchorProps = stripStyleProps(props as AnchorProps);
    return (
      <Link {...anchorProps} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = stripStyleProps(props as NativeButtonProps);
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
