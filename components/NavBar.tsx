import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { House, ShoppingCart, Truck, User } from "lucide-react-native";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
type NavigationType = NativeStackNavigationProp<RootStackParamList, "ItemDetail">;
export default function NavBar() {
    const navigation = useNavigation<NavigationType>()
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
                <House color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Cart")}>
                <ShoppingCart color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Orders")}>
                <Truck color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("Profile")}>
                <User color="white" />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        position:'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: "#31363F",
        width: "100%",
        padding: 15,
        paddingLeft:25,
        paddingRight:25,
        borderRadius: 100,
        bottom:25,
        elevation:2,
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        color:'white',
    },
    textInput: {
        width: "100%"
    }
})