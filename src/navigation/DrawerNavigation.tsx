import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../screens/Dashboard";
import Ingredients from "../screens/Ingredients";
import MyRecipes from "../screens/MyRecipes";
import RecipeIA from "../screens/RecipeIA";
import IdentifyIA from "../screens/IdentifyIA";
import Community from "../screens/Community";
import { RootStackParamList } from "../interfaces/RootStackParamList";
import Header from './Header'

const Drawer = createDrawerNavigator<RootStackParamList>();

const CustomDrawerContent = (props: any) => {

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/Logo.png")}
          style={styles.logo}
        />
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigation: React.FC = () => {
  const {userData, handleLogout} = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({
        header: ({navigation}) => (
          <Header navigation={navigation} userData={userData} handleLogout={handleLogout} />
        ),        drawerActiveTintColor: "#007BFF",
        drawerInactiveTintColor: "gray",
        drawerStyle: {
          backgroundColor: "#fff",
        },
      })}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Ingredients" component={Ingredients} />
      <Drawer.Screen name="MyRecipes" component={MyRecipes} />
      <Drawer.Screen name="RecipeIA" component={RecipeIA} />
      <Drawer.Screen name="IdentifyIA" component={IdentifyIA} />
      <Drawer.Screen name="Community" component={Community} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
});

export default DrawerNavigation;