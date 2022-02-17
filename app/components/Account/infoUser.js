import React from "react";
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Camera from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props){
    const { 
        userInfo: { photoURL, displayName, email },
        toastRef
    } = props;

    const changeAvatar = async () => {
        // const resultPermissions = await Permissions.askAsync(Permissions.Camera);
        const resultPermissions = await Camera.requestCameraPermissionsAsync();
        console.log(resultPermissions);
        const resultPermissionsCamera = resultPermissions.status;

        if (resultPermissionsCamera === 'denied'){
            toastRef.current.show("Es necesario aceptar los permisos de acceso ");
        } 
        else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3],
            });
            console.log(result);
        }
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                // showEditButton={true}
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
        // backgroundColor: "#00a680",
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