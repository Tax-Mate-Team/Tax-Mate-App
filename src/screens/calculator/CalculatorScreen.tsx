import { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { ScreenHeader, FadeIn } from "../../components";
import ModeSelector from "./components/ModeSelector";
import InputSection from "./components/InputSection";
import WithholdingResult from "./components/WithholdingResult";
import IncomeTaxResult from "./components/IncomeTaxResult";
import SaveCTA from "./components/SaveCTA";

type CalcMode = "withholding" | "income_tax";

function calculateIncomeTax(income: number) {
  if (income <= 14000000) return Math.floor(income * 0.06);
  if (income <= 50000000) return 840000 + Math.floor((income - 14000000) * 0.15);
  if (income <= 88000000) return 6240000 + Math.floor((income - 50000000) * 0.24);
  if (income <= 150000000) return 15360000 + Math.floor((income - 88000000) * 0.35);
  return 37060000 + Math.floor((income - 150000000) * 0.38);
}

function formatInput(text: string) {
  const num = text.replace(/[^0-9]/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString();
}

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<CalcMode>("withholding");
  const [amount, setAmount] = useState("");
  const [expense, setExpense] = useState("");
  const [calculated, setCalculated] = useState(false);
  const { t } = useTheme();

  const numAmount = parseInt(amount.replace(/,/g, "")) || 0;
  const numExpense = parseInt(expense.replace(/,/g, "")) || 0;

  const incomeTax = Math.floor(numAmount * 0.03);
  const localTax = Math.floor(numAmount * 0.003);
  const netAmount = numAmount - incomeTax - localTax;

  const simpleExpenseRate = 0.641;
  const taxableIncome = Math.max(0, numAmount - Math.max(numExpense, Math.floor(numAmount * simpleExpenseRate)));
  const estimatedTax = calculateIncomeTax(taxableIncome);
  const alreadyPaid = Math.floor(numAmount * 0.033);
  const additionalTax = estimatedTax - alreadyPaid;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: t.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="세금 계산기" subtitle="로그인 없이 바로 계산해보세요" />

      <FadeIn delay={0}>
        <ModeSelector mode={mode} onModeChange={(m) => { setMode(m); setCalculated(false); }} />
      </FadeIn>

      <FadeIn delay={100}>
        <InputSection
          mode={mode}
          amount={amount}
          expense={expense}
          onAmountChange={(t) => { setAmount(formatInput(t)); setCalculated(false); }}
          onExpenseChange={(t) => { setExpense(formatInput(t)); setCalculated(false); }}
          onCalculate={() => numAmount > 0 && setCalculated(true)}
        />
      </FadeIn>

      {calculated && numAmount > 0 && (
        <FadeIn>
          {mode === "withholding" ? (
            <WithholdingResult numAmount={numAmount} incomeTax={incomeTax} localTax={localTax} netAmount={netAmount} />
          ) : (
            <IncomeTaxResult
              numAmount={numAmount}
              appliedExpense={numExpense > 0 ? numExpense : Math.floor(numAmount * simpleExpenseRate)}
              taxableIncome={taxableIncome}
              estimatedTax={estimatedTax}
              alreadyPaid={alreadyPaid}
              additionalTax={additionalTax}
            />
          )}
          <FadeIn delay={150}>
            <SaveCTA onReset={() => { setAmount(""); setExpense(""); setCalculated(false); }} />
          </FadeIn>
        </FadeIn>
      )}
    </ScrollView>
  );
}
