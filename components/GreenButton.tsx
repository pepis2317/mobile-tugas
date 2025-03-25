import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from "react-native";
interface ButtonProps extends TouchableOpacityProps {
    title: string;
    style?: any;
}
export default function GreenButton({ title,style, ...rest }: ButtonProps){
    return(
        <TouchableOpacity style={[styles.button, style]}{...rest}>
            <Text style={{color:'white'}}>{title}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    button:{
        padding:15,
        backgroundColor:"#5CCFA3",
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    }
})

