import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../theme/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import { useCreateExpense, getGetExpensesQueryKey } from "../../api/generated/지출-관리/지출-관리";
import { getGetMonthlySummaryQueryKey, getGetYearlySummaryQueryKey } from "../../api/generated/대시보드/대시보드";
import type { CreateExpenseRequestCategory } from "../../api/generated/model";
import { Button } from "../../components";
import { colors, tintBg } from "../../theme/tokens";

type AddExpenseModalProps = {
  onClose: () => void;
};

const CATEGORIES: { value: CreateExpenseRequestCategory; label: string }[] = [
  { value: "OFFICE_SUPPLY", label: "사무용품" },
  { value: "EQUIPMENT", label: "장비" },
  { value: "SOFTWARE", label: "소프트웨어" },
  { value: "TRANSPORT", label: "교통" },
  { value: "MEAL", label: "식비" },
  { value: "EDUCATION", label: "교육" },
  { value: "TELECOM", label: "통신" },
  { value: "RENT", label: "임대료" },
  { value: "OUTSOURCING", label: "외주" },
  { value: "TAX", label: "세금" },
  { value: "INSURANCE", label: "보험" },
  { value: "ETC", label: "기타" },
];

function formatInput(text: string) {
  const num = text.replace(/[^0-9]/g, "");
  if (!num) return "";
  return parseInt(num).toLocaleString();
}

export default function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const { t } = useTheme();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CreateExpenseRequestCategory>("ETC");
  const [memo, setMemo] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const createMutation = useCreateExpense({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetExpensesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMonthlySummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetYearlySummaryQueryKey() });
        showToast("지출이 등록되었습니다!");
        onClose();
      },
      onError: () => {
        showToast("지출 등록에 실패했습니다", "error");
      },
    },
  });

  const handleSubmit = () => {
    const numAmount = parseInt(amount.replace(/,/g, "")) || 0;
    if (!title.trim()) {
      showToast("항목명을 입력해주세요", "error");
      return;
    }
    if (numAmount <= 0) {
      showToast("금액을 입력해주세요", "error");
      return;
    }
    createMutation.mutate({
      data: {
        title: title.trim(),
        amount: numAmount,
        expenseDate: today,
        category,
        isDeductible: true,
        memo: memo.trim() || undefined,
      },
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ backgroundColor: t.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: insets.bottom + 16, maxHeight: "90%" }}>
        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mt-3" />
        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          <Text style={{ color: t.text }} className="text-2xl font-bold">지출 등록</Text>

          <Text style={{ color: t.textSecondary }} className="text-sm font-medium mt-6 mb-2">항목명</Text>
          <TextInput
            className="rounded-2xl px-4 py-3.5 text-base"
            style={{ backgroundColor: t.inputBg, color: t.text }}
            placeholder="예: 노트북 구매"
            placeholderTextColor={t.textMuted}
            value={title}
            onChangeText={setTitle}
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

          <Text style={{ color: t.textSecondary }} className="text-sm font-medium mt-4 mb-2">카테고리</Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.value}
                onPress={() => setCategory(cat.value)}
                className="px-3 py-2 rounded-xl"
                style={{
                  backgroundColor: category === cat.value
                    ? tintBg(colors.primary[600], 0.15)
                    : t.inputBg,
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: category === cat.value ? t.primaryText : t.textSecondary,
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
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

          <View className="mt-6 mb-2">
            <Button title="등록하기" onPress={handleSubmit} loading={createMutation.isPending} />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
