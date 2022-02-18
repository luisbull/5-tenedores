import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { map } from 'lodash';

export default function AccountOptions(props){
    const { userInfo, toastRef} = props
    const menuOptions = generateOptions();
    console.log(userInfo.uid);
    console.log(menuOptions);

    return (
        <View>
            {map(menuOptions, (menu, index) => {
                return (
                    <ListItem 
                        key={index} 
                        title={menu.title} 
                        leftIcon={{
                            type: menu.iconType,
                            name: menu.iconNameLeft,
                            color: menu.iconColorLeft
                        }}
                    />
                )
            })}
        </View>
    )
}

function generateOptions(){
    return [
        { 
            title: "Cambiar Nombre",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc"
        },
        { 
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc"
        },
        { 
            title: "Cambiar Contrasena",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc" 
        }
    ]
}

const styles = StyleSheet.create({

})