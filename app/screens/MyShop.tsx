import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { RootStackParamList } from "../../App";
import { useCallback, useEffect, useState } from "react";
import { ShopResponse } from "../../models/ShopResponse";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import SearchBar from "../../components/SearchBar";
import StarRating from "../../components/StarRating";
import ItemCard from "../../components/ItemCard";
import GreenButton from "../../components/GreenButton";
import MyItemCard from "../../components/MyItemCard";

type MyShopProps = NativeStackScreenProps<RootStackParamList, "MyShop">;

export default function MyShop({ navigation }: MyShopProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [shop, setShop] = useState<ShopResponse | null>(null);
    const [itemData, setItemData] = useState<ItemResponse[]>([]);

    /** Ambil data toko berdasarkan owner ID */
    const getShop = async () => {
        try {
            console.log("Fetching shop for user:", user?.userId);
            const response = await axios.get(`${API_URL}/get-shop-by-owner/${user?.userId}`);
            if (!response.data) {
                setShop(null);
            } else {
                setShop(response.data);
                await getItems(response.data.shopId);
            }
        } catch (e) {
            console.error("Error fetching shop:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /** Ambil data items dalam shop */
    const getItems = async (shopId: string) => {
        try {
            console.log("Fetching items for shop:", shopId);
            const response = await axios.get(`${API_URL}/items/get-query?SearchTerm=${searchTerm}&ShopId=${shopId}`);
            setItemData(response.data);
        } catch (e) {
            console.error("Error fetching items:", e);
        }
    };

    /** Refresh data */
    const onRefresh = useCallback(() => {
        setLoading(true);
        setRefreshing(true);
        getShop();
    }, []);

    /** Panggil data toko saat user sudah tersedia */
    useEffect(() => {
        if (user?.userId) {
            getShop();
        }
    }, [user?.userId]);

    /** Panggil data items saat shop sudah tersedia */
    useEffect(() => {
        if (shop?.shopId) {
            getItems(shop.shopId);
        }
    }, [shop]);

    /** Handle pencarian item */
    const handleSearch = async () => {
        setLoading(true);
        if (shop?.shopId) await getItems(shop.shopId);
        setLoading(false);
    };

    /** Jika masih loading */
    if (loading) {
        return <ActivityIndicator size="large" color="#636C7C" style={{ marginTop: 32 }} />;
    }

    /** Jika user belum punya shop, tampilkan UI khusus */
    if (!shop) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1f2937" }}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>You Have No Shop</Text>
                <GreenButton title="Open Shop" onPress={() => navigation.navigate("CreateShop")} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#1f2937", padding: 10 }}>
            <SearchBar onChangeText={setSearchTerm} placeholder="Search in shop..." onSubmitEditing={handleSearch} returnKeyType="search" />
            <FlatList
                ListHeaderComponent={
                    <View style={{ padding: 10, gap: 10 }}>
                        <View style={{ gap: 5 }}>
                            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{shop.shopName}</Text>
                            <Text style={{ color: "white" }}>{shop.description}</Text>
                            <Text style={{ color: "white" }}>{shop.address}</Text>
                            <StarRating stars={shop.rating} />
                        </View>
                        <GreenButton title="Add New Item" onPress={() => navigation.navigate("CreateItem", { shop })} />
                    </View>
                }
                data={itemData}
                keyExtractor={(item) => item.itemId}
                numColumns={2}
                renderItem={({ item }) => <MyItemCard item={item} />}
                contentContainerStyle={{ paddingBottom: 300 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
}
