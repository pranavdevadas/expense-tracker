import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { login, register } from "@/firebase/authService";
import { createUser } from "@/firebase/userService";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isLogin) {
      // LOGIN
      try {
        const { user } = await login(formData.email, formData.password);
        console.log("Logged in user:", user);
        Alert.alert("Success", "Login successful!");
        router.replace("/(tabs)/Home");
      } catch (error: any) {
        Alert.alert("Login Error", error.message);
      }
    } else {
      // REGISTER
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      try {
        const { user } = await register(formData.email, formData.password);

        await createUser({
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          balance: 0,
          createdAt: new Date(),
        });

        Alert.alert("Success", "Registration successful!");
        setIsLogin(true);
      } catch (error: any) {
        Alert.alert("Registration Error", error.message);
      }
    }
  };



  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Container - Centered */}
          <View className="px-6">
            {/* Header - Centered */}
            <View className="items-center mb-10">
              <Text className="text-4xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </Text>
              <Text className="text-gray-500 text-base text-center">
                {isLogin
                  ? "Sign in to continue to your account"
                  : "Sign up to get started with our service"}
              </Text>
            </View>

            {/* Form Container */}
            <View>
              {!isLogin && (
                <>
                  {/* Name Input */}
                  <View className="mb-5">
                    <Text className="text-gray-700 mb-2 font-medium">
                      Full Name
                    </Text>
                    <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                      <FontAwesome name="user" size={20} color="#6B7280" />
                      <TextInput
                        className="flex-1 ml-3 text-gray-900 text-base"
                        placeholder="John Doe"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-gray-700 mb-2 font-medium">
                  Email Address
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={22}
                    color="#6B7280"
                  />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 text-base"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-5">
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                  <FontAwesome name="lock" size={22} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900 text-base"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2"
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                // Confirm Password Input
                <View className="mb-7">
                  <Text className="text-gray-700 mb-2 font-medium">
                    Confirm Password
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                    <FontAwesome name="lock" size={22} color="#6B7280" />
                    <TextInput
                      className="flex-1 ml-3 text-gray-900 text-base"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChangeText={(text) =>
                        handleChange("confirmPassword", text)
                      }
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="p-2"
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={22}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                className="bg-blue-600 rounded-xl py-4 mb-8"
                onPress={handleSubmit}
                activeOpacity={0.9}
              >
                <Text className="text-white text-center font-bold text-lg">
                  {isLogin ? "Sign In" : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Toggle between Login/Register */}
              <View className="flex-row justify-center items-center">
                <Text className="text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </Text>
                <TouchableOpacity
                  className="ml-2"
                  onPress={() => setIsLogin(!isLogin)}
                >
                  <Text className="text-blue-600 font-bold">
                    {isLogin ? "Sign Up" : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Auth;
