import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const CreateRecipe = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [ingredient, setIngredients] = useState('');

  const createRecipe = async () => {
    try {
      // Create the recipe document
      const recipeRef = await addDoc(collection(db, 'Recipe'), {
        Title: title,
        Category: category,
        Description: description,
        DietaryRestriction: dietaryRestriction,
        Ingredients: ingredient
      });

      // Immediately update the document to include its own ID
      await updateDoc(recipeRef, { RecipeID: recipeRef.id });

      console.log('Recipe added with ID: ', recipeRef.id);
      Alert.alert(`Recipe created successfully with ID: ${recipeRef.id}`); // User feedback

      // Clear the form fields
      setTitle('');
      setCategory('');
      setDescription('');
      setDietaryRestriction('');
      setIngredients('');
    } catch (error) {
      console.error('Error adding recipe: ', error);
      Alert.alert('Error creating recipe: ' + error.message); // Error feedback
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Dietary Restriction"
        value={dietaryRestriction}
        onChangeText={setDietaryRestriction}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients" 
        value={ingredient}
        onChangeText={setIngredients}
      />
      <Button title="Create Recipe" onPress={createRecipe} />
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

export default CreateRecipe;
