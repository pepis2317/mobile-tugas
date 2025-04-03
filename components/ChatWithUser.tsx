import { TouchableOpacity, Image, StyleSheet, Text, View } from "react-native";
import { UserResponse } from "../models/UserResponse";
import { MessageCircle } from "lucide-react-native";

export default function ChatWithUser({ user }: { user: UserResponse }) {
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Image source={user.userProfile ? { uri: user.userProfile } : require('../assets/default.jpg')} style={styles.pfp} />
                <View>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{user.userName}</Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>{user.userPhoneNumber}</Text>
                </View>

            </View>
            <TouchableOpacity style={styles.contact}>
                <MessageCircle color={"white"} size={24} />
            </TouchableOpacity>



        </View>
    )
}
const styles = StyleSheet.create({
    pfp: {
        borderRadius: 100,
        width: 50,
        height: 50
    },
    container: {
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#31363F',
        borderRadius: 5,
        width: "100%"
    },
    left: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    contact: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5CCFA3',
        padding: 10,
        borderRadius: 5
    }
})