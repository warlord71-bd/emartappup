import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { getProducts, searchProducts, getProductsByCategory, getOnSaleProducts } from '../services/woocommerce';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const ProductsScreen = ({ navigation, route }) => {
  const { t } = useLanguage();
  const { categoryId, categoryName, search: initialSearch, onSale } = route.params || {};

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [sortBy, setSortBy] = useState('');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    loadProducts(1, true);
  }, [categoryId, onSale, sortBy]);

  const loadProducts = async (pageNum = 1, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    let result;
    let sortParams = '';
    if (sortBy === 'price_asc') sortParams = 'orderby=price&order=asc';
    else if (sortBy === 'price_desc') sortParams = 'orderby=price&order=desc';
    else if (sortBy === 'rating') sortParams = 'orderby=rating&order=desc';
    else if (sortBy === 'date') sortParams = 'orderby=date&order=desc';

    if (searchQuery) {
      result = await searchProducts(searchQuery, pageNum);
    } else if (categoryId) {
      result = await getProductsByCategory(categoryId, pageNum);
    } else if (onSale) {
      result = await getOnSaleProducts(pageNum);
    } else {
      result = await getProducts(pageNum, 20, sortParams);
    }

    if (result.data) {
      setProducts(prev => reset ? result.data : [...prev, ...result.data]);
      setHasMore(result.data.length >= 20);
      setPage(pageNum);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      searchProducts(query, 1).then(result => {
        if (result.data) {
          setProducts(result.data);
          setHasMore(result.data.length >= 20);
          setPage(1);
        }
      });
    } else {
      loadProducts(1, true);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) loadProducts(page + 1);
  };

  const sortOptions = [
    { key: '', label: t('sortByNewest') },
    { key: 'price_asc', label: t('sortByPrice') },
    { key: 'price_desc', label: t('sortByPriceDesc') },
    { key: 'rating', label: t('sortByRating') },
  ];

  const screenTitle = categoryName || (onSale ? t('flashDeals') : (searchQuery ? `"${searchQuery}"` : t('allProducts')));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{screenTitle}</Text>
          <Text style={styles.count}>{products.length} {t('items')}</Text>
        </View>
        <SearchBar onSearch={handleSearch} placeholder={t('searchPlaceholder')} />
        {/* Sort & Filter row */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterChip, showSort && styles.filterChipActive]} onPress={() => setShowSort(!showSort)}>
            <Ionicons name="swap-vertical" size={12} color={showSort ? '#fff' : COLORS.text} />
            <Text style={[styles.filterChipText, showSort && { color: '#fff' }]}>{t('sort')}</Text>
          </TouchableOpacity>
          {categoryId && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>{categoryName}</Text>
              <TouchableOpacity onPress={() => navigation.setParams({ categoryId: null, categoryName: null })}>
                <Ionicons name="close" size={12} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Sort Dropdown */}
        {showSort && (
          <View style={styles.sortDropdown}>
            {sortOptions.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortOption, sortBy === opt.key && styles.sortOptionActive]}
                onPress={() => { setSortBy(opt.key); setShowSort(false); }}
              >
                <Text style={[styles.sortOptionText, sortBy === opt.key && styles.sortOptionTextActive]}>{opt.label}</Text>
                {sortBy === opt.key && <Ionicons name="checkmark" size={14} color={COLORS.accent} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Product Grid */}
      {loading ? (
        <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ gap: 10, marginBottom: 10 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            </View>
          )}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={COLORS.accent} style={{ padding: 20 }} /> : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>🔍</Text>
              <Text style={styles.emptyText}>{t('noProducts')}</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: '#fff', paddingTop: 48, paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  backBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F5F3F7', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 17, ...FONTS.bold, color: COLORS.text },
  count: { fontSize: 11, color: COLORS.textSecondary },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F5F3F7' },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterChipText: { fontSize: 11, ...FONTS.semibold, color: COLORS.text },
  activeFilter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, backgroundColor: COLORS.tagBg },
  activeFilterText: { fontSize: 11, ...FONTS.semibold, color: COLORS.accent },
  sortDropdown: { marginTop: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sortOptionActive: { backgroundColor: COLORS.accentLight },
  sortOptionText: { fontSize: 12, color: COLORS.text },
  sortOptionTextActive: { ...FONTS.semibold, color: COLORS.accent },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
});

export default ProductsScreen;
