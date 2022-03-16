import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native'
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
// import { Colors } from 'react-native/Libraries/NewAppScreen';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation, route } = props;
  const { id, name} = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  
  navigation.setOptions({ title: name });

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setRestaurant(data);
          setRating(data.rating);
        })
    },[])
  );

  if(!restaurant ) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <Carousel 
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      <RestaurantInfo 
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReviews
        navigation={navigation}
        idRestaurant={restaurant.id}
        setRating={setRating}
      />
    </ScrollView>
  )
}

function TitleRestaurant(props){
  const { name, description, rating } = props;
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  )
}

function RestaurantInfo(props){
  const { location, name, address } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
      iconColorLeft: "#00a268",
    },
    {
      text: "111-222-333",
      iconName: "phone",
      iconType: "material-community",
      action: null,
      iconColorLeft: "#00a268",
    },
    {
      text: "tambor@gmail.com",
      iconName: "at",
      iconType: "material-community",
      action: null,
      iconColorLeft: "#00a268",
    },
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100}/>
      {
        listInfo.map((item, i) => (
        <ListItem key={i} style={styles.containerListItem} onPress={item.onPress}>
            <Icon name={item.iconName} type={item.iconType} color={item.iconColorLeft} />
            <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor : "#fff"
  },
  viewRestaurantTitle: {
    padding: 15
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  }
})