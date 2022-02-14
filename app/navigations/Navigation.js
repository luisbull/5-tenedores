import React from "react";
import {  } from "react-native-elements";
import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Icon } from "react-native-elements";
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

const Tab = createMaterialBottomTabNavigator();

export default function Navigation(){
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="restaurants-main"
                activeColor="#f0edf6"
                // inactiveColor="#3e2465"
                
                barStyle={{ backgroundColor: '#00a680' }}
                
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                })}
            >
                <Tab.Screen 
                    name="restaurants-main" 
                    component={RestaurantsStack}
                    options={{ title: "Restaurantes" }} 
                />
                <Tab.Screen 
                    name="favorites-main" 
                    component={FavoritesStack}
                    options={{ title: "Favoritos" }}
                />
                <Tab.Screen
                    name="top-restaurants-main"
                    component={TopRestaurantsStack}
                    options={{ title: "Top 5" }}
                />
                <Tab.Screen 
                    name="search-main"
                    component={SearchStack}
                    options={{ title: "Buscar" }}
                />
                <Tab.Screen 
                    name="account-main"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />

            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {
    let iconName;

    switch (route.name) {
        case "restaurants-main":
            iconName = "compass-outline"
            break;
        case "favorites-main":
            iconName = "heart-outline"
            break;
        case "top-restaurants-main":
            iconName = "star-outline"
            break;
        case "search-main":
            iconName = "magnify"
            break;
        case "account-main":
            iconName = "home-outline"
            break;
    
        default:
            break;
    }

    return (
        <Icon type="material-community" name={iconName} size={26} color={color} />
    )
}