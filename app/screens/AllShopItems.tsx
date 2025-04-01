import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../context/AuthContext";

// ===== Type & API =====
interface ShopDetail {
  shopId: string;
  shopName: string;
  ownerId: string;
  description: string;
  rating: number;
  address: string;
  createdAt: string;
}

interface ShopItem {
  itemId: string;
  shopId: string;
  itemName: string;
  itemDesc: string;
  quantity: number;
  hargaPerItem: number;
  imageUrl?: string; // tambahkan imageUrl untuk menampung gambar utama
}

interface ProductImage {
  imageId: string;
  itemId: string;
  image: string;
  isPrimary: string;
}

const getShopDetail = async (shopId: string): Promise<ShopDetail> => {
  const response = await axios.get(`${API_URL}/get-shop/${shopId}`);
  return response.data;
};

const getShopItems = async (shopId: string): Promise<ShopItem[]> => {
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

  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [items, setItems] = useState<ShopItem[]>([]);
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
                imageUrl: primaryImage?.image,
              };
            } catch {
              return item; 
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{shop.shopName}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{shop.description}</Text>

      <Text style={styles.label}>Address:</Text>
      <Text style={styles.value}>{shop.address}</Text>

      <Text style={styles.label}>Rating:</Text>
      <Text style={styles.value}>{shop.rating} / 5</Text>

      <Text style={styles.label}>Created At:</Text>
      <Text style={styles.value}>
        {new Date(shop.createdAt).toLocaleString()}
      </Text>

      <Text style={styles.itemTitle}>Items</Text>

      {items.length === 0 ? (
        <Text style={styles.value}>No items found.</Text>
      ) : (
        <View style={styles.itemGrid}>
          {items.map((item) => (
            <View key={item.itemId} style={styles.itemCard}>
              <Image
                source={{
                  uri:
                    item.imageUrl ??
                    "https://via.placeholder.com/150", 
                }}
                style={styles.imagePlaceholder}
              />
              <Text style={styles.cardItemName}>{item.itemName}</Text>
              <Text style={styles.cardItemStock}>Available: {item.quantity}</Text>
              <Text style={styles.cardItemPrice}>Rp{item.hargaPerItem}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1f2937", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  label: {
    color: "#6b7893",
    fontWeight: "600",
    marginTop: 8,
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 4,
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
    marginTop: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#6b7893",
    paddingBottom: 4,
  },
  itemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    backgroundColor: "#374151", 
    width: "48%",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#6b7893",
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#6b7893",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardItemStock: {
    fontSize: 14,
    color: "#cbd5e1",
    marginTop: 2,
  },
  cardItemPrice: {
    fontSize: 14,
    color: "#d1d5db",
    marginTop: 4,
    fontWeight: "600",
  },
});
