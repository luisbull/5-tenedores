import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';

export default function Modal(props) {

    const { isVisible, setIsVisible, children } = props;

    const closeModal = () => setIsVisible(false); 

    return (
        <Overlay 
            isVisible={isVisible}
            overlayStyle={styles.overlay}
            // windowBackgroundColor="rgba(0,0,0,0.5)"
            // overlayBackgroundColor="transparent"
            onBackdropPress={closeModal}
            >
                {children}
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: "auto",
        width: "90%",
        backgroundColor: "#fff",
    }
});