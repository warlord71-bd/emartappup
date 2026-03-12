import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { getParentCategories } from '../services/woocommerce';
import SearchBar from '../components/SearchBar';

const categoryIcons = ['🧴', '✨', '💧', '☀️', '🎭', '💋', '🧖', '💇', '🌿', '💅'];

const CategoriesScreen = ({ navigation }) => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const { data } = await getParentCategories();
    if (data) {
      setCategories(data);
      setFiltered(data);
    }
    setLoading(false);
  };

  const handleSearch = (query) => {
    if (!query) return setFiltered(categories);
    setFiltered(categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())));
  };

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Products', { categoryId: item.id, categoryName: item.name })}
    >
      <View style={styles.iconBox}>
        {item.image?.src ? (
          <Image source={{ uri: item.image.src }} style={styles.catImage} />
        ) : (
          <Text style={{ fontSize: 26 }}>{categoryIcons[index % categoryIcons.length]}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.catName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.catCount}>{item.count} {t('products')}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('categoriesTitle')}</Text>
        <SearchBar onSearch={handleSearch} placeholder={t('searchCategories')} />
      </View>
      {loading ? (
        <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              {renderCategory({ item, index })}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>{t('noProducts')}</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: '#fff', paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { fontSize: 20, ...FONTS.bold, color: COLORS.text, marginBottom: 10 },
  card: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    ...COLORS.shadow, borderWidth: 1, borderColor: COLORS.border,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.accentLight,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.tagBg,
  },
  catImage: { width: 30, height: 30, borderRadius: 8 },
  info: { flex: 1 },
  catName: { fontSize: 13, ...FONTS.bold, color: COLORS.text },
  catCount: { fontSize: 10, color: COLORS.textSecondary, marginTop: 1 },
  arrow: { fontSize: 18, color: COLORS.textLight },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, fontSize: 14 },
});

export default CategoriesScreen;
