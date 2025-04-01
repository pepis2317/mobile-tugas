import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import { API_URL, useAuth } from "../context/AuthContext"
import { Button, View, Text, ScrollView, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { ItemResponse } from "../../models/ItemResponse"
import ItemCard from "../../components/ItemCard"
import SearchBar from "../../components/SearchBar"
import NavBar from "../../components/NavBar"
import { Box } from "lucide-react-native"


type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">
export default function Home({ navigation }: HomeProps) {
    const { authState, onLogout } = useAuth()
    const [refreshing, setRefreshing] = useState(false)
    const [serachTerm, setSearchTerm] = useState("")
    const [itemData, setItemData] = useState<ItemResponse[]>([])
    const [loading, setLoading] = useState(true)
    const getItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/items/get-query?SearchTerm=${serachTerm}`)
            setItemData(response.data)
            setLoading(false)
            setRefreshing(false)
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const onRefresh = useCallback(() => {
        setLoading(true)
        setRefreshing(true)
        getItems()
    }, [])
    useEffect(() => {
        getItems()

    }, [])
    const handleSearch = async () => {
        setLoading(true)
        await getItems()
        setLoading(false)
    }
    // useEffect(() => { console.log(itemData) }, [itemData])
    return (
        <View style={{ flex: 1, marginTop: 30 }}>
            <View style={{ padding: 5, paddingLeft: 10, paddingRight: 10, gap: 10 }}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Bokapedia</Text>

                    <TouchableOpacity style={styles.shopButton} onPress={()=>navigation.navigate("MyShop")}>
                        <Box color={"#5CCFA3"} size={20} />
                    </TouchableOpacity>
                </View>

                <SearchBar onChangeText={setSearchTerm} placeholder="Search..." onSubmitEditing={() => handleSearch()} returnKeyType="search" />
            </View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} /> :

                <FlatList
                    data={itemData}
                    keyExtractor={(item) => item.itemId}
                    numColumns={2}
                    renderItem={({ item, index }) => <ItemCard key={index} item={item} />}
                    contentContainerStyle={{ paddingBottom: 200 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            }

        </View>
    )
}
const styles = StyleSheet.create({
    shopButton: {
        padding: 10,
        backgroundColor: "#31363F",
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,

    },
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    item: {
        width: "49%",
        marginBottom: 10,
        alignItems: "center",
    },
});
