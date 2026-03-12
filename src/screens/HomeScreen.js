import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONTS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

import {
  getOnSaleProducts,
  getLatestProducts,
  getParentCategories,
} from '../services/woocommerce';

import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { t, toggleLanguage, langLabel } = useLanguage();
  const { cartCount } = useCart();

  const [categories, setCategories] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Banner auto rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((i) => (i + 1) % 3);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [catRes, saleRes, newRes] = await Promise.all([
      getParentCategories(),
      getOnSaleProducts(),
      getLatestProducts(),
    ]);

    if (catRes.data) setCategories(catRes.data.slice(0, 8));
    if (saleRes.data) setSaleProducts(saleRes.data);
    if (newRes.data) setNewProducts(newRes.data);

    setLoading(false);
  };

  const banners = [
    {
      title: t('bannerSaleTitle'),
      sub: t('bannerSaleSub'),
      emoji: '🌸',
      colors: COLORS.gradientBanner,
    },
    {
      title: t('bannerNewTitle'),
      sub: t('bannerNewSub'),
      emoji: '🇯🇵',
      colors: ['#2D2B55', '#1B1B2F', '#E8739E'],
    },
    {
      title: t('bannerDeliveryTitle'),
      sub: t('bannerDeliverySub'),
      emoji: '🚚',
      colors: ['#1B1B2F', '#27AE60'],
    },
  ];

  const handleSearch = (query) => {
    navigation.navigate('Products', { search: query });
  };

  const categoryIcons = ['🧴', '✨', '💧', '☀️', '🎭', '💋', '🧖', '💇'];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={COLORS.gradientHeader} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />

            <View>
              <Text style={styles.appName}>eMart BD</Text>
              <Text style={styles.appTagline}>{t('appTagline')}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Language */}
            <TouchableOpacity style={styles.headerIcon} onPress={toggleLanguage}>
              <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700' }}>
                {langLabel === 'English' ? 'বাং' : 'EN'}
              </Text>
            </TouchableOpacity>

            {/* Notification */}
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="notifications-outline" size={18} color="#fff" />
            </TouchableOpacity>

            {/* Cart */}
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('CartTab')}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />

              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar onSearch={handleSearch} dark />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <View style={styles.bannerSection}>
          <LinearGradient
            colors={banners[bannerIndex].colors}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>
                {banners[bannerIndex].title}
              </Text>

              <Text style={styles.bannerSub}>{banners[bannerIndex].sub}</Text>

              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>{t('shopNow')} →</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.bannerEmoji}>{banners[bannerIndex].emoji}</Text>
          </LinearGradient>
        </View>

        {/* CATEGORIES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('shopByCategory')}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('CategoriesTab')}
            >
              <Text style={styles.seeAll}>{t('seeAll')} →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.accent} style={{ padding: 20 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat, i) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() =>
                    navigation.navigate('Products', {
                      categoryId: cat.id,
                      categoryName: cat.name,
                    })
                  }
                >
                  <View style={styles.categoryIcon}>
                    {cat.image?.src ? (
                      <Image
                        source={{ uri: cat.image.src }}
                        style={styles.categoryImage}
                      />
                    ) : (
                      <Text style={{ fontSize: 22 }}>
                        {categoryIcons[i % categoryIcons.length]}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* FLASH DEALS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('flashDeals')}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Products', { onSale: true })}
            >
              <Text style={styles.seeAll}>{t('seeAll')} →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.accent} />
          ) : (
            <FlatList
              data={saleProducts.slice(0, 6)}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ flex: 1, padding: 6 }}>
                  <ProductCard
                    product={item}
                    onPress={() =>
                      navigation.navigate('ProductDetail', { product: item })
                    }
                  />
                </View>
              )}
            />
          )}
        </View>

        {/* NEW PRODUCTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('newArrivals')}</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>{t('seeAll')} →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.accent} />
          ) : (
            <FlatList
              data={newProducts.slice(0, 6)}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ flex: 1, padding: 6 }}>
                  <ProductCard
                    product={item}
                    onPress={() =>
                      navigation.navigate('ProductDetail', { product: item })
                    }
                  />
                </View>
              )}
            />
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12 },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  logo: { width: 34, height: 34, borderRadius: 8 },

  appName: { fontSize: 16, ...FONTS.extrabold, color: '#fff' },

  appTagline: { fontSize: 8, color: 'rgba(255,255,255,0.7)' },

  headerRight: { flexDirection: 'row', gap: 8 },

  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadgeText: { fontSize: 9, color: '#fff' },

  bannerSection: { padding: 16 },

  banner: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bannerTitle: { fontSize: 18, ...FONTS.extrabold, color: '#fff' },

  bannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  bannerBtn: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },

  bannerBtnText: { fontSize: 10, color: '#fff' },

  bannerEmoji: { fontSize: 42 },

  section: { marginTop: 16 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  sectionTitle: { fontSize: 15, ...FONTS.bold, color: COLORS.text },

  seeAll: { fontSize: 12, color: COLORS.accent },

  categoryItem: { alignItems: 'center', marginRight: 14 },

  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryImage: { width: 32, height: 32 },
});

export default HomeScreen;