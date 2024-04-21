import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db, auth } from '../../../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, Timestamp, doc } from 'firebase/firestore';

const MessagingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { receiverId, name } = route.params || {};
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserID, setCurrentUserID] = useState(null); // Now using useState to manage current user ID

  useEffect(() => {
    // Fetch the current user's ID from Firebase authentication
    const fetchCurrentUserId = () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserID(user.uid);  // Set the current user's UID from Firebase auth
      } else {
        console.log("No user logged in");
        // Optionally handle what happens if no user is logged in
      }
    };
  
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserID && receiverId) {
      const messagesRef = collection(db, 'Messages');
      const q = query(
        messagesRef,
        orderBy('Time', 'asc'),
        where('SenderUser', '==', doc(db, 'Users', currentUserID)),
        where('ReceiverUser', '==', doc(db, 'Users', receiverId))
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatMessages(messages);
      }, error => {
        console.error("Failed to fetch messages:", error);
      });

      return () => unsubscribe(); // Clean up on cleanup
    }
  }, [receiverId, currentUserID]);

  const addMessage = async () => {
    if (newMessage.trim().length === 0 || !receiverId) return;

    const messageData = {
      Content: newMessage,
      Time: Timestamp.fromDate(new Date()),
      SenderUser: doc(db, 'Users', currentUserID),
      ReceiverUser: doc(db, 'Users', receiverId)
    };

    try {
      await addDoc(collection(db, 'Messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 150}
    >
      <Text style={styles.header}>{name}</Text>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.SenderUser === currentUserID ? styles.myMessage : styles.theirMessage
          ]}>
            <Text style={styles.messageText}>{item.Content}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        inverted
        ListEmptyComponent={<Text style={styles.noMessages}>No messages yet</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={styles.input}
        />
        <Pressable onPress={addMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#f0f0f0',
    textAlign: 'center'
  },
  list: {
    flex: 1,
    paddingHorizontal: 10
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%'
  },
  myMessage: {
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
    marginRight: 10,
    color: 'black'  // Ensure text is readable
  },
  theirMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    marginLeft: 10,
    color: 'white' // Ensure text is readable
  },
  messageText: {
    color: 'white'
  },
  noMessages: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  input: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007aff',
    borderRadius: 20
  },
  sendText: {
    color: 'white'
  }
});

export default MessagingScreen;
