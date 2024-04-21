import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const EditProfile = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (auth.currentUser) {
            setUsername(auth.currentUser.displayName || '');
            setEmail(auth.currentUser.email || '');
        }
    }, []);

    const handleUpdateProfile = async () => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            try {
                const userRef = doc(db, 'Users', userId);
                
                // Update Firebase Auth display name if changed
                if (username !== auth.currentUser.displayName) {
                    await updateProfile(auth.currentUser, { displayName: username });
                    console.log('Display name updated to:', username);
                    
                    // Update the Username in Firestore to reflect the schema
                    await updateDoc(userRef, { Username: username });
                    console.log('Firestore Username updated to:', username);
                }
    
                // Update Firebase Auth email if changed
                if (email !== auth.currentUser.email) {
                    await updateEmail(auth.currentUser, email);
                    console.log('Email updated to:', email);
    
                    // Update the Email in Firestore to reflect the schema
                    await updateDoc(userRef, { Email: email });
                    console.log('Firestore Email updated to:', email);
                }
    
                Alert.alert("Profile updated successfully!");
                navigation.goBack(); // Navigate back after successful update
            } catch (error) {
                console.error('Error updating profile:', error);
                Alert.alert("Error updating profile.", error.message);
            }
        } else {
            Alert.alert("User not logged in or user ID missing");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
            />
            <Button title="Save Changes" onPress={handleUpdateProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginBottom: 15,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default EditProfile;
