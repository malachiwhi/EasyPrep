import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { db } from '../../../firebase'; // Make sure to import your firebase configuration
import { collection, addDoc } from 'firebase/firestore'; // Import required Firestore functions

const AdminAnnouncement = () => {
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  const createAnnouncement = async () => {
    try {
      const announcementRef = await addDoc(collection(db, 'Announcements'), {
        Text: announcement, // Use the state variable correctly
      });
      console.log('Announcement added with ID: ', announcementRef.id);
      // Optionally, you could add the announcement ID to your local state for reference
      return announcementRef.id; // Return the new document ID
    } catch (error) {
      console.error('Error adding announcement: ', error);
      Alert.alert('Error', 'Failed to post announcement');
    }
  };

  const postAnnouncement = async () => {
    if (!announcement.trim()) {
      Alert.alert('Please enter an announcement');
      return;
    }

    // First, save the announcement to Firestore and get the document ID
    const newAnnouncementId = await createAnnouncement();
    if (newAnnouncementId) {
      // If the document was successfully created, add the announcement to local state
      setAnnouncements(prevAnnouncements => [
        ...prevAnnouncements,
        { id: newAnnouncementId, text: announcement },
      ]);
      setAnnouncement('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={announcement}
        onChangeText={setAnnouncement} // Update to modify the announcement state
        placeholder="Enter your announcement here..."
        multiline
      />
      <Button title="Post Announcement" onPress={postAnnouncement} />
      {announcements.map(item => (
        <View key={item.id} style={styles.announcementContainer}>
          <Text style={styles.announcementText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  announcementContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  announcementText: {
    fontSize: 16,
  },
});

export default AdminAnnouncement;

