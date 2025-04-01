import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
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
  shopImage: string;
  userId: string;
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
      <Image
        source={{ uri: item.shopImage }}
        style={styles.shopImage}
        resizeMode="cover"
      />
      <Text style={styles.shopName}>{item.shopName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ADB5" />
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
    backgroundColor: "#222831",
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#393E46",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: "48%",
    alignItems: "center",
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  shopName: {
    color: "#EEEEEE",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
