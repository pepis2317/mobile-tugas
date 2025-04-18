import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../context/AuthContext";
import ItemCard from "../../components/ItemCard";
import { ShopResponse } from "../../models/ShopResponse";
import { ItemResponse } from "../../models/ItemResponse";

interface ProductImage {
  imageId: string;
  itemId: string;
  image: string;
  isPrimary: string;
}

const getShopDetail = async (shopId: string): Promise<ShopResponse> => {
  const response = await axios.get(`${API_URL}/get-shop/${shopId}`);
  return response.data;
};

const getShopItems = async (shopId: string): Promise<ItemResponse[]> => {
  const response = await axios.get(
    `${API_URL}/items/get-shop-items?ShopId=${shopId}`
  );
  return response.data;
};

const getImagesForItem = async (itemId: string): Promise<ProductImage[]> => {
  const response = await axios.get(
    `${API_URL}/get-images-for-item?ItemId=${itemId}`
  );
  return response.data;
};

export default function AllShopItems() {
  const route = useRoute();
  const { shopId } = route.params as { shopId: string };

  const [shop, setShop] = useState<ShopResponse | null>(null);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopData = await getShopDetail(shopId);
        const itemData = await getShopItems(shopId);

        const itemsWithImages = await Promise.all(
          itemData.map(async (item) => {
            try {
              const images = await getImagesForItem(item.itemId);
              const primaryImage = images.find(
                (img) => img.isPrimary.trim() === "true"
              );

              return {
                ...item,
                thumbnail: primaryImage ? primaryImage.image : null, 
              };
            } catch {
              return { ...item, thumbnail: null };
            }
          })
        );

        setShop(shopData);
        setItems(itemsWithImages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6b7893" />
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Shop not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shop.shopName}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{shop.description}</Text>

      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{shop.address}</Text>

      <Text style={styles.label}>Rating:</Text>
      <Text style={styles.value}>{shop.rating} / 5</Text>

      <Text style={styles.itemTitle}>Items</Text>

      <FlatList
        data={items}
        renderItem={({ item }) => <ItemCard item={item} />}
        keyExtractor={(item) => item.itemId}
        numColumns={2} 
        contentContainerStyle={styles.itemGrid}
        nestedScrollEnabled={true} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1f2937",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  label: {
    color: "#6b7893",
    fontWeight: "600",
    marginTop: 3,
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f2937",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#6b7893",
    paddingBottom: 0,
  },
  itemGrid: {
    paddingBottom: 16,
  },
});
