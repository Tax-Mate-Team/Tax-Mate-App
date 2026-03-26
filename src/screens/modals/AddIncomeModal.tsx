import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../theme/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { useCreateIncome, getGetIncomesQueryKey } from "../../api/generated/수입-관리/수입-관리";
import { getGetMonthlySummaryQueryKey, getGetYearlySummaryQueryKey } from "../../api/generated/대시보드/대시보드";
import { Button } from "../../components";

type AddIncomeModalProps = {
  onClose: () => void;
};

function formatInput(text: string) {
  const num = text.replace(/[^0-9]/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString();
}

export default function AddIncomeModal({ onClose }: AddIncomeModalProps) {
  const { t } = useTheme();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const createMutation = useCreateIncome({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetIncomesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMonthlySummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetYearlySummaryQueryKey() });
        showToast("수입이 등록되었습니다!");
        onClose();
      },
      onError: () => {
        showToast("수입 등록에 실패했습니다", "error");
      },
    },
  });

  const handleSubmit = () => {
    const numAmount = parseInt(amount.replace(/,/g, "")) || 0;
    if (numAmount <= 0) {
      showToast("금액을 입력해주세요", "error");
      return;
    }
    createMutation.mutate({
      data: {
        clientName: clientName.trim() || undefined,
        amount: numAmount,
        incomeDate: today,
        memo: memo.trim() || undefined,
      },
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ backgroundColor: t.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: insets.bottom + 16 }}>
        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mt-3" />
        <View className="p-6">
          <Text style={{ color: t.text }} className="text-2xl font-bold">수입 등록</Text>
          <Text style={{ color: t.textMuted }} className="text-sm mt-1">3.3% 원천징수가 자동 계산됩니다</Text>

          <Text style={{ color: t.textSecondary }} className="text-sm font-medium mt-6 mb-2">거래처명 (선택)</Text>
          <TextInput
            className="rounded-2xl px-4 py-3.5 text-base"
            style={{ backgroundColor: t.inputBg, color: t.text }}
            placeholder="예: ABC 스타트업"
            placeholderTextColor={t.textMuted}
            value={clientName}
            onChangeText={setClientName}
          />

          <Text style={{ color: t.textSecondary }} className="text-sm font-medium mt-4 mb-2">금액</Text>
          <View className="flex-row items-center rounded-2xl px-4 py-3" style={{ backgroundColor: t.inputBg }}>
            <TextInput
              className="flex-1 text-xl font-bold"
              style={{ color: t.text }}
              placeholder="0"
              placeholderTextColor={t.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={(v) => setAmount(formatInput(v))}
            />
            <Text style={{ color: t.textMuted }} className="text-base font-medium ml-2">원</Text>
          </View>

          <Text style={{ color: t.textSecondary }} className="text-sm font-medium mt-4 mb-2">메모 (선택)</Text>
          <TextInput
            className="rounded-2xl px-4 py-3.5 text-base"
            style={{ backgroundColor: t.inputBg, color: t.text }}
            placeholder="메모를 입력하세요"
            placeholderTextColor={t.textMuted}
            value={memo}
            onChangeText={setMemo}
          />

          <View className="mt-6">
            <Button title="등록하기" onPress={handleSubmit} loading={createMutation.isPending} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
