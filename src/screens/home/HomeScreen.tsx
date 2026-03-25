import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { ScreenHeader, PullToRefresh, FadeIn } from "../../components";
import SummaryCard from "./components/SummaryCard";
import QuickActions from "./components/QuickActions";
import ChartsSection from "./components/ChartsSection";
import MonthlySummary from "./components/MonthlySummary";
import RecentTransactions from "./components/RecentTransactions";

async function fakeRefresh() {
  return new Promise<void>((r) => setTimeout(r, 1200));
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTheme();

  return (
    <PullToRefresh
      onRefresh={fakeRefresh}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 100 }}
      style={{ backgroundColor: t.bg }}
    >
      <ScreenHeader greeting="안녕하세요" title="김범수님의 수입 현황" />
      <FadeIn delay={0}><SummaryCard /></FadeIn>
      <FadeIn delay={80}><QuickActions /></FadeIn>
      <FadeIn delay={160}><ChartsSection section="line" /></FadeIn>
      <FadeIn delay={240}><ChartsSection section="bar" /></FadeIn>
      <FadeIn delay={320}><ChartsSection section="donut" /></FadeIn>
      <FadeIn delay={400}><MonthlySummary /></FadeIn>
      <FadeIn delay={480}><RecentTransactions /></FadeIn>
    </PullToRefresh>
  );
}
