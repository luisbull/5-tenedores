import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import RegisterForm from "../../components/Account/RegisterForm";
export default function Registe() {
    return (
        <ScrollView>
            <Image 
                source={require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegisterForm />
            </View>
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