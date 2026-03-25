import { Text, Animated } from "react-native";
import { useFadeIn } from "../hooks/useFadeIn";
import { useTheme } from "../theme/ThemeContext";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  greeting?: string;
};

export default function ScreenHeader({ title, subtitle, greeting }: ScreenHeaderProps) {
  const anim = useFadeIn(0);
  const { t } = useTheme();

  return (
    <Animated.View style={anim} needsOffscreenAlphaCompositing className="px-5 pt-4 pb-2">
      {greeting && <Text style={{ color: t.textMuted }} className="text-md">{greeting}</Text>}
      <Text style={{ color: t.text }} className={`text-2xl font-bold ${greeting ? "mt-1" : ""}`}>{title}</Text>
      {subtitle && <Text style={{ color: t.textMuted }} className="text-sm mt-1">{subtitle}</Text>}
    </Animated.View>
  );
}
