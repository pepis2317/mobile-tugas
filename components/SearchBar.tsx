import { TextInput, TextInputProps, View, StyleSheet} from "react-native";

export default function SearchBar(props:TextInputProps){
    return(
        <TextInput style={styles.darkTextInput} placeholderTextColor={"#C4C4C4"} {...props}/>
    )
}
const styles = StyleSheet.create({
    darkTextInput: {
        width:'100%',
        borderStyle: 'solid',
        borderColor: '#636C7C',
        borderWidth: 1,
        color:'white',
        height: 50,
        padding: 10,
        borderRadius: 100
    }
})