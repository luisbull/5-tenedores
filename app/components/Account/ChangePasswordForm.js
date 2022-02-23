import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { size } from 'lodash';
import * as firebase from 'firebase';
import { reauthenticate } from '../../utils/api';


export function ChangePasswordForm(props){

    const { setShowModal, toastRef } = props;
    const [formData, setFormData] = useState(defaultValue());
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = async() => {
        let isSetErrors = true;
        let errorsTemp = {};
        setErrors({});
        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorsTemp = {
                password: !formData.password ? "La contrasena no puede estar vacia" : "",
                newPassword: !formData.newPassword ? "La contrasena no puede estar vacia" : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contrasena no puede estar vacia" : "",
            }
        }
        else if(formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp = {
                newPassword: "Las contrasenas no son iguales",
                repeatNewPassword: "Las contrasenas no son iguales",
            }
        }
        else if(size(formData.newPassword) < 6) {
            errorsTemp = {
                newPassword: "Contrasena tiene que ser 6 caracteres o mayor",
                repeatNewPassword: "Contrasena tiene que ser 6 caracteres o mayor"
            }
        }
        else {
            setLoading(true);
            await reauthenticate(formData.password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            isSetErrors = false;
                            setLoading(false);
                            setShowModal(false);
                            firebase.auth().signOut();
                        })
                        .catch(() => {
                            errorsTemp = { other: "Error al actualizar contrasena"};
                            setLoading(false);
                        })
                })
                .catch(() => {
                errorsTemp = { password: "La contrasena no es correcta"};
                setLoading(false);
            });
        }
        isSetErrors && setErrors(errorsTemp);
    }


    return (
        <View style={styles.view}>
            <Input 
                placeholder='Contrasena actual'
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
            <Input 
                placeholder='Nueva contrasena'
                containerStyle={styles.input}
                secureTextEntry={showPassword ? false : true}
                rightIcon = {{
                    type:"material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />
            <Input 
                placeholder='Repetir nueva contrasena'
                containerStyle={styles.input}
                secureTextEntry={showPassword ? false : true}
                rightIcon = {{
                    type:"material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color:"#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={errors.repeatNewPassword}
            />
            <Button 
                title="Cambiar contrasena"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}

function defaultValue(){
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: ""
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