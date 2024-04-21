import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput
  } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import { db } from '../../../firebase';
  import { getDocs, collection, query, where } from 'firebase/firestore';
  
  const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const navigation = useNavigation();
  
    useEffect(() => {
      const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'Users'));
        const usersData = querySnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
        setUsers(usersData);
        setDisplayedUsers(usersData);
      };
      fetchUsers();
    }, []);
  
    const handleSearch = () => {
      const filteredUsers = users.filter(user =>
        user.Username.toLowerCase().includes(searchText.toLowerCase())
      );
      setDisplayedUsers(filteredUsers);
    };
  
    const handleInputChange = (text) => {
      setSearchText(text);
    };
  
    const navigateToMessages = (userId, userName) => {
      // Navigate to the messaging screen with the selected user
      navigation.navigate('Messages', { receiverId: userId, name: userName });
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Users"
            onChangeText={handleInputChange}
            value={searchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={displayedUsers}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => navigateToMessages(item.UserID, item.Username)}>
              <Text style={styles.userText}>{item.Username}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.UserID}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 10,
      paddingTop: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    searchBar: {
      flex: 1,
      height: 40,
      borderColor: '#DADADA',
      borderWidth: 1,
      borderRadius: 25,
      paddingHorizontal: 15,
      backgroundColor: '#FFFFFF',
      fontSize: 16,
      marginRight: 10,
    },
    searchButton: {
      backgroundColor: '#53B175',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    userCard: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 15,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      marginTop: 10,
    },
    userText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
  });
  
  export default UserSearch;
  