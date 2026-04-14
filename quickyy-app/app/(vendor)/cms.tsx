import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, Pressable, Platform, StatusBar } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from '../../src/lib/firebase';

export default function VendorCMS() {
  const { vendorDetails, uid } = useAuth();
  const { addNotification } = useApp();
  
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productVeg, setProductVeg] = useState(true);

  const handlePublish = async () => {
    if (!productName || !productPrice || !uid || !firebaseDb) {
      addNotification('Error', 'Please enter required fields to publish.');
      return;
    }

    try {
      const prodId = 'm_' + Date.now();
      const productRef = doc(firebaseDb, 'vendors', uid, 'products', prodId);
      
      await setDoc(productRef, {
        id: prodId,
        name: productName,
        price: parseInt(productPrice),
        desc: productDesc,
        veg: productVeg,
        image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80' // Mock default
      });

      setProductName('');
      setProductPrice('');
      setProductDesc('');
      addNotification('Success! 🎉', `${productName} added to your live menu!`);
    } catch (e) {
      console.error(e);
      addNotification('Error', 'Failed to publish product updates');
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title]}>Shop CMS</Text>
        <Text style={styles.subtitle}>{vendorDetails?.name || 'Your Canteen'}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Upload Products */}
        <View style={styles.sectionCard}>
           <View style={[styles.sectionHeader, {justifyContent: 'space-between'}]}>
             <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
               <Ionicons name="fast-food" size={24} color={colors.primary} />
               <Text style={styles.sectionTitle}>Add Products</Text>
             </View>
             <Pressable style={styles.excelBtn} onPress={() => {}}>
               <Ionicons name="document-text" size={16} color={colors.surface} />
               <Text style={styles.excelBtnText}>Excel Upload</Text>
             </Pressable>
           </View>
           <View style={styles.imageUploader}>
             <Ionicons name="camera" size={30} color={colors.textMuted} />
             <Text style={styles.uploadText}>Upload Food Image</Text>
           </View>
            <TextInput 
              style={styles.input} 
              placeholder="Product Name" 
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Price (₹)" 
              keyboardType="numeric" 
              value={productPrice}
              onChangeText={setProductPrice}
            />
            <TextInput 
              style={[styles.input, {height: 60}]} 
              placeholder="Description" 
              multiline 
              value={productDesc}
              onChangeText={setProductDesc}
            />
            <Pressable 
              style={[styles.input, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]} 
              onPress={() => setProductVeg(!productVeg)}
            >
              <Text style={{color: colors.text}}>Vegetarian?</Text>
              <Ionicons name={productVeg ? "checkbox" : "square-outline"} size={22} color={productVeg ? "green" : colors.textMuted} />
            </Pressable>

            <Pressable style={styles.btnPrimary} onPress={handlePublish}>
               <Text style={styles.btnText}>Publish Product</Text>
            </Pressable>
         </View>

        {/* Create Offers */}
        <View style={styles.sectionCard}>
           <View style={styles.sectionHeader}>
             <Ionicons name="pricetag" size={24} color={colors.accent} />
             <Text style={styles.sectionTitle}>Create Timed Offer</Text>
           </View>
           <TextInput style={styles.input} placeholder="Offer Title (e.g. 50% Off Maggi)" />
           <View style={{flexDirection: 'row', gap: 10, marginBottom: 16}}>
             <TextInput style={[styles.input, {flex: 1, marginBottom: 0}]} placeholder="Hours valid" keyboardType="numeric" />
             <Pressable style={[styles.btnPrimary, {flex: 1, marginTop: 0, backgroundColor: colors.accent}]}>
                <Text style={styles.btnText}>Start Timer</Text>
             </Pressable>
           </View>
        </View>

        {/* Banner Upload */}
        <View style={styles.sectionCard}>
           <View style={styles.sectionHeader}>
             <Ionicons name="image" size={24} color={colors.text} />
             <Text style={styles.sectionTitle}>Upload Home Banner</Text>
           </View>
           <View style={[styles.imageUploader, { height: 120, borderStyle: 'solid', borderColor: colors.primary }]}>
             <Ionicons name="cloud-upload" size={30} color={colors.primary} />
             <Text style={[styles.uploadText, {color: colors.primary}]}>Select 16:9 Promo Image</Text>
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: 4 },
  content: { flex: 1, padding: 16 },
  sectionCard: { backgroundColor: colors.surface, padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  imageUploader: { height: 100, backgroundColor: colors.background, borderRadius: 12, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  uploadText: { color: colors.textMuted, marginTop: 8 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.text },
  btnPrimary: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
  excelBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, gap: 4 },
  excelBtnText: { color: colors.surface, fontWeight: 'bold', fontSize: 12 }
});
