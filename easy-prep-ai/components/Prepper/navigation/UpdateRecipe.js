import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';

const UpdateRecipe = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [ingredients, setIngredients] = useState('');

  useEffect(() => {
    console.log("Params on mount:", route.params); // Debug initial route parameters
    if (route.params?.recipe?.id) {
      const { Title, Category, Description, DietaryRestriction, Ingredients, id } = route.params.recipe;
      setTitle(Title);
      setCategory(Category);
      setDescription(Description);
      setDietaryRestriction(DietaryRestriction);
      setIngredients(Ingredients);
      console.log("Received recipeId:", id); // Debugging line to check if ID is being received correctly
    } else {
      Alert.alert('Error', 'No recipe ID provided');
      navigation.goBack();
    }
  }, [route.params]);

  const updateRecipe = async () => {
    const recipeId = route.params?.recipe?.id; // Corrected way to retrieve recipeId from the received params
    if (recipeId) {
      try {
        const recipeRef = doc(db, 'Recipe', recipeId);
        const snapshot = await getDoc(recipeRef);
        if (snapshot.exists()) {
          const originalRecipe = snapshot.data();
          // Compare and update each field if necessary
          if (title !== originalRecipe.Title) {
            await updateDoc(recipeRef, { Title: title });
            console.log('Recipe title updated to:', title);
          }
          if (category !== originalRecipe.Category) {
            await updateDoc(recipeRef, { Category: category });
            console.log('Recipe category updated to:', category);
          }
          if (description !== originalRecipe.Description) {
            await updateDoc(recipeRef, { Description: description });
            console.log('Recipe description updated to:', description);
          }
          if (dietaryRestriction !== originalRecipe.DietaryRestriction) {
            await updateDoc(recipeRef, { DietaryRestriction: dietaryRestriction });
            console.log('Dietary restrictions updated to:', dietaryRestriction);
          }
          if (JSON.stringify(ingredients) !== JSON.stringify(originalRecipe.Ingredients)) {
            await updateDoc(recipeRef, { Ingredients: ingredients });
            console.log('Ingredients updated:', ingredients);
          }

          Alert.alert('Recipe has been updated successfully!');
          navigation.goBack();
        } else {
          console.error('No recipe found with the provided ID');
          Alert.alert('No recipe found');
        }
      } catch (error) {
        console.error('Error updating recipe:', error);
        Alert.alert('There was an error updating the recipe', error.message);
      }
    } else {
      Alert.alert('Recipe ID not found');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Dietary Restriction" value={dietaryRestriction} onChangeText={setDietaryRestriction} />
      <TextInput style={styles.input} placeholder="Ingredients" value={ingredients} onChangeText={setIngredients} />
      <Button title="Update Recipe" onPress={updateRecipe} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default UpdateRecipe;
