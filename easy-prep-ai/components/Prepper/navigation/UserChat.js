import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';

const UserSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("No user signed in");
        return;
      }
  
      try {
        const userDocRef = doc(db, "Users", currentUser.uid);
        const messagesQuery = query(collection(db, 'Messages'), where("ReceiverUser", "==", userDocRef));
        
        const querySnapshot = await getDocs(messagesQuery);
        let messagesBySender = {};
  
        for (const docSnapshot of querySnapshot.docs) {
          const messageData = {
            id: docSnapshot.id,
            content: docSnapshot.data().Content,
            senderId: docSnapshot.data().SenderUser.path.split("/")[1],
            receiver: docSnapshot.data().ReceiverUser,
            time: docSnapshot.data().Time.toDate().toString()
          };
  
          if (!messagesBySender[messageData.senderId]) {
            messagesBySender[messageData.senderId] = {
              messages: [],
              senderId: messageData.senderId,
              senderName: ""  // To be filled in the next step
            };
          }
          messagesBySender[messageData.senderId].messages.push(messageData.content);
        }
  
        // Fetch each sender's name by their UID
        for (const senderId in messagesBySender) {
          const senderRef = doc(db, "Users", senderId);
          const senderDoc = await getDoc(senderRef);
          if (senderDoc.exists()) {
            messagesBySender[senderId].senderName = senderDoc.data().Username;
          } else {
            messagesBySender[senderId].senderName = "Unknown";
          }
        }

        setMessages(Object.values(messagesBySender));  // Convert object to array for rendering
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
  
    fetchMessages();
  }, []);

  const handleSelectMessage = (senderId, senderName) => {
    // Navigate to the Messaging Screen with necessary parameters
    navigation.navigate('MessagingScreen', {
      userId: senderId, 
      username: senderName
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Users"
          onChangeText={text => setSearchText(text)}
          value={searchText}
        />
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageCard} onPress={() => handleSelectMessage(item.senderId, item.senderName)}>
            <Text style={styles.senderText}>From: {item.senderName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.senderId}
        ListEmptyComponent={<Text>No messages to display</Text>}
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
  },
  messageCard: {
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
  senderText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666666',
  },
});

export default UserSearch;
