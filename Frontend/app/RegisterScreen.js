import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import axios from "axios";

export default function SignupScreen() {

  const [role, setRole] = useState("tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");

  const registerUser = async () => {
    try {

      const res = await axios.post("http://YOUR_IP:5000/api/register", {
        role,
        name,
        email,
        password,
        phone
      });

      Alert.alert("Success", res.data.message);

    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>

      {/* Role Selection */}

      <Text style={styles.label}>I am a...</Text>

      <View style={styles.roleContainer}>

        <TouchableOpacity
          style={[
            styles.roleBox,
            role === "tenant" && styles.selected
          ]}
          onPress={() => setRole("tenant")}
        >

            <Image
               source={require("../assets/tenant.png")}
               style={styles.icon}
            />

          <Text style={styles.roleTitle}>Tenant</Text>
          <Text style={styles.roleDesc}>Looking for a place to stay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleBox,
            role === "owner" && styles.selected
          ]}
          onPress={() => setRole("owner")}
        >

            <Image
    source={require("../assets/owner.png")}
    style={styles.icon}
  />

          <Text style={styles.roleTitle}>Owner</Text>
          <Text style={styles.roleDesc}>Listing a property</Text>
        </TouchableOpacity>

      </View>

      {/* Inputs */}

      <TextInput
        placeholder="Enter your full name"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Enter your email address"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#888"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />
      
      <TextInput
        placeholder="Enter confirm password"
        placeholderTextColor="#888"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Phone number"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Enter your Address"
        placeholderTextColor="#888"
        style={styles.input}
        onChangeText={setAdress}
      />

      {/* Button */}

      <TouchableOpacity style={styles.button} onPress={registerUser}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
  <Text style={styles.loginTextNormal}>Already have an account? </Text>
  <Text
    style={styles.loginText}
    onPress={() => navigation.navigate("Login")}
  >
    Login
  </Text>
</View>

    </View>
    
  );
  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
    
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 35 ,
    marginTop: 25 
  },

  label: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold"
  },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  roleBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15
  },

  selected: {
    borderColor: "#007bff",
    backgroundColor: "#e6f0ff"
  },

  roleTitle: {
    fontWeight: "bold",
    fontSize: 16
  },

  roleDesc: {
    fontSize: 12,
    color: "gray"
  },

  input: {
  borderWidth: 2,
  borderColor: "#ccc",
  borderRadius: 8,
  height: 58,        
  paddingHorizontal: 15,
  fontSize: 17,      
  marginBottom: 15
},

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10
  },

  icon: {
  width: 40,
  height: 40,
  marginBottom: 10,
  alignSelf: "left"
},

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  loginContainer: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 20
},

loginTextNormal: {
  fontSize: 17,
  color: "#000"
},

loginText: {
  color: "#007bff",
  fontWeight: "bold",
  fontSize: 17, 
}

});