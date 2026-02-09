import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import LogoutModal from "@/components/LogoutModal";
import { getUserById, updateBalance } from "@/firebase/userService";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useFocusEffect } from "expo-router";

const Home = () => {
  const [balance, setBalance] = useState<number>(1000.0);
  const [incomeAmount, setIncomeAmount] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Add Income/Profit
  const addIncome = async () => {
    if (!incomeAmount || parseFloat(incomeAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid income amount");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const amount = parseFloat(incomeAmount);

    // Update balance
    await updateBalance(userId, amount);
    setBalance((prev) => prev + amount);
    setIncomeAmount("");

    Alert.alert(
      "Success",
      `Income of ₹${amount.toFixed(2)} added successfully!`,
    );
  };

  // Add Expense
  const addExpense = async () => {
    if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid expense amount");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const amount = parseFloat(expenseAmount);

    if (amount > balance) {
      Alert.alert("Error", "Insufficient balance for this expense");
      return;
    }
    await updateBalance(userId, -amount);
    setBalance((prev) => prev - amount);
    setExpenseAmount("");

    Alert.alert(
      "Expense Added",
      `Expense of ₹${amount.toFixed(2)} added successfully!`,
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  useFocusEffect(
  useCallback(() => {
    const user = auth.currentUser;
    if (!user) return;

    let isActive = true;

    const fetchBalance = async () => {
      const data = await getUserById(user.uid);
      if (data && isActive) {
        setBalance(data.balance);
      }
    };

    fetchBalance();

    return () => {
      isActive = false;
    };
  }, []),
);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-6 pt-10 pb-6">
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Expense Tracker
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Manage your finances easily
          </Text>
        </View>

        <View className="px-6 mb-10">
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 shadow-lg">
            <Text className="text-lg mb-2 text-start ml-2">Available Balance</Text>
            <Text className="text-5xl font-bold text-start ml-2">
              ₹{balance.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="px-6 mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 rounded-full bg-green-100 justify-center items-center mr-4">
                <MaterialCommunityIcons
                  name="cash-plus"
                  size={28}
                  color="#059669"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  Add Income
                </Text>
                <Text className="text-gray-500 text-sm">
                  Add money to your balance
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <View className="flex-1 mr-3">
                <TextInput
                  className="bg-gray-50 rounded-xl px-5 py-4 text-xl font-semibold text-gray-900 border border-gray-300"
                  placeholder="0.00"
                  value={incomeAmount}
                  onChangeText={setIncomeAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <TouchableOpacity
                className="bg-green-500 rounded-xl px-8 py-4 flex-row items-center"
                onPress={addIncome}
                activeOpacity={0.8}
              >
                <FontAwesome name="plus" size={20} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 rounded-full bg-red-100 justify-center items-center mr-4">
                <MaterialCommunityIcons
                  name="cash-minus"
                  size={28}
                  color="#DC2626"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  Add Expense
                </Text>
                <Text className="text-gray-500 text-sm">
                  Record your spending
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <TextInput
                className="bg-gray-50 rounded-xl px-5 py-4 text-xl font-semibold text-gray-900 border border-gray-300 mb-4"
                placeholder="0.00"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity
                className="bg-red-500 rounded-xl py-4 flex-row justify-center items-center"
                onPress={addExpense}
                disabled={!expenseAmount}
                style={{ opacity: !expenseAmount ? 0.6 : 1 }}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="white"
                />
                <Text className="text-white font-bold text-xl ml-3">
                  Submit Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="items-center">
            <TouchableOpacity
              className="bg-gray-800 rounded-xl py-4 flex-row justify-center items-center mt-6 w-48"
              onPress={() => setShowLogoutModal(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="logout" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-3">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LogoutModal
          visible={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
