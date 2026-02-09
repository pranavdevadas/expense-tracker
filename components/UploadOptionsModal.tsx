import { Modal, View, Text, TouchableOpacity } from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { showError } from "@/components/Toast";

interface UploadOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
}

const UploadOptionsModal: React.FC<UploadOptionsModalProps> = ({
  visible,
  onClose,
  onImageSelected,
}) => {
  const requestPermissions = async () => {
    const [cameraPermission, mediaLibraryPermission] = await Promise.all([
      ImagePicker.requestCameraPermissionsAsync(),
      ImagePicker.requestMediaLibraryPermissionsAsync(),
    ]);

    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      showError("Please grant camera and gallery permissions to upload bills");
      return false;
    }
    return true;
  };

  const handleImageSelection = async (source: "camera" | "gallery") => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    onClose();

    try {
      let result;
      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      showError(
        `Failed to ${source === "camera" ? "take photo" : "select image"}`,
      );
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-2xl font-bold text-gray-900">
              Upload Bill
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Take Photo Option */}
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-2xl p-5 border border-blue-200 mb-4"
            onPress={() => handleImageSelection("camera")}
            activeOpacity={0.7}
          >
            <View className="w-14 h-14 rounded-full bg-blue-100 justify-center items-center mr-4">
              <MaterialCommunityIcons name="camera" size={28} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Take Photo
              </Text>
              <Text className="text-gray-500 text-sm">
                Use camera to capture bill
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Gap between options */}
          <View className="h-4" />

          {/* Choose from Gallery Option */}
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-2xl p-5 border border-purple-200 mb-8"
            onPress={() => handleImageSelection("gallery")}
            activeOpacity={0.7}
          >
            <View className="w-14 h-14 rounded-full bg-purple-100 justify-center items-center mr-4">
              <MaterialIcons name="photo-library" size={28} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Choose from Gallery
              </Text>
              <Text className="text-gray-500 text-sm">
                Select bill from photos
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-100 rounded-xl py-4 items-center"
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text className="text-gray-600 font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default UploadOptionsModal;
