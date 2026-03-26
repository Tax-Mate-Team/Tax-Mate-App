import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/tokens";
import { useAuth } from "../../../contexts/AuthContext";
import { useModal } from "../../../contexts/ModalContext";
import { QuickAction } from "../../../components";
import AddIncomeModal from "../../modals/AddIncomeModal";
import AddExpenseModal from "../../modals/AddExpenseModal";

export default function QuickActions() {
  const { isLoggedIn } = useAuth();
  const { openModal } = useModal();
  const navigation = useNavigation();

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
      return;
    }
    action();
  };

  return (
    <View className="flex-row mx-5 mt-5 gap-3">
      <QuickAction
        icon="add-circle"
        label="수입 등록"
        color={colors.primary[600]}
        onPress={() => requireAuth(() => openModal(AddIncomeModal))}
      />
      <QuickAction
        icon="remove-circle"
        label="지출 등록"
        color={colors.danger[500]}
        onPress={() => requireAuth(() => openModal(AddExpenseModal))}
      />
      <QuickAction
        icon="calculator"
        label="세금 계산"
        color={colors.success[500]}
      />
    </View>
  );
}
