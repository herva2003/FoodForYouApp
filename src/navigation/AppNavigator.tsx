import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import Dashboard from '../screens/Dashboard';
import Ingredients from '../screens/Ingredients';
import MyRecipes from '../screens/MyRecipes';
import RecipeIA from '../screens/RecipeIA';
import IdentifyIA from '../screens/IdentifyIA';
import Community from '../screens/Community';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  Ingredients: undefined;
  MyRecipes: undefined;
  RecipeIA: undefined;
  IdentifyIA: undefined;
  Community: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Oculta o cabeçalho
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          // Define os ícones para cada tela
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ingredients') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'MyRecipes') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'RecipeIA') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'IdentifyIA') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          }

          // Retorna o ícone
          return null; // Ícones removidos
        },
        tabBarActiveTintColor: '#007BFF', // Cor quando o botão está ativo
        tabBarInactiveTintColor: 'gray', // Cor quando o botão está inativo
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Ingredients" component={Ingredients} />
      <Tab.Screen name="MyRecipes" component={MyRecipes} />
      <Tab.Screen name="RecipeIA" component={RecipeIA} />
      <Tab.Screen name="IdentifyIA" component={IdentifyIA} />
      <Tab.Screen name="Community" component={Community} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="Dashboard"
          component={BottomTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
