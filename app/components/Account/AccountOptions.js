import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import { ChangePasswordForm } from './ChangePasswordForm';


export default function AccountOptions(props){
    const { userInfo, toastRef, setReloadUserInfo } = props
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null)
    const selectedComponent = (key) => {
        switch(key) {
            case "DisplayName":
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setShowModal(true)
                break;
            case "Email":
                setRenderComponent(
                    <ChangeEmailForm 
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setShowModal(true)
                break;
            case "Password":
                setRenderComponent(
                    <ChangePasswordForm 
                    setShowModal={setShowModal}
                    toastRef={toastRef}
                    />
                )
                setShowModal(true)
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }
    const menuOptions = generateOptions(selectedComponent);

    return (
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
            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
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
        borderBottomColor: '#e3e3e3',
    }
})