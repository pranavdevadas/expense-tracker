import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native'
import React from 'react'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { logout } from "../firebase/firebaseConfig";
import { router } from "expo-router";

interface LogoutModalProps {
  visible: boolean
  onClose: () => void
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose
}) => {
  const handleLogout = () => {
    logout();
    onClose();
    router.replace("/");
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
              Logout
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-red-100 justify-center items-center mb-6">
              <MaterialIcons name="logout" size={36} color="#DC2626" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">
              Are you sure you want to logout?
            </Text>
            <Text className="text-gray-500 text-center text-sm">
              You will need to login again to access your account
            </Text>
          </View>

          {/* Yes Button */}
          <TouchableOpacity
            className="bg-red-500 rounded-xl py-4 items-center mb-4"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-lg">Yes, Logout</Text>
          </TouchableOpacity>

          {/* No Button */}
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
  )
}

export default LogoutModal