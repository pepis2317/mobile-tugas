import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { ItemResponse } from "../models/ItemResponse";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { ImageIcon, Pencil } from "lucide-react-native";
type NavigationType = NativeStackNavigationProp<RootStackParamList>;
export default function MyItemCard({ item }: { item: ItemResponse }) {
    const navigation = useNavigation<NavigationType>();

    return (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("EditItem", { item: item })}>

            {item.thumbnail ? <Image src={item.thumbnail} style={styles.thumbnail} /> : <View style={styles.thumbnail}><ImageIcon size={50} color={"#636C7C"} /></View>}
            <View style={styles.editPencil}>
                    <Pencil color={"white"} size={20} />
                    {/* <Text>Nigga</Text> */}
                </View>
            <View style={styles.info}>
               
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }} numberOfLines={2} ellipsizeMode="tail">{item.itemName == "G" ? "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt, illum?" : item.itemName} </Text>

                <Text style={{ color: "white", fontSize: 10 }}>{item.quantity} available</Text>
                <Text style={{ color: "white" }}>${item.hargaPerItem}</Text>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    editPencil: {
        width: 32,
        height: 32,
        borderBottomLeftRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: '#5CCFA3',
        top: 0,
        right: 0
    },
    item: {
        position: 'relative',
        alignItems: "center",
        width: "47%",
        margin: 5,
    },
    thumbnail: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#31363F',
        overflow: 'hidden',
        height: 200,
        borderRadius: 5,
    },
    info: {
        marginTop: 5,
        width: "100%",
        gap: 2
    }
});