import { useEffect, useState } from "react"
import * as ImagePicker from "expo-image-picker";
import { Button, ScrollView, View, Image, TouchableOpacity, StyleSheet,Text, ActivityIndicator} from "react-native";
import TextInputComponent from "../../components/TextInputComponent";
import { Cross, PlusSquare, X } from "lucide-react-native";
import axios from "axios";
import { API_URL } from "../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import GreenButton from "../../components/GreenButton";
type CreateItemProps = NativeStackScreenProps<RootStackParamList, "CreateItem">
export default function CreateItem({ navigation, route }: CreateItemProps) {
    const { shop } = route.params
    const [images, setImages] = useState<string[]>([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [errMessage, setErrMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const uploadImageData = async () => {
        try {
            const response = await axios.post(`${API_URL}/items/create-item?ShopId=${shop.shopId}`, {
                itemName: name,
                itemDesc: description,
                quantity: quantity,
                hargaPerItem: price
            })
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const uploadImage = async (formData: FormData) => {
        try {
            const response = await axios.post(`${API_URL}/upload-image-for-item`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }

    }
    const generateFormData = (image: string, itemId: string) => {
        let filename = image.split("/").pop();
        let match = /\.(\w+)$/.exec(filename || "");
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append("ItemId", itemId);
        formData.append("file", {
            uri: image,
            name: filename,
            type: type
        } as any);
        return formData;
    };
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission required");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            aspect: [1, 1]
        })

        if (!result.canceled) {
            setImages((prevImages) => [...prevImages, result.assets[0].uri]); 
        }
    }
    const uploadItemWithImages = async () => {
        if (images.length <= 0 || name == "" || description == "" || price == "" || quantity == "") {
            setErrMessage("All forms must be filled")
            return
        }
        setLoading(true)
        const itemData = await uploadImageData(); 

        if (itemData.error) {
            setErrMessage(itemData.msg)
            setLoading(false)
            return;
        }

        const newItemId = itemData.itemId;

        for (const image of images) {
            const formData = generateFormData(image, newItemId); 
            if (formData) {
                const response = await uploadImage(formData);
                if (response.error) {
                    setErrMessage("Failed to upload image:"+ response.msg)
                    return

                }
            }
        }
        setLoading(false)
        navigation.goBack()

    };
    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    return (
        <ScrollView>
            <View style={styles.imagesContainer}>
                <TouchableOpacity style={styles.addImageButton} onPress={() => pickImage()}>
                    <View style={styles.addBorder}>
                        <PlusSquare color={"#5CCFA3"} size={32} />
                    </View>

                </TouchableOpacity>
                <ScrollView horizontal>
                    {images.map((uri, index) => (
                        <View key={index} >
                            <Image

                                source={{ uri }}
                                style={{ width: 150, height: 150 }}
                            />
                            <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                                <X size={20} color={"white"} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View style={{ gap: 10, padding: 10, marginBottom: 500 }}>
                <TextInputComponent placeholder="Item name" onChangeText={setName} />
                <TextInputComponent placeholder="Item description" onChangeText={setDescription} />
                <TextInputComponent placeholder="Quantity" inputMode="numeric" onChangeText={setQuantity} />
                <TextInputComponent placeholder="Price" inputMode="numeric" onChangeText={setPrice} />
                {loading? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} />:<GreenButton title="CreateItem" onPress={() => uploadItemWithImages()} />}
                
                {errMessage ?
                <View style={styles.errorContainer}>
                    {errMessage.split("; ").map((error, index) => (
                        <Text key={index} style={{ color: 'white' }}>{error}</Text>
                    ))}
                </View>
                : <></>}
            </View>
           
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    errorContainer: {
        padding: 15,
        borderStyle:"dashed",
        borderColor: '#FB2C36',
        borderWidth: 1,
        borderRadius:5
        
    },
    imagesContainer: {
        height: 150,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: '#31363F',
        borderBottomWidth: 1
    },
    addBorder: {
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderColor: '#5CCFA3',
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',

    },
    addImageButton: {
        padding: 15,
        height: 150,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: '#31363F',
        borderRightWidth: 1
    },

    removeImageButton: {
        position: 'absolute',
        width: 24,
        height: 24,
        right: 5,
        top: 5,
        backgroundColor: '#31363F',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'

    }
})