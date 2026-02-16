import classNames from "classnames";

import styles from "./Icon.module.css";
import type { BrColor } from "./constants";

export type IconSize =
  | "xs"
  | "sm"
  | "lg"
  | "2x"
  | "3x"
  | "4x"
  | "5x"
  | "6x"
  | "7x"
  | "8x"
  | "9x"
  | "10x";

export interface IconProps {
  src: string;
  size?: IconSize;
  badge?: React.ReactNode;
  color?: BrColor | string;
  className?: string;
}

const BadgeIcon = ({ badge, ...rest }: IconProps) => {
  return (
    <div className={styles.badgeIcon}>
      <SimpleIcon {...rest} />
      <div className={styles.badgeIndicator}>{badge}</div>
    </div>
  );
};

const SimpleIcon = ({ src, size, color, className, ...rest }: IconProps) => {
  const svg = src?.endsWith(".svg");
  const classes = classNames(
    className,
    "fas",
    size && `fa-${size}`,
    !svg && `fa-${src}`,
    color && `text-${color}`,
  );

  return svg ? (
    <img {...rest} className={classes} src={src} aria-hidden="true" />
  ) : (
    <i {...rest} className={classes} aria-hidden="true" />
  );
};

const Icon = ({ badge, ...rest }: IconProps) => {
  return badge ? (
    <BadgeIcon badge={badge} {...rest} />
  ) : (
    <SimpleIcon {...rest} />
  );
};

export default Icon;
