import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

interface BillPreviewProps {
  image: string;
  totalAmount: number;
  isProcessing: boolean;
  onRetakePhoto: () => void;
  onSubmitExpense: () => void;
  onCancelUpload: () => void;
}

const BillPreview: React.FC<BillPreviewProps> = ({
  image,
  totalAmount,
  isProcessing,
  onRetakePhoto,
  onSubmitExpense,
  onCancelUpload,
}) => {
  return (
    <View className="items-center">
      <View className="w-full mb-10">
        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-full h-72 rounded-2xl"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-4 right-4 bg-black/60 rounded-full p-3"
            onPress={onRetakePhoto}
          >
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View className="absolute inset-0 bg-black/60 rounded-2xl justify-center items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="font-bold text-xl mt-6 text-white">
              Extracting total amount...
            </Text>
          </View>
        )}
      </View>

      {!isProcessing && totalAmount > 0 && (
        <View className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-10 shadow-lg">
          <Text className="text-center text-xl mb-3 mt-2">
            Total Bill Amount
          </Text>
          <Text className="text-center text-6xl font-bold mb-2">
            ₹{totalAmount.toFixed(2)}
          </Text>
          <Text className="text-green-500 text-center text-base">
            Extracted from your bill
          </Text>
        </View>
      )}

      {!isProcessing && (
        <View className="w-full space-y-5">
          <TouchableOpacity
            className="bg-red-500 rounded-xl py-4 flex-row justify-center items-center mb-3"
            onPress={onSubmitExpense}
            disabled={totalAmount <= 0}
            style={{ opacity: totalAmount <= 0 ? 0.5 : 1 }}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={28}
              color="white"
            />
            <Text className="font-bold text-2xl ml-3 text-white">
              Submit Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-200 rounded-xl py-5 flex-row justify-center items-center"
            onPress={onCancelUpload}
          >
            <Feather name="x" size={28} color="#6B7280" />
            <Text className="text-gray-700 font-bold text-xl ml-3">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BillPreview;
