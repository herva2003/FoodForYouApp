import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const Header: React.FC<{navigation: any; userData: any; handleLogout: () => void}> = ({
    navigation,
    userData,
    handleLogout,
  }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
  
    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.drawerButton}>
          <Text style={styles.drawerButtonText}>☰</Text>
        </TouchableOpacity>
    
        <TouchableOpacity onPress={toggleDropdown}>
          <Image source={require('../assets/Logo.png')} style={styles.avatar} />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Nome: {userData?.fullName}</Text>
            <Text style={styles.dropdownText}>Email: {userData?.login}</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    header: {
      height: 60,
      backgroundColor: '',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    headerText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#fff',
    },
    dropdown: {
      position: 'absolute',
      top: 60,
      right: 10,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 10,
    },
    dropdownText: {
      fontSize: 16,
      marginBottom: 10,
    },
    logoutButton: {
      backgroundColor: '#FF0000',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    drawerButton: {
      marginRight: 10,
    },
    drawerButtonText: {
      color: 'black',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

export default Header;