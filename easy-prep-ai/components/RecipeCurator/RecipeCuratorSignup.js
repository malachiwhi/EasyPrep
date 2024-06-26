import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {createUserWithEmailAndPassword, db } from '../../firebase';
import {doc,setDoc} from 'firebase/firestore';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const signUpWithEmailAndPassword = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Assuming 'Role' and 'ActiveStatus' are fixed values at registration time
      const userData = {
        Email: email, // User's email
        Username: username, // User's chosen username
        Role: "Recipe Curator", 
        ActiveStatus: true, // User is active upon registration
        UserID: user.uid // The unique ID generated by Firebase Auth
      };
  
      // Storing the user data in Firestore under 'users' collection with document ID as user's UID
      await setDoc(doc(db, 'Users', user.uid), userData);
  
      console.log('Registered with:', user.email);
      // Navigate to the main app screen or perform other actions upon successful registration
      navigation.navigate('Main1');
    } catch (error) {
      alert(error.message);
      console.error("Error during sign up:", error);
    }
  };
  

  const handleSignUp = () => {
    signUpWithEmailAndPassword(email, password, username)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        navigation.navigate('Main1');
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./images/background.jpeg')}
        resizeMode='cover'
        style={styles.backgroundImage}
      />
      <Text style={styles.title}>Sign-Up</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          secureTextEntry
        />
        <RoundedButton title="Sign-Up"   onPress={handleSignUp} />
      </View>
    </View>
  );
};

const RoundedButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.roundedButton} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  roundedButton: {
    backgroundColor: '#53B175',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
