import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { getDoc, collection, deleteDoc, doc} from 'firebase/firestore';
import { auth, db} from '../../../firebase';

const Account = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'Users', user.uid); // Reference to the user's document
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          // Set user profile data here
          setUserProfile(userDoc.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user signed in");
      }
    };

    fetchUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('PrepperPage'); // Update with your actual login screen route name
    } catch (error) {
      Alert.alert("Error", "Could not sign out. Please try again.");
    }
  };
  

  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            const user = auth.currentUser;
            if (user) {
              try {
                await deleteDoc(doc(db, 'Users', user.uid));
                console.log('User deleted successfully');
                // Proceed to sign the user out and navigate away
                await signOut(auth);
                navigation.navigate('PrepperPage'); // Or your login/signup screen
              } catch (error) {
                console.error('Error deleting User:', error);
                Alert.alert("Error", "Failed to delete profile. Please try again.");
              }
            } else {
              console.log('No user signed in');
            }
          }
        },
      ],
      { cancelable: false } // This prevents the alert from being dismissed by tapping outside of it
    );
  };
  

  return (
    <View style={styles.container}>
        <View style={styles.profileSection}>
            <Text style={styles.usernameText}>{userProfile?.Username}</Text>
        </View>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('FavoritesList')}>
            <Text style={styles.actionText}>Favorites List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ChangeRecipe')}>
            <Text style={styles.actionText}>Change Recipe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={handleSignOut}>
            <Text style={styles.actionText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, styles.deleteAction]} onPress={handleDeleteProfile}>
            <Text style={styles.actionText}>Delete Profile</Text>
        </TouchableOpacity>
    </View>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10, // Add some spacing if needed
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  deleteAction: {
    backgroundColor: '#FFCCCC', // Light red background for delete action
  },
});

export default Account;
