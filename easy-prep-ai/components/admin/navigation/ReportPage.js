import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const RecipeCategoryReport = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [ingredient, setIngredient] = useState('');
  const [ingredientCount, setIngredientCount] = useState(0);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const snapshot = await getDocs(collection(db, 'RecipeIngredients'));
      const counts = {};
      let ingredientRecipeCount = 0; // Initialize the ingredient count

      snapshot.forEach(doc => {
        const data = doc.data();
        const category = data.category;
        if (counts[category]) {
          counts[category] += 1;
        } else {
          counts[category] = 1;
        }

        // Check if the recipe contains the specified ingredient
        if (data.ingredients && data.ingredients.includes(ingredient.toLowerCase())) {
          ingredientRecipeCount += 1;
        }
      });

      setCategoryCounts(counts);
      setIngredientCount(ingredientRecipeCount);
    };

    fetchCategoryCounts();
  }, [ingredient]); // Dependency on the ingredient state to re-fetch when it changes

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Recipes per Category</Text>
      {Object.entries(categoryCounts).map(([category, count]) => (
        <View style={styles.item} key={category}>
          <Text style={styles.text}>{category}: {count} recipes</Text>
        </View>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Enter an ingredient to count recipes"
        onChangeText={text => setIngredient(text)}
        value={ingredient}
      />
      <Text style={styles.reportText}>
        {ingredient ? `Total recipes containing "${ingredient}": ${ingredientCount}` : "Enter an ingredient to see counts"}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  reportText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default RecipeCategoryReport;
