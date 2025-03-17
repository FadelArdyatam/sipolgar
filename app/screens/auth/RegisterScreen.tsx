import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { register } from "../../store/auth/authSlice";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ChevronLeft,
} from "lucide-react-native";
import { format } from "date-fns";
import { getParentSatuanKerja, getChildSatuanKerja } from "../../services/AuthServices";
import type { AppDispatch } from "../../store";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import type { SatuanKerjaParent, SatuanKerjaChild } from "../../types/user";
import { Input } from "../../components/input";
import { DatePicker } from "../../components/datepicker";
import { SatuanKerjaPicker } from "../../components/satuan-kerja";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  // Form state
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    no_hp: "",
    tempat_lahir: "",
    password: "",
    confirmPassword: "",
    satuan_kerja_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tanggal_lahir, setTanggalLahir] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  
  // Satuan Kerja state
  const [parentSatuanKerja, setParentSatuanKerja] = useState<SatuanKerjaParent[]>([]);
  const [childSatuanKerja, setChildSatuanKerja] = useState<SatuanKerjaChild[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [id_satuankerja, setIdSatuankerja] = useState<number | null>(null);
  const [selectedSatuanKerjaName, setSelectedSatuanKerjaName] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  // Handle form input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Fetch parent satuan kerja on mount
  useEffect(() => {
    const fetchParentSatuanKerja = async () => {
      try {
        setFetchingData(true);
        const data = await getParentSatuanKerja();
        if (data.length === 0) {
          Alert.alert("Warning", "No parent satuan kerja data available");
        }
        setParentSatuanKerja(data);
      } catch (error) {
        console.error("Failed to fetch parent satuan kerja:", error);
        Alert.alert("Error", "Failed to load satuan kerja data. Please check your connection and try again.");
      } finally {
        setFetchingData(false);
      }
    };

    fetchParentSatuanKerja();
  }, []);

  // Fetch child satuan kerja when parent is selected
  useEffect(() => {
    const fetchChildSatuanKerja = async () => {
      if (selectedParentId) {
        try {
          setFetchingData(true);
          const data = await getChildSatuanKerja(selectedParentId);
          setChildSatuanKerja(data);
          if (data.length === 0) {
            // If no children are found, use the parent ID as the satuan kerja ID
            setIdSatuankerja(selectedParentId);
          }
        } catch (error) {
          console.error(`Failed to fetch child satuan kerja for parent ID ${selectedParentId}:`, error);
          Alert.alert("Error", "Failed to load child satuan kerja data");
        } finally {
          setFetchingData(false);
        }
      } else {
        setChildSatuanKerja([]);
      }
    };

    fetchChildSatuanKerja();
  }, [selectedParentId]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Check required fields
    const requiredFields = [
      { key: 'nama_lengkap', label: 'Nama Lengkap' },
      { key: 'username', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'no_hp', label: 'Nomor HP' },
      { key: 'tempat_lahir', label: 'Tempat Lahir' },
      { key: 'password', label: 'Password' },
      { key: 'confirmPassword', label: 'Konfirmasi Password' }
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field.key]) {
        newErrors[field.key] = `${field.label} tidak boleh kosong`;
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    // Check satuan kerja
    if (!id_satuankerja) {
      newErrors.satuan_kerja = 'Pilih satuan kerja';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle satuan kerja selection
  const handleSelectParent = (parentId: number) => {
    setSelectedParentId(parentId);
    const parent = parentSatuanKerja.find((item) => item.id === parentId);
    if (parent) {
      setSelectedSatuanKerjaName(parent.nama_satuan_kerja);
    }
    setIdSatuankerja(null);
  };

  const handleSelectChild = (childId: number) => {
    setIdSatuankerja(childId);
    const child = childSatuanKerja.find((item) => item.id === childId);
    if (child) {
      setSelectedSatuanKerjaName(child.nama_satuan_kerja);
    }
  };

  // Registration submit handler
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const formattedDate = format(tanggal_lahir, "yyyy-MM-dd");
    setLoading(true);
    
    try {
      const result = await dispatch(
        register({
          nama_lengkap: formData.nama_lengkap,
          username: formData.username,
          email: formData.email,
          no_hp: formData.no_hp,
          tempat_lahir: formData.tempat_lahir,
          tanggal_lahir: formattedDate,
          id_satuankerja: id_satuankerja as number,
          password: formData.password,
        }),
      ).unwrap();

      Alert.alert("Sukses", result.message || "Registrasi berhasil. Silahkan cek email Anda untuk verifikasi.", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("EmailVerification");
          },
        },
      ]);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Registrasi Gagal", error instanceof Error ? error.message : "Silahkan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData && parentSatuanKerja.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text className="mt-4 text-gray-500">Memuat data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6">
          {/* Header with back button */}
          <TouchableOpacity 
            className="p-2 mb-4 -ml-2 w-12 h-12 justify-center items-center rounded-full" 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft color="#4b5563" size={24} />
          </TouchableOpacity>
          
          {/* Logo and Title */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-amber-500 rounded-full items-center justify-center mb-4 shadow-md">
              <Text className="text-white text-3xl font-bold">S</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">Buat Akun</Text>
            <Text className="text-gray-500 text-center mt-2">Daftar untuk mulai menggunakan Sipolgar</Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4 mb-6">
            <Input
              label="Nama Lengkap"
              leftIcon={<User size={20} color="#6b7280" />}
              placeholder="Nama Lengkap"
              value={formData.nama_lengkap}
              onChangeText={(value) => handleChange('nama_lengkap', value)}
              error={errors.nama_lengkap}
            />

            <Input
              label="NRP/Username"
              leftIcon={<User size={20} color="#6b7280" />}
              placeholder="NRP/Username"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              autoCapitalize="none"
              error={errors.username}
            />

            <Input
              label="Email"
              leftIcon={<Mail size={20} color="#6b7280" />}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Nomor HP"
              leftIcon={<Phone size={20} color="#6b7280" />}
              placeholder="Nomor HP"
              value={formData.no_hp}
              onChangeText={(value) => handleChange('no_hp', value)}
              keyboardType="phone-pad"
              error={errors.no_hp}
            />

            <Input
              label="Tempat Lahir"
              leftIcon={<MapPin size={20} color="#6b7280" />}
              placeholder="Tempat Lahir"
              value={formData.tempat_lahir}
              onChangeText={(value) => handleChange('tempat_lahir', value)}
              error={errors.tempat_lahir}
            />

            <DatePicker
              label="Tanggal Lahir"
              value={tanggal_lahir}
              onChange={setTanggalLahir}
            />

            <SatuanKerjaPicker
              label="Satuan Kerja"
              selectedName={selectedSatuanKerjaName}
              parentSatuanKerja={parentSatuanKerja}
              childSatuanKerja={childSatuanKerja}
              selectedParentId={selectedParentId}
              selectedChildId={id_satuankerja}
              onSelectParent={handleSelectParent}
              onSelectChild={handleSelectChild}
              isLoading={fetchingData}
            />
            {errors.satuan_kerja && (
              <Text className="text-red-500 text-sm -mt-2">{errors.satuan_kerja}</Text>
            )}

            <Input
              label="Password"
              leftIcon={<Lock size={20} color="#6b7280" />}
              rightIcon={showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              onRightIconPress={() => setShowPassword(!showPassword)}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
              error={errors.password}
            />

            <Input
              label="Konfirmasi Password"
              leftIcon={<Lock size={20} color="#6b7280" />}
              placeholder="Konfirmasi Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showPassword}
              error={errors.confirmPassword}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className={`bg-amber-500 py-4 rounded-lg items-center shadow-sm ${loading ? "opacity-70" : ""}`}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Mendaftar...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-lg">Daftar</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} activeOpacity={0.7}>
              <Text className="text-amber-500 font-medium">Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}