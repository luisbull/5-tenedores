import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function ChangeDisplayNameForm(props) {

    const { displayName, setShowModal, toastRef, setReloadUserInfo } = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = () => {
        setError(null);
        if(!newDisplayName) {
            setError("El nombre no puede estar vacio");
        }
        else if (displayName === newDisplayName)
        {
            setError("El nombre no puede ser igual al actual");
        }
        else 
        {
            setLoading(true)
            const update = {
                displayName: newDisplayName
            };
            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    setLoading(false);
                    setReloadUserInfo(true);
                    setShowModal(false);
                })
                .catch(() => {
                    sentError("Error al actualizar el nombre");
                    setLoading(false)
                })
        }
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Nombre"
                containerStyle={styles.input}
                rightIcon={{
                    type:"material-community",
                    name:"account-circle-outline",
                    color:"#c2c2c2"
                }}
                defaultValue={displayName || ""}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button 
                title="Cambiar nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={loading}
            />
        </View>
    )
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