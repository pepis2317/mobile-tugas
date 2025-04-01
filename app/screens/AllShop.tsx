import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Shop = {
  shopId: string;
  shopName: string;
  description: string;
  address: string;
  rating: number;
  createdAt: string;
  ownerId: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AllShop">;

export default function AllShop() {
  const navigation = useNavigation<NavigationProp>();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchShops = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all-shops`);
      setShops(response.data);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const renderShop = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("AllShopItems", {
          shopId: item.shopId,
          userId: user?.userId ?? "",
        })
      }
    >
      <Text style={styles.shopName}>{item.shopName}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{item.description}</Text>

      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{item.address}</Text>

      <Text style={styles.label}>Rating:</Text>
      <Text style={styles.value}>{item.rating} / 5</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6b7893" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={shops}
        keyExtractor={(item) => item.shopId}
        renderItem={renderShop}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2937",
    padding: 7,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#2d3748",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  shopName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  label: {
    color: "#6b7893",
    fontWeight: "600",
    fontSize: 14,
  },
  value: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
