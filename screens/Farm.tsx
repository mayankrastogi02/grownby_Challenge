import {
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import AddFarm from "./NewFarm";
import { Button } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";

const Farm = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const colRef = collection(db, "FarmData");
    getDocs(colRef)
      .then((snapshot) => {
        let farms = []
        snapshot.docs.forEach((doc) => {
          farms.push({ ...doc.data(), id: doc.id})
        })
        console.log(farms)
        setPosts(farms);
      })
      .catch(err => {
        console.log(err.message)
      })
    
    // const getFarms = async () => {
    //   const data = await getDocs(colRef);
    //   // console.log("Data is: " + data)
    //   setPosts(
    //     data.docs.map((doc) => {
    //       ({ ...doc.data(), id: doc.id });
    //     })
    //   );
    // };

    // return () => getFarms();
  });

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  const addFarm = () => {
    navigation.navigate("AddFarm");
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.input}>Farm Screen</Text>
        <View style={styles.buttonView}>
          <Button mode="contained" onPress={addFarm} style={styles.button}>
            <Text style={styles.buttonText}>Add Farm</Text>
          </Button>
          <Button
            mode="contained"
            onPress={handleSignOut}
            style={styles.buttonOutline}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </Button>
        </View>
        <View>
          <Text style={styles.subHeading}>Farms</Text>
          {posts.length > 0 ? (
            // console.log(posts)
            posts.map((post) => {
              return( 
              // <div>{post.name}</div>);
              <Text key={post.name}>{post.name}</Text>);
            })
          ) : (
            <Text>No farms added yet.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Farm;

const styles = StyleSheet.create({
  container: {
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    marginTop: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    fontSize: 40,
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  button: {
    //   backgroundColor: "white"
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    margin: 10,
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
  },
  buttonOutline: {
    backgroundColor: "red",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 15,
  },
  error: {
    fontSize: 20,
  },
  subHeading: {
    marginTop:40,
    fontSize: 30,
  },
});
