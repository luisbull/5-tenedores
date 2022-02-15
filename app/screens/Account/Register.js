import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/Account/RegisterForm";

export default function Registe() {

    const toastRef = useRef();
    return (
        <ScrollView>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegisterForm toastRef={toastRef} />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewForm: {
        marginRight: 40,
        marginLeft: 40,
    }
});