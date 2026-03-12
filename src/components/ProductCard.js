import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONTS } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { getProductPrice as calcProductPrice, getProductImage, decodeHTML } from '../services/woocommerce';

const ProductCard = ({ product, onPress }) => {
  const { addToCart } = useCart();

  const pricing = calcProductPrice(product);
  const imageUrl = getProductImage(product);

  const brand =
    product?.brands ||
    product?.attributes?.find((a) => a.name === 'Brand')?.options?.[0] ||
    '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {product?.on_sale && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Sale</Text>
        </View>
      )}

      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.info}>
        {brand ? (
          <Text style={styles.brand} numberOfLines={1}>
            {decodeHTML(brand)}
          </Text>
        ) : null}

        <Text style={styles.name} numberOfLines={2}>
          {decodeHTML(product?.name || '')}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>৳{Math.round(pricing.current || 0)}</Text>

          {pricing.onSale && (
            <Text style={styles.oldPrice}>৳{Math.round(pricing.regular || 0)}</Text>
          )}

          {pricing.onSale && pricing.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{pricing.discount}%</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            addToCart(product);
          }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={COLORS.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>ADD TO CART</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    overflow: 'hidden',
    ...COLORS.shadow,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 2,
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    ...FONTS.bold,
    color: COLORS.tagColor,
  },
  imageContainer: {
    height: 130,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 10,
  },
  brand: {
    fontSize: 9,
    ...FONTS.bold,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    ...FONTS.semibold,
    color: COLORS.text,
    lineHeight: 16,
    height: 32,
    marginBottom: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    ...FONTS.extrabold,
    color: COLORS.accent,
  },
  oldPrice: {
    fontSize: 11,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  discountBadge: {
    backgroundColor: '#E74C3C15',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 5,
  },
  discountText: {
    fontSize: 9,
    ...FONTS.bold,
    color: COLORS.sale,
  },
  addBtn: {
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 10,
    ...FONTS.bold,
    color: '#fff',
    letterSpacing: 0.5,
  },
});

export default ProductCard;