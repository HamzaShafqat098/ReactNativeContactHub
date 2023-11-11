import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBrweCEAP3NpIv2IGKyk48jmeBLTcl8SPg",
  authDomain: "simplecontacthub.firebaseapp.com",
  projectId: "simplecontacthub",
  storageBucket: "simplecontacthub.appspot.com",
  messagingSenderId: "828534812308",
  appId: "1:828534812308:web:a67efc9fa10260b5160e81",
  measurementId: "G-62JF05ZCVR",
  databaseURL:
    "https://simplecontacthub-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const database = getDatabase(app);
const contactsRef = ref(database, "contacts");

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    image: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchContacts = () => {
      onValue(contactsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const contactsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setContacts(contactsArray);
        } else {
          setContacts([]);
        }
      });
    };

    fetchContacts();
  }, []);

  const handleAddContact = () => {
    if (
      newContact.name.trim() !== "" &&
      newContact.email.trim() !== "" &&
      newContact.phone.trim() !== ""
    ) {
      push(contactsRef, newContact);
      setNewContact({ image: "", name: "", email: "", phone: "" });
    }
  };

  const handleUpdateContact = (id) => {
    const contactToUpdate = contacts.find((contact) => contact.id === id);
    if (contactToUpdate) {
      update(ref(database, `contacts/${id}`), {
        name: newContact.name !== "" ? newContact.name : contactToUpdate.name,
        email:
          newContact.email !== "" ? newContact.email : contactToUpdate.email,
        phone:
          newContact.phone !== "" ? newContact.phone : contactToUpdate.phone,
      });
      setNewContact({ image: "", name: "", email: "", phone: "" });
    }
  };

  const handleDeleteContact = (id) => {
    remove(ref(database, `contacts/${id}`));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem}>
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/100" }}
        style={styles.contactImage}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactDetail}>{item.email}</Text>
        <Text style={styles.contactDetail}>{item.phone}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity onPress={() => handleUpdateContact(item.id)}>
          <AntDesign name="edit" size={24} color="blue" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteContact(item.id)}>
          <AntDesign name="delete" size={24} color="red" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact List</Text>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.contactList}
      />
      <View style={styles.addContactContainer}>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={newContact.name}
          onChangeText={(text) => setNewContact({ ...newContact, name: text })}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={newContact.email}
          onChangeText={(text) => setNewContact({ ...newContact, email: text })}
        />
        <TextInput
          placeholder="Phone"
          style={styles.input}
          value={newContact.phone}
          onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
        />
        <Button title="Add Contact" onPress={handleAddContact} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  contactList: {
    marginBottom: 20,
  },
  contactItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  contactImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  contactDetail: {
    color: "#666",
  },
  contactActions: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  icon: {
    marginLeft: 15,
  },
  addContactContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  input: {
    height: 40,
    padding: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
});