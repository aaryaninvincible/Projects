import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { typography } from '../../src/theme/typography';
import { useAuth } from '../../src/context/AuthContext';
import { useThemeSettings } from '../../src/context/ThemeContext';

export default function VendorRegister() {
  const router = useRouter();
  const { registerAsVendor } = useAuth();
  const { colors } = useThemeSettings();

  const [form, setForm] = useState({
    name: '',
    block: '',
    phone: '',
    imageUri: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    if(!form.name || !form.block) {
      alert("Please enter Canteen Name and Block Location.");
      return;
    }
    
    // Fallback image if none provided
    const image = form.imageUri || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80';
    
    await registerAsVendor({
      ...form, 
      imageUri: image,
      rating: 5.0,
      reviews: 0
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.h2, styles.title, { color: colors.text }]}>Vendor Registration</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
         <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="image-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.imageText, { color: colors.textMuted }]}>Upload Shop Image</Text>
         </View>

         <View style={styles.form}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Canteen Name <Text style={{color: 'red'}}>*</Text></Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
              placeholder="e.g. Block A Juice Shop" 
              value={form.name}
              onChangeText={(t) => setForm({...form, name: t})}
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>Building / Block Location <Text style={{color: 'red'}}>*</Text></Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
              placeholder="e.g. Mechanical Block Ground Floor"
              value={form.block}
              onChangeText={(t) => setForm({...form, block: t})}
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>Phone Number</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
              placeholder="+91 98765 43210" 
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => setForm({...form, phone: t})}
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>Business Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="canteen@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              placeholder="Minimum 6 characters"
              secureTextEntry
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
            />

            <Pressable style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleRegister}>
               <Text style={styles.submitText}>Complete Registration</Text>
            </Pressable>
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: {},
  content: { flex: 1, padding: 16 },
  imagePlaceholder: { height: 160, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  imageText: { marginTop: 8, fontWeight: '500' },
  form: { paddingBottom: 40 },
  label: { marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16 },
  submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 }
});
