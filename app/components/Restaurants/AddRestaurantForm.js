import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import { filter, size } from 'lodash';
import * as Camera from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import Modal from '../Modal';

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm (props){

    const { toastRef, setIsLoading, navigation} = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    // console.log(imageSelected);

    const addRestaurant = () => {
        // console.log(`Restaurant name: ${restaurantName}`);
        // console.log(`Restaurant address: ${restaurantAddress}`);
        // console.log(`Restaurant description: ${restaurantDescription}`);
        // console.log(locationRestaurant);
        if (!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show("Todos los campos son obligatorios");
        }
        else if (size(imageSelected) === 0){
            toastRef.current.show("El restaurante tiene que tener minimo una foto");
        }
        else if (!locationRestaurant){
            toastRef.current.show("El restaurante tiene que tener localizacion en el mapa");
        }
        else {
            console.log("OK");
        }
    }

    const uploadImageStorage = () => {
        
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imageSelected[0]} />
            <FormAdd 
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
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
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant} 
                toastRef={toastRef} />
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

    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap, locationRestaurant } = props

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
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
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
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;
    const [location, setLocation] = useState(null);

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada correctamente");
        setIsVisibleMap(false);
    }

    useEffect(() => {
      (async() => {
          const resultPermissions = await Location.requestForegroundPermissionsAsync();
          const resultPermissionsLocation = resultPermissions.status;
          console.log(resultPermissionsLocation);
          if (resultPermissionsLocation !== "granted"){
              toastRef.current.show("Tienes que aceptar los permisos de localizacion para crear un restaurante", 3000);
          }
          else {
              const loc = await Location.getCurrentPositionAsync({});
              setLocation({
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
              })
          }
      })()
    }, [])
    
    
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />

                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave} 
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button 
                        title="Cancelar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel} 
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
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
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})