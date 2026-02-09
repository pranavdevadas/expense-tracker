import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import UploadOptionsModal from "../../components/UploadOptionsModal";
import BillPreview from "../../components/BillPreview";
import { getUserById, updateBalance } from "@/services/userService";
import { extractBillTotal } from "@/services/ocrService";
import { auth } from "@/firebase/firebaseConfig";
import { showError, showSuccess } from "@/components/Toast";

const UploadBill = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const handleImageSelected = async (imageUri: string) => {
    setImage(imageUri);
    await processBill(imageUri);
  };

  const processBill = async (imageUri: string) => {
    setIsProcessing(true);
    setTotalAmount(0);

    try {
      const total = await extractBillTotal(imageUri);

      if (!total || total <= 0) {
        throw new Error("Total not found");
      }

      setTotalAmount(total);
      showSuccess("Bill processed successfully!");
    } catch (error) {
      showError(
        "Could not extract total amount from the bill. Please try again.",
      );
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitExpense = async () => {
    if (totalAmount <= 0) {
      showError("No valid amount found in the bill");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      showError("User not authenticated");
      return;
    }

    try {
      const userData = await getUserById(user.uid);

      if (!userData) {
        showError("User data not found");
        return;
      }

      if (totalAmount > userData.balance) {
        showError("Insufficient balance for this expense");
        return;
      }

      await updateBalance(user.uid, -totalAmount);

      showSuccess(`₹${totalAmount.toFixed(2)} deducted from your balance`);
      setImage(null);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error submitting expense:", error);
      showError("Failed to submit expense. Try again");
    }
  };

  const cancelUpload = () => {
    setImage(null);
    setTotalAmount(0);
    setIsProcessing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          <View className="pt-8 pb-10 items-center">
            <Text className="text-4xl font-bold text-gray-900 text-center">
              Upload Bill
            </Text>
            <Text className="text-gray-500 text-center mt-3 text-base">
              Capture or upload bill to extract total amount
            </Text>
          </View>

          <View className="flex-1 justify-center">
            {!image ? (
              <View className="items-center">
                <View className="w-52 h-52 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 justify-center items-center mb-10">
                  <MaterialCommunityIcons
                    name="receipt"
                    size={90}
                    color="#3B82F6"
                  />
                </View>

                <View className="items-center mb-10">
                  <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
                    Upload Your Bill
                  </Text>
                  <Text className="text-gray-500 text-center text-base px-4 leading-relaxed">
                    Take a photo or upload from gallery to automatically extract
                    the total amount
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl py-6 px-12 flex-row items-center shadow-lg"
                  onPress={() => setShowUploadOptions(true)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="upload"
                    size={28}
                    color="black"
                    className="mt-3"
                  />
                  <Text className="font-bold text-2xl ml-4 mt-3">
                    Upload Bill
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <BillPreview
                image={image}
                totalAmount={totalAmount}
                isProcessing={isProcessing}
                onRetakePhoto={() => setShowUploadOptions(true)}
                onSubmitExpense={submitExpense}
                onCancelUpload={cancelUpload}
              />
            )}

            {!image && (
              <View className="mt-16">
                <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <View className="flex-row items-center mb-4">
                    <MaterialCommunityIcons
                      name="lightbulb"
                      size={28}
                      color="#F59E0B"
                    />
                    <Text className="text-xl font-bold text-gray-900 ml-3">
                      Tips for Best Results
                    </Text>
                  </View>
                  <View className="space-y-3">
                    {[
                      "Ensure the total amount is clearly visible in the photo",
                      "Take photo in good lighting conditions",
                      "Keep the bill flat and avoid glare",
                      "Make sure numbers are not blurry",
                    ].map((tip, index) => (
                      <View key={index} className="flex-row items-start">
                        <Feather
                          name="check-circle"
                          size={20}
                          color="#10B981"
                          className="mt-1"
                        />
                        <Text className="text-gray-600 ml-3 flex-1 text-base">
                          {tip}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <UploadOptionsModal
        visible={showUploadOptions}
        onClose={() => setShowUploadOptions(false)}
        onImageSelected={handleImageSelected}
      />
    </SafeAreaView>
  );
};

export default UploadBill;
