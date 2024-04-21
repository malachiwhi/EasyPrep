import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { db } from '../../../firebase';
import { getDocs, collection } from 'firebase/firestore';
import FloatingButton from './FloatingButton';
import { useNavigation} from '@react-navigation/native';
import AdminAnnouncement from '../../RecipeCurator/navigation/Announcements';

const AnnouncementsPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'Announcements'));
      const recipesData = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));
      setRecipes(recipesData);
      setDisplayedRecipes(recipesData);
    };
    fetchRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
          data={displayedRecipes}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Text style={styles.recipeText}>
                {item.Text}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      <FloatingButton/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Light peach background for warmth
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'column', // Changed to column for better layout of additional info
    alignItems: 'flex-start', // Align items to the start
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // More pronounced shadow for a subtle 3D effect
    marginTop: 10,
  },
  recipeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Changed color to black for better readability
    marginBottom: 5, // Spacing between title and potential description
  },
});



export default AnnouncementsPage;
