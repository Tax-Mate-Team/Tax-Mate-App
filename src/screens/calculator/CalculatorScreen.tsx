import { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { ScreenHeader, FadeIn } from "../../components";
import { useCalculateWithholdingTax } from "../../api/generated/세금-계산기/세금-계산기";
import { useCalculateIncomeTax } from "../../api/generated/세금-계산기/세금-계산기";
import type { WithholdingTaxResponse } from "../../api/generated/model/withholdingTaxResponse";
import type { IncomeTaxResponse } from "../../api/generated/model/incomeTaxResponse";
import ModeSelector from "./components/ModeSelector";
import InputSection from "./components/InputSection";
import WithholdingResult from "./components/WithholdingResult";
import IncomeTaxResult from "./components/IncomeTaxResult";
import SaveCTA from "./components/SaveCTA";

type CalcMode = "withholding" | "income_tax";

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
  const { t } = useTheme();
  const { showToast } = useToast();

  const [withholdingResult, setWithholdingResult] =
    useState<WithholdingTaxResponse | null>(null);
  const [incomeTaxResult, setIncomeTaxResult] =
    useState<IncomeTaxResponse | null>(null);

  const withholdingMutation = useCalculateWithholdingTax({
    mutation: {
      onSuccess: (res) => {
        setWithholdingResult(res.data!);
      },
      onError: () => showToast("계산에 실패했습니다", "error"),
    },
  });

  const incomeTaxMutation = useCalculateIncomeTax({
    mutation: {
      onSuccess: (res) => {
        setIncomeTaxResult(res.data!);
      },
      onError: () => showToast("계산에 실패했습니다", "error"),
    },
  });

  const numAmount = parseInt(amount.replace(/,/g, "")) || 0;
  const numExpense = parseInt(expense.replace(/,/g, "")) || 0;

  const handleCalculate = () => {
    if (numAmount <= 0) return;
    if (mode === "withholding") {
      withholdingMutation.mutate({ data: { amount: numAmount } });
    } else {
      incomeTaxMutation.mutate({
        data: {
          annualIncome: numAmount,
          expenses: numExpense > 0 ? numExpense : undefined,
        },
      });
    }
  };

  const handleReset = () => {
    setAmount("");
    setExpense("");
    setWithholdingResult(null);
    setIncomeTaxResult(null);
  };

  const handleModeChange = (m: CalcMode) => {
    setMode(m);
    setWithholdingResult(null);
    setIncomeTaxResult(null);
  };

  const isLoading =
    withholdingMutation.isPending || incomeTaxMutation.isPending;
  const hasResult =
    mode === "withholding" ? !!withholdingResult : !!incomeTaxResult;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: t.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="세금 계산기"
        subtitle="로그인 없이 바로 계산해보세요"
      />

      <FadeIn delay={0}>
        <ModeSelector mode={mode} onModeChange={handleModeChange} />
      </FadeIn>

      <FadeIn delay={100}>
        <InputSection
          mode={mode}
          amount={amount}
          expense={expense}
          onAmountChange={(t) => {
            setAmount(formatInput(t));
            setWithholdingResult(null);
            setIncomeTaxResult(null);
          }}
          onExpenseChange={(t) => {
            setExpense(formatInput(t));
            setIncomeTaxResult(null);
          }}
          onCalculate={handleCalculate}
          loading={isLoading}
        />
      </FadeIn>

      {hasResult && (
        <FadeIn>
          {mode === "withholding" && withholdingResult ? (
            <WithholdingResult
              numAmount={withholdingResult.grossAmount}
              incomeTax={withholdingResult.incomeTax}
              localTax={withholdingResult.localTax}
              netAmount={withholdingResult.netAmount}
            />
          ) : incomeTaxResult ? (
            <IncomeTaxResult
              numAmount={incomeTaxResult.annualIncome}
              appliedExpense={incomeTaxResult.totalExpenses}
              taxableIncome={incomeTaxResult.taxableIncome}
              estimatedTax={incomeTaxResult.calculatedTax}
              alreadyPaid={incomeTaxResult.alreadyPaidTax}
              additionalTax={incomeTaxResult.estimatedRefundOrPayment}
              isRefund={incomeTaxResult.isRefund}
            />
          ) : null}
          <FadeIn delay={150}>
            <SaveCTA onReset={handleReset} />
          </FadeIn>
        </FadeIn>
      )}
    </ScrollView>
  );
}
