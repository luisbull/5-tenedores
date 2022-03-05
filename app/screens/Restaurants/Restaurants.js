import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text} from "react-native";
import { Icon } from 'react-native-elements';
import { firebaseApp } from "../../utils/firebase";
import * as firebase from 'firebase';
// import firebase from 'firebase/app';
import "firebase/firestore";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props){

    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitRestaurant = 10;


    console.log(restaurants);

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
          setUser(userInfo);
        });
    }, []);
    
    useEffect(() => {
      db.collection("restaurants")
        .get()
        .then((snap) => {
            setTotalRestaurants(snap.size);
        });

        const resultRestaurants = [];

        db.collection("restaurants")
            .orderBy("created", "desc")
            .limit(limitRestaurant)
            .get()
            .then((response) => {
                setStartRestaurants(response.docs[response.docs.length - 1]);

                response.forEach((doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push(restaurant);
                });
                setRestaurants(resultRestaurants);
            })
    }, [])

    const handleLoadMore = () => {
        const resultRestaurants = [];
        restaurants.length < totalRestaurants && setIsLoading(true);
        db.collection("restaurants")
            .orderBy("created", "desc")
            .startAfter(startRestaurants.data().created)
            .limit(limitRestaurant)
            .get()
            .then((response) => {
                if(response.docs.length > 0) {
                    setStartRestaurants(response.docs[response.docs.length - 1])
                }
                else {
                    setIsLoading(false);
                }

                response.forEach((doc) => {
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    resultRestaurants.push(restaurant);
                })

                setRestaurants([...restaurants, ...resultRestaurants]);
            })
    }
    
    return (
        <View style={styles.viewBody}>
            <ListRestaurants 
                restaurants={restaurants}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />

            {user && (
                <Icon
                    reverse 
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-restaurant") }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5
    }
});