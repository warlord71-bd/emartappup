import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { COLORS, FONTS } from "../theme/colors";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/woocommerce";

export default function CheckoutScreen({ navigation }) {

  const { items, cartTotal, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [payment, setPayment] = useState("cod");
  const [trxId, setTrxId] = useState("");

  const deliveryFee = cartTotal >= 2000 ? 0 : 80;
  const total = cartTotal + deliveryFee;

  const placeOrder = async () => {

    if (!name || !phone || !address) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    if ((payment === "bkash" || payment === "nagad") && !trxId) {
      Alert.alert("Transaction ID required");
      return;
    }

    const lineItems = items.map(i => ({
      product_id: i.id,
      quantity: i.quantity
    }));

    const orderData = {
      payment_method: payment,
      payment_method_title:
        payment === "cod"
          ? "Cash on Delivery"
          : payment === "bkash"
          ? "bKash"
          : "Nagad",

      set_paid: payment !== "cod",

      billing: {
        first_name: name,
        phone: phone,
        address_1: address
      },

      shipping: {
        first_name: name,
        address_1: address
      },

      customer_note:
        payment === "cod"
          ? "Cash on Delivery"
          : `${payment} Transaction ID: ${trxId}`,

      line_items: lineItems
    };

    const res = await createOrder(orderData);

    if (res.error) {
      Alert.alert("Order failed", res.error);
      return;
    }

    clearCart();

    Alert.alert(
      "Order Placed!",
      "Your order has been placed successfully.",
      [{ text: "OK", onPress: () => navigation.navigate("HomeTab") }]
    );
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Checkout</Text>

      {/* CUSTOMER INFO */}

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Delivery Address"
        style={[styles.input, { height: 80 }]}
        value={address}
        onChangeText={setAddress}
        multiline
      />

      {/* PAYMENT METHODS */}

      <Text style={styles.sectionTitle}>Payment Method</Text>

      <TouchableOpacity
        style={[styles.payOption, payment === "bkash" && styles.payActive]}
        onPress={() => setPayment("bkash")}
      >
        <Text>Pay with bKash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.payOption, payment === "nagad" && styles.payActive]}
        onPress={() => setPayment("nagad")}
      >
        <Text>Pay with Nagad</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.payOption, payment === "cod" && styles.payActive]}
        onPress={() => setPayment("cod")}
      >
        <Text>Cash on Delivery</Text>
      </TouchableOpacity>

      {/* MERCHANT INFO */}

      {(payment === "bkash" || payment === "nagad") && (
        <View style={styles.paymentBox}>

          <Text style={styles.merchantText}>
            {payment === "bkash" ? "bKash" : "Nagad"} Merchant Number
          </Text>

          <Text style={styles.merchantNumber}>
            0191979797399
          </Text>

          <TextInput
            placeholder="Enter Transaction ID"
            style={styles.input}
            value={trxId}
            onChangeText={setTrxId}
          />

        </View>
      )}

      {/* ORDER SUMMARY */}

      <View style={styles.summary}>

        <Text>Subtotal: ৳{Math.round(cartTotal)}</Text>

        <Text>
          Delivery: {deliveryFee === 0 ? "Free" : `৳${deliveryFee}`}
        </Text>

        <Text style={styles.total}>
          Total: ৳{Math.round(total)}
        </Text>

      </View>

      {/* PLACE ORDER */}

      <TouchableOpacity onPress={placeOrder}>
        <LinearGradient
          colors={COLORS.gradientButton}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Place Order</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20,
    backgroundColor:COLORS.bg
  },

  title:{
    fontSize:22,
    ...FONTS.bold,
    marginBottom:20
  },

  input:{
    borderWidth:1,
    borderColor:COLORS.border,
    borderRadius:10,
    padding:12,
    marginBottom:12,
    backgroundColor:"#fff"
  },

  sectionTitle:{
    fontSize:14,
    ...FONTS.bold,
    marginTop:10,
    marginBottom:10
  },

  payOption:{
    padding:12,
    borderWidth:1,
    borderColor:COLORS.border,
    borderRadius:8,
    marginBottom:8,
    backgroundColor:"#fff"
  },

  payActive:{
    borderColor:COLORS.accent
  },

  paymentBox:{
    marginTop:10
  },

  merchantText:{
    fontSize:12,
    marginBottom:4
  },

  merchantNumber:{
    fontSize:18,
    ...FONTS.bold,
    marginBottom:10
  },

  summary:{
    marginTop:20,
    marginBottom:20
  },

  total:{
    fontSize:16,
    ...FONTS.bold,
    marginTop:6
  },

  button:{
    padding:14,
    borderRadius:10,
    alignItems:"center"
  },

  buttonText:{
    color:"#fff",
    fontSize:14,
    ...FONTS.bold
  }

});