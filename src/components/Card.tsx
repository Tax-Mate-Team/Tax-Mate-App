import { Animated, ViewProps } from "react-native";
import { shadows } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";

type CardProps = ViewProps & {
  shadow?: "sm" | "md" | "lg";
  children: React.ReactNode;
};

export default function Card({ shadow = "md", children, className = "", style, ...rest }: CardProps) {
  const { t } = useTheme();

  return (
    <Animated.View
      className={`rounded-3xl ${className}`}
      style={[{ backgroundColor: t.card }, shadows[shadow], style]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}
