import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
// import { map } from 'lodash';

export default function AccountOptions(props){
    const { userInfo, toastRef} = props
    // console.log(userInfo.uid);
    // console.log(menuOptions);
    const selectedComponent = (key) => {
        console.log("clicked");
        console.log(key);
    }
    const menuOptions = generateOptions(selectedComponent);

    return (
        <View>
            {/* {
                map(menuOptions, (menu, index) => (
                    <ListItem 
                        key={index} 
                        title={menu.title} 
                        leftIcon={{
                            type: menu.iconType,
                            name: menu.iconNameLeft,
                            color: menu.iconColorLeft
                        }}
                        rightIcon={{
                            type: menu.iconType,
                            name: menu.iconNameRight,
                            color: menu.iconColorRight
                        }}
                        containerStyle={styles.menuItems}
                        onPress={menu.onPress}
                    >
                    </ListItem>
                ))
            } */}
            <View>
                {
                    menuOptions.map((item, i) => (
                    <ListItem key={i} style={styles.menuItems} onPress={item.onPress}>
                        <Icon name={item.iconNameLeft} type={item.iconType} color={item.iconColorLeft} />
                        <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Chevron color={item.iconColorRight}/>
                    </ListItem>
                    ))
                }
            </View>
        </View>

    )
}

function generateOptions(selectedComponent){
    return [
        { 
            title: "Cambiar Nombre",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("DisplayName")

        },
        { 
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("Email")
        },
        { 
            title: "Cambiar Contrasena",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("Password") 
        }
    ]
}

const styles = StyleSheet.create({
    menuItems: {
        borderBottomWidth: 1,
        // borderTopWidth: 1,
        borderBottomColor: '#e3e3e3',
        // borderTopColor: '#e3e3e3'
    }
})