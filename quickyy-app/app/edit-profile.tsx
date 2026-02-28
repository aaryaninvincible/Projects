import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../src/context/AppContext';
import { useThemeSettings } from '../src/context/ThemeContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const { colors } = useThemeSettings();

  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    router.back();
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow gallery access to set profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setForm((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoWrap}>
          <Image source={{ uri: form.avatar }} style={[styles.photo, { borderColor: colors.border }]} />
          <Pressable style={[styles.photoBtn, { backgroundColor: colors.secondary }]} onPress={handlePickPhoto}>
            <Text style={styles.photoBtnText}>Choose From Gallery</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, { color: colors.textMuted }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          value={form.name}
          onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
        <TextInput
          autoCapitalize="none"
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Phone</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          value={form.phone}
          onChangeText={(phone) => setForm((prev) => ({ ...prev, phone }))}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>College / Campus</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          value={form.college}
          onChangeText={(college) => setForm((prev) => ({ ...prev, college }))}
        />

        <Pressable style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  photoWrap: { alignItems: 'center', marginBottom: 20 },
  photo: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, marginBottom: 10 },
  photoBtn: { borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  photoBtnText: { color: '#fff', fontWeight: '700' },
  label: { marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 20 },
  saveButton: { marginTop: 8, borderRadius: 12, padding: 16, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
