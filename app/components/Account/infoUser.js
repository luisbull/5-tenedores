import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Camera from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props){
    const { 
        userInfo: { uid, photoURL, displayName, email },
        toastRef,
        setLoading,
        setLoadingText
    } = props;

    const changeAvatar = async () => {
        const resultPermissions = await Camera.requestCameraPermissionsAsync();
        const resultPermissionsCamera = resultPermissions.status;

        if (resultPermissionsCamera === 'denied'){
            toastRef.current.show("Es necesario aceptar los permisos de acceso ");
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
                uploadImage(result.uri).then(() => {
                    updatePhoroUrl();
                }).catch(() => {
                    toastRef.current.show("Error al actualizar avatar")
                })
            }
        }
    }

    const uploadImage = async (uri) => {
        
        setLoadingText("Actualizando Avatar");
        setLoading(true);

        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }
    

    const updatePhoroUrl = () => {
        firebase
            .storage()
            .ref(`/avatar/${uid}`)
            .getDownloadURL()
            .then(async(response) => {
                const update = {
                    photoURL: response,
                };
                await firebase.auth().currentUser.updateProfile(update);
                setLoading(false);
            })
            .catch(() => {
                toastRef.current.show("Error al actualizar avatar");
                setLoading(false);
            });
        
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                onPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={ photoURL ? {uri: photoURL} : require("../../../assets/img/avatar-default.jpg")}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anonimo"}
                </Text>
                <Text>
                    {email ? email : "Social login"}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        backgroundColor:"grey",
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
});