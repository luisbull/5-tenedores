import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import { filter, size } from 'lodash';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Modal from '../Modal';

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm (props){

    const { toastRef, setIsLoading, navigation} = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);

    console.log(imageSelected);

    const addRestaurant = () => {
        console.log("OK");
        console.log(`Restaurant name: ${restaurantName}`);
        console.log(`Restaurant address: ${restaurantAddress}`);
        console.log(`Restaurant description: ${restaurantDescription}`);
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imageSelected[0]} />
            <FormAdd 
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
            />
            <UploadImage 
                toastRef={toastRef}
                imageSelected={imageSelected}
                setImageSelected={setImageSelected}
            />
            <Button 
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} />
        </ScrollView>
    );
}

function ImageRestaurant(props){
    const { imageRestaurant} = props;

    return (
        <View style={styles.ViewPhoto}>
            <Image 
                source={imageRestaurant ? { uri: imageRestaurant } : require("../../../assets/img/no-image.png")}
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}

function FormAdd(props){

    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap } = props

    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del Restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: "#c2c2c2",
                    onPress: () => setIsVisibleMap(true),
                }}
            />
            <Input 
                placeholder="Descripcion del Restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props){
    const { isVisibleMap, setIsVisibleMap } = props;
    
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <Text>MODALx</Text>
        </Modal>
    );
}

function UploadImage(props){

    const { toastRef, imageSelected, setImageSelected } = props;

    const imageSelect = async () => {
        const resultPermissions = await Camera.requestCameraPermissionsAsync();
        const resultPermissionsCamera = resultPermissions.status;

        toastRef.current.show("Es necesario aceptar los permisos de acceso. Si inicialmente los negaste, tendras que ir a ajustes y hacerlo manualmente",4000);
        if (resultPermissionsCamera === 'denied'){
            toastRef.current.show("Es necesario aceptar los permisos de acceso. Si inicialmente los negaste, tendras que ir a ajustes y hacerlo manualmente",4000);
        } 
        else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3],
            });

            if(result.cancelled) {
                toastRef.current.show("Has cancelado la seleccion de imagen")
            }
            else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {

        Alert.alert(
            "Eliminar imagen",
            "Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ]
        )
    }

    return (
        <View style={styles.viewImage}>
            {size(imageSelected) < 4 && (
                <Icon 
                    type='material-community'
                    name='camera'
                    color='#7a7a7a'
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {
                imageSelected.map((imageRestaurant, i) => (
                    <Avatar 
                        key={i} 
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant}}
                        onPress={() => removeImage(imageRestaurant)}
                    />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor:"#00a280",
        margin: 20
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        height: 70,
        width: 70,
        marginRight: 10
    },
    ViewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    }
})