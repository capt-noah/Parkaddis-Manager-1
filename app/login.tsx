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
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import Loader from '../components/Loader';

export default function Login() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter your clerk email and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error || "Authentication failed.");
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
                  Clerk Authentication
                </Text>
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-2 text-center">
                  Enter your clerk credentials to operate the gate
                </Text>
              </View>

              <View className="p-8 gap-8">
                <View className="gap-6">
                  <View>
                    <Text className="text-sm font-medium text-slate-700 mb-2 px-1">
                      Clerk Email
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
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#cbd5e1"
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
                        placeholder="••••••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#cbd5e1"
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

                <View className="pt-4">
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
                          Login as Clerk
                        </Text>
                        <ArrowRight size={20} color="white" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <View className="items-center pt-4 border-t border-slate-100 flex-row justify-center gap-1">
                  <Text className="text-slate-500 text-sm">
                    Need a new clerk account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text className="text-primary font-bold text-sm">
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="mt-12 items-center pb-8 gap-4">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
                © 2024 ParkAddis Clerk Operations. All rights reserved.
              </Text>
              <View className="flex-row items-center gap-4 opacity-60">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  V 2.4.1-STABLE
                </Text>
                <Text className="text-slate-400 text-[10px] font-bold">•</Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  NODE: ADDIS_GATE_01
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
