import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Formik, Form, useField, Field } from "formik";
import * as Yup from "yup";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Avatar, Button, Card, Text, TextInput } from "react-native-paper";
import "../styles.css";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

const AddFarm = () => {
  const [image, setImage] = useState(null);
  const [imgurl, setUrl] = useState(String);
  const [url, setFarmUrl] = useState(String);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleImageChange = (e: any) => {
    const preview = document.querySelector('Avatar');
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    // convert image file to base64 string
    setUrl(reader.result.toString());
  }, false);

    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      setImage(e.target.files[0]);
      reader.readAsDataURL((e.target.files[0]));
    }
  };

  const addPic = () => {
    if (image == null) return;
    const imageRef = ref(storage, image.name);
    uploadBytes(imageRef, image)
      .then(() => {
        getDownloadURL(imageRef)
          .then((url) => {
            setFarmUrl(url);
          })
          .catch((error) => {
            console.log(error.message, "Error getting the image URL");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleExit = () => {
    navigation.replace("Farm");
  };

  if (imgurl === "") {
    setUrl(
      "https://cdn-icons.flaticon.com/png/512/4210/premium/4210903.png?token=exp=1655321234~hmac=0521243b5a6485e892b552da9197a260"
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.input}>Add a Farm</Text>
      <Formik
        initialValues={{
          name: "",
          displayname: "",
          openHours: "",
          phone: "",
          farmPic: "",
        }}
        validationSchema={Yup.object({
          displayname: Yup.string().required("**Required"),
          name: Yup.string().required("**Required"),
          phone: Yup.string().matches(
            phoneRegExp,
            "**Phone number is not valid"
          ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          console.log({ url });
          setDoc(doc(db, "FarmData", values.name), {
            name: values.name,
            displayname: values.displayname,
            openHours: values.openHours,
            phone: values.phone,
            farmPic: { url },
          });
          navigation.replace("Farm");
        }}
      >
        {({ errors, touched, handleChange, values, handleSubmit }) => (
          <Form>
            <View style={styles.picture}>
              <Avatar.Image size={200} source={{ uri: imgurl }} />
            </View>
            <input
              type="file"
              name="farmPic"
              onChange={handleImageChange}
              className="button"
            />
            <Button mode="contained" onPress={addPic} style={styles.button}>
              Upload
            </Button>

            <TextInput
              label="Display Name"
              placeholder="Farm Display Name"
              onChangeText={handleChange("displayname")}
              value={values.displayname}
            />

            <Text style={styles.span}>{errors.displayname}</Text>

            <TextInput
              label="Name"
              placeholder="Farm name"
              onChangeText={handleChange("name")}
              value={values.name}
            />

            <Text style={styles.span}>{errors.name}</Text>

            <TextInput
              label="Phone"
              placeholder="567-100-1000"
              onChangeText={handleChange("phone")}
              value={values.phone}
            />

            <Text style={styles.span}>{errors.phone}</Text>

            <TextInput
              label="Open hours"
              placeholder="9:00-17:00"
              onChangeText={handleChange("openHours")}
              value={values.openHours}
            />
            <Text style={styles.span}>{errors.openHours}</Text>
            {/* <Button mode="contained" style={styles.buttonOutline}>Submit</Button> */}
            <Button
              onPress={handleSubmit}
              mode="contained"
              style={styles.buttonOutline}
            >
              Submit
            </Button>
            <Button
              onPress={handleExit}
              mode="contained"
              style={styles.buttonExit}
            >
              Exit
            </Button>
          </Form>
        )}
      </Formik>
    </View>
  );
};

export default AddFarm;

const styles = StyleSheet.create({
  container: {
    // width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    marginTop: 10,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  picture: {
    width: "50%",
    margin: "auto",
    padding: 10,
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
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
  },
  buttonOutline: {
    backgroundColor: "green",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
  },
  buttonExit: {
    backgroundColor: "grey",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
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
  span: {
    color: "red",
    padding: 10,
    margin: "auto",
  },
});
