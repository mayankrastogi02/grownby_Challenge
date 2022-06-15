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
import { Avatar, Button } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { Farm as farmType} from "../types";

const Farm = () => {
    const [posts, setPosts] = useState<farmType[]>([]);
    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        const colRef = collection(db, "FarmData");
        getDocs(colRef)
            .then((snapshot) => {
                let farms:farmType[] = [];
                snapshot.docs.forEach((doc) => {
                    const data = doc.data() as farmType;
                    farms.push({ ...data});
                });
                console.log(farms);
                farms.sort((a, b) => a.name.localeCompare(b.name));
                console.log(farms);
                setPosts(farms);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const handleSignOut = () => {
        auth.signOut()
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
                    <Button
                        mode="contained"
                        onPress={addFarm}
                        style={styles.button}
                    >
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
                <View style={styles.container}>
                    <Text style={styles.subHeading}>Farms</Text>
                </View>
                <View>
                    {posts.length > 0 ? (
                        // console.log(posts)
                        posts.map((post) => {
                            console.log(post);
                            return (
                                // <div>{post.name}</div>);
                                <View style={styles.card}>
                                    <Text
                                        key={post.name}
                                        style={styles.cardText}
                                    >
                                        🌾 {post.name}
                                    </Text>
                                    <Avatar.Image size={100} source={{ uri: post.farmPic.url }} />
                                </View>
                            );
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
        backgroundColor: "#2874A6",
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
        marginTop: 40,
        fontSize: 30,
    },
    card: {
        backgroundColor: "#2874A6",
        width: "100%",
        margin: "auto",
        fontSize: 20,
        borderRadius: 5,
        padding: 5,
        borderWidth: 2,
        marginBottom: 10,
    },
    cardText: {
        color: "white",
        fontSize: 15,
    },
});
