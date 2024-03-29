import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { validateEmail } from '../../utils/validations';
import { reauthenticate } from '../../utils/api';

export default function ChangeEmailForm(props){

    const { email, setShowModal, toastRef, setReloadUserInfo } = props;
    const [formData, setFormData] = useState(defaultValue());
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        setErrors({});
        if(!formData.email || email === formData.email){
            setErrors({
                email: "El email no ha cambiado"
            })
        }
        else if(!validateEmail(formData.email)) {
            setErrors({
                email: "El email es incorrecto"
            })
        }
        else if(!formData.password) {
            setErrors({
                password: "Contrasena no puede estar vacia"
            })
        }
        else {
            setLoading(true);
            reauthenticate(formData.password).then(response => {
                firebase
                    .auth()
                    .currentUser.updateEmail(formData.email)
                    .then(() => {
                        setLoading(false);
                        setReloadUserInfo(true);
                        toastRef.current.show("Email actualizado correctamente");
                        setShowModal(false);
                    })
                    .catch(() => {
                        setErrors({ email: "Error al actualizar email"});
                        setLoading(false);
                    })
            }).catch(() => {
                setLoading(false);
                setErrors({ password: "La contrasena no es correcta"})
            })
        }
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder='Correo electronico'
                containerStyle={styles.input}
                rightIcon={{
                    type:"material-community",
                    name:"at",
                    color:"#c2c2c2"
                }}
                defaultValue={email || ""}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errors.email}
            />
            <Input 
                placeholder='Contrasena'
                containerStyle={styles.input}
                secureTextEntry={showPassword ? false : true}
                rightIcon = {{
                    type:"material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Button 
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
        </View>
    )
}

function defaultValue(){
    return {
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 20
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});