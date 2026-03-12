import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useOrders } from "../context/OrderContext";
import { COLORS, FONTS } from "../theme/colors";

const MyOrdersScreen = ({ navigation }) => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>You have no orders yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>My Orders</Text>

      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Text style={styles.status}>{order.status}</Text>
          </View>

          <Text style={styles.date}>{order.date}</Text>

          <View style={styles.productRow}>
            {order.image ? (
              <Image source={{ uri: order.image }} style={styles.image} />
            ) : (
              <View style={styles.noImage} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.products}>{order.products}</Text>
              <Text style={styles.items}>{order.itemsCount} item(s)</Text>
              <Text style={styles.total}>Total: {order.total}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    ...FONTS.bold,
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    ...COLORS.shadow,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  orderId: {
    fontSize: 14,
    ...FONTS.bold,
  },

  status: {
    fontSize: 12,
    color: COLORS.accent,
  },

  date: {
    fontSize: 11,
    color: "#777",
    marginBottom: 10,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  noImage: {
    width: 60,
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 10,
  },

  products: {
    fontSize: 13,
    ...FONTS.semibold,
  },

  items: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  total: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.accent,
    marginTop: 4,
  },
});