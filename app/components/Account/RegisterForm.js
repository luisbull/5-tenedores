import React, { useState } from 'react';
import { StyleSheet, View, } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { validateEmail } from '../../utils/validations';
import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

export default function RegisterForm(props) {

    const { toastRef } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [repeatShowPassword, setRepeatShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const navigation = useNavigation();

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)){
            toastRef.current.show("Todos los campos son obligatorios");
            // console.log('Todos los campos son obligatorios');
        }
        else if (!validateEmail(formData.email)){
            toastRef.current.show("Email no es correcto");
            // console.log('Email no es correcto');
        }
        else if (formData.password !== formData.repeatPassword){
            toastRef.current.show("Contrasenas no son iguales");
            // console.log('Contrasenas no son iguales');
        }
        else if (size(formData.password) < 6){
            toastRef.current.show("Contrasena es menor de 6 caracteres");
            // console.log('Contrasena es menor de 6 caracteres');
        }
        else {
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(response => {
                    navigation.navigate("account")
                    console.log(response);
                })
                .catch(err => {
                    toastRef.current.show("Email ya esta en uso. Intentar con otro")
                    console.log(err);
                })
            console.log('OK');
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text});
    }

    return (
        <View style={styles.formContainer}>
            <Input 
                placeholder='Correo Electronico'
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon 
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input 
                placeholder='Contrasena'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? false : true}
                onChange={e => onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input 
                placeholder='Confirmar Contrasena'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={repeatShowPassword ? false : true}
                onChange={e => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon 
                        type='material-community'
                        name={repeatShowPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setRepeatShowPassword(!repeatShowPassword)}
                    />
                }
            />
            <Button 
                title='Unirse'
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
        </View>
    )
}

function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: "",
    };
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    inputForm: {
        width: '100%',
        marginTop: 20
    },
    btnContainerRegister: {
        marginTop: 20,
        width: '95%',
    },
    btnRegister: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
});