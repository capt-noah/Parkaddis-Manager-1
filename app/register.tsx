import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  User,
  Mail,
  Smartphone,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';

export default function Register() {
  const router = useRouter();
  const { register, user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading]);

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [assignedLocationId, setAssignedLocationId] = React.useState("");
  const [shiftStartTime, setShiftStartTime] = React.useState("08:00");
  const [shiftEndTime, setShiftEndTime] = React.useState("16:00");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !assignedLocationId ||
      !shiftStartTime ||
      !shiftEndTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await register({
      fullName,
      email,
      phoneNumber,
      password,
      assignedLocationId,
      shiftStartTime,
      shiftEndTime,
      role: "employee",
      userType: "employee",
    });

    setIsSubmitting(false);

    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-lg">
            <View className="items-center mb-10">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="w-12 h-12 bg-primary rounded-lg items-center justify-center shadow-lg shadow-primary/20">
                  <Text className="text-white font-headline font-extrabold text-2xl tracking-tighter">
                    P
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-headline font-extrabold text-2xl tracking-tighter text-primary uppercase">
                    Park
                  </Text>
                  <Text className="font-headline font-extrabold text-2xl tracking-tighter text-slate-400 uppercase">
                    Addis
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white w-full rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <View className="bg-primary p-8 items-center border-b border-dashed border-white/20">
                <Text className="text-white font-headline text-2xl font-bold">
                  Clerk Registration
                </Text>
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-2 text-center">
                  Create an employee account for gate operations
                </Text>
              </View>

              <View className="p-8 gap-8">
                <View className="gap-6">
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Clerk Information
                  </Text>

                  <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                      Full Name
                    </Text>
                    <View className="relative justify-center">
                      <View className="absolute left-4 z-10">
                        <User size={20} color="#94a3b8" />
                      </View>
                      <TextInput
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                        placeholder="Abebe Bekele"
                        placeholderTextColor="#94a3b8"
                        value={fullName}
                        onChangeText={setFullName}
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                      Email Address
                    </Text>
                    <View className="relative justify-center">
                      <View className="absolute left-4 z-10">
                        <Mail size={20} color="#94a3b8" />
                      </View>
                      <TextInput
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                        placeholder="clerk@parkaddis.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#94a3b8"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                      Phone Number
                    </Text>
                    <View className="relative justify-center">
                      <View className="absolute left-4 z-10">
                        <Smartphone size={20} color="#94a3b8" />
                      </View>
                      <TextInput
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                        placeholder="0911223344"
                        placeholderTextColor="#94a3b8"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                      Assigned Location ID
                    </Text>
                    <TextInput
                      className="w-full pl-4 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                      placeholder="location-uuid-here"
                      placeholderTextColor="#94a3b8"
                      value={assignedLocationId}
                      onChangeText={setAssignedLocationId}
                    />
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                        Shift Start
                      </Text>
                      <TextInput
                        className="w-full pl-4 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                        placeholder="08:00"
                        placeholderTextColor="#94a3b8"
                        value={shiftStartTime}
                        onChangeText={setShiftStartTime}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                        Shift End
                      </Text>
                      <TextInput
                        className="w-full pl-4 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                        placeholder="16:00"
                        placeholderTextColor="#94a3b8"
                        value={shiftEndTime}
                        onChangeText={setShiftEndTime}
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                      Password
                    </Text>
                    <View className="relative justify-center">
                      <View className="absolute left-4 z-10">
                        <Lock size={20} color="#94a3b8" />
                      </View>
                      <TextInput
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-headline font-semibold focus:border-primary"
                        placeholder="••••••••"
                        secureTextEntry
                        placeholderTextColor="#94a3b8"
                        value={password}
                        onChangeText={setPassword}
                      />
                    </View>
                  </View>
                </View>

                {error && (
                  <View className="bg-red-50 p-4 rounded-xl flex-row items-center gap-3 border border-red-100">
                    <AlertCircle size={20} color="#dc2626" />
                    <Text className="text-red-600 text-xs font-bold flex-1">
                      {error}
                    </Text>
                  </View>
                )}

                <View className="pt-2">
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-primary flex-row items-center justify-center py-5 rounded-2xl shadow-xl shadow-primary/20 active:opacity-90 gap-2"
                  >
                    {isSubmitting ? (
                      <Loader size="sm" color="bg-white" />
                    ) : (
                      <>
                        <Text className="text-white font-headline font-bold text-base">
                          Register Clerk
                        </Text>
                        <CheckCircle size={20} color="white" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-center pt-2 gap-1 pb-4">
                  <Text className="text-slate-500 text-sm">
                    Already have a clerk account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text className="text-primary font-bold text-sm">
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="mt-12 items-center pb-8">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
                © 2024 ParkAddis Clerk Operations. All rights reserved.
              </Text>
              <View className="flex-row justify-center gap-6 mt-4">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Privacy Policy
                </Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Help Center
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
