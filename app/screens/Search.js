import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon, Avatar } from 'react-native-elements';
import { FireSQL } from 'firesql';
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props){
    const { navigation } = props;
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if(search){
            fireSQL
                .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then((response) => {
                    setRestaurants(response);
                })
        }
    }, [search])
    

    return (
        <View>
            <SearchBar
                placeholder="Busca tu restaurante..."
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {restaurants.length === 0 ? (
                <NoFoundRestaurants />
            ) : (
                <FlatList 
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation}/>}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    )
}

function NoFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center" }} >
            <Image
                source={require("../../assets/img/no-result-found.png")}
                resizeMode="cover"
                style={{ width: 200, height: 200}}
            />
        </View>
    )
}

function Restaurant(props){
    const { restaurant, navigation} = props;
    const { id, name, images } = restaurant.item;
    // console.log(images);
    console.log(images);

    return (
        <ListItem
            title={name}
            leftAvatar={{
                source: images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")
            }}
            rightIcon={<Icon type="material-community" name="chevron-right" />}
            onPress={() => navigation.navigate("restaurants", { screen: "restaurant", params:{ id }, })}

        >
            <ListItem.Title>{name}</ListItem.Title>
            <ListItem.Chevron color="#ccc"/>
            {/* <Avatar 
                style={styles.image}
                size={40}
                // PlaceholderContent={<ActivityIndicator color="#fff" />}
                source={ images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")}
            /> */}
            <Avatar source={images[0]}/>
        </ListItem>
        
        // <ListItem style={styles.menuItems} onPress={() => navigation.navigate("restaurant", {id, name})} 
        //         leftAvatar={{
        //              source: images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")
        //         }} >
        //     <Avatar 
        //         style={styles.image}
        //         size={40}
        //         // PlaceholderContent={<ActivityIndicator color="#fff" />}
        //         source={ images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")}
        //     />
        // <ListItem.Content>
        //     <ListItem.Title>{name}</ListItem.Title>
        // </ListItem.Content>
        // <ListItem.Chevron color="#ccc"/>
    // </ListItem>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20
    }
})