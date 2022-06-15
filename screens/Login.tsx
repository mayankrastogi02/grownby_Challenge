import {
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = React.useState(false);

  //Listener - when component mounts

  const navigation = useNavigation<StackNavigationProp<any>>();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Changing state");
        navigation.navigate("Farm");
      }
    });

    return unsubscribe;
  }, []);

  const handlesignUp = () => {
    console.log(email);
    console.log(password);
    if (!email || !password) {
      setErrorMsg("Please fill all the required fieds.");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        console.log(res);
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
        console.log("Error: ", err);
      });
  };

  const handleLogin = () => {
    console.log(email);
    console.log(password);
    if (!email || !password) {
      setErrorMsg("Please fill all the required fieds.");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        console.log("Logged in" + user.email);
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
        console.log("Error: ", err);
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.input}>Log In Screen</Text>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />

        <View style={styles.buttonView}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlesignUp}
            disabled={submitButtonDisabled}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
    marginBottom: 20,
    marginTop: 20,
    fontSize: 40,
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  button: {
    //   backgroundColor: "white"
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
  },
  buttonOutline: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 30,
  },
  error: {
    fontSize: 20,
  },
});
