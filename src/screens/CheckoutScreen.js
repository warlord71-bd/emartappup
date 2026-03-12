import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS } from "../theme/colors";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

const CheckoutScreen = ({ navigation }) => {
  const { items, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");

  const deliveryFee = cartTotal >= 2000 ? 0 : 80;
  const total = cartTotal + deliveryFee;

  const placeOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Missing Info", "Please fill all fields");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Cart Empty", "Please add items before placing order");
      return;
    }

    try {
      const response = await fetch(
        "https://e-mart.com.bd/wp-json/wc/v3/orders?consumer_key=ck_89c750a6f193609e73a672d84d28662783028a79&consumer_secret=cs_b6f0924fbc7dc9a10c328faee72feb29dc422279",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method: payment,
            payment_method_title: payment,
            set_paid: false,

            billing: {
              first_name: name,
              phone: phone,
              address_1: address,
              country: "BD",
            },

            shipping: {
              first_name: name,
              address_1: address,
              country: "BD",
            },

            line_items: items.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!data.id) {
        throw new Error("WooCommerce order failed");
      }

      // Save locally for MyOrdersScreen
      const newOrder = addOrder({
        customerName: name,
        phone,
        address,
        paymentMethod: payment,
        items,
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        total: `৳${Math.round(total)}`,
        products: items.map((item) => item.name).join(", "),
        image: items[0]?.image || null,
      });

      clearCart();

      navigation.navigate("OrderSuccess", {
        orderId: data.id,
      });

    } catch (error) {
      Alert.alert("Order Error", "Failed to place order");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Checkout</Text>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Payment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <TouchableOpacity
          style={styles.payOption}
          onPress={() => setPayment("cod")}
        >
          <Text style={styles.payText}>
            {payment === "cod" ? "● " : "○ "}Cash on Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.payOption}
          onPress={() => setPayment("bkash")}
        >
          <Text style={styles.payText}>
            {payment === "bkash" ? "● " : "○ "}Bkash Merchant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.payOption}
          onPress={() => setPayment("nagad")}
        >
          <Text style={styles.payText}>
            {payment === "nagad" ? "● " : "○ "}Nagad Merchant
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.row}>
          <Text>Items</Text>
          <Text>{items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
        </View>

        <View style={styles.row}>
          <Text>Subtotal</Text>
          <Text>৳{Math.round(cartTotal)}</Text>
        </View>

        <View style={styles.row}>
          <Text>Delivery</Text>
          <Text>{deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>৳{Math.round(total)}</Text>
        </View>
      </View>

      {/* Place Order */}
      <TouchableOpacity activeOpacity={0.9} onPress={placeOrder}>
        <LinearGradient
          colors={COLORS.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Place Order</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },

  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...COLORS.shadow,
  },

  sectionTitle: {
    fontSize: 15,
    ...FONTS.bold,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 13,
  },

  payOption: {
    paddingVertical: 8,
  },

  payText: {
    fontSize: 14,
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 15,
    ...FONTS.bold,
  },

  totalValue: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.accent,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    ...FONTS.bold,
  },
});

export default CheckoutScreen;