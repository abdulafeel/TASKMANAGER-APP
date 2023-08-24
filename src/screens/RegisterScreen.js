import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet,TouchableOpacity,Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/actions/authActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (!isValidEmail(email)) {
      Alert.alert('Error', 'Invalid email format');
    } else {
      const emailExists = users.some((user) => user.email === email);

      if (emailExists) {
        Alert.alert('Error', 'Email already exists');
      } else {
        const userData = { email, password };
        dispatch(registerUser(userData));

        if (errorMessage === '') {
          Alert.alert('Success', 'Registration successful');
          navigation.navigate('Login');
        }
      }
    }
  };

  const isValidEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginNavigation = () => {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
    navigation.navigate('Login');
    setEmail('');
    setPassword('')
  };


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: windowWidth * 0.08, marginBottom: windowHeight * 0.03 }]}>Register</Text>
      <TextInput
        style={[styles.input, { fontSize: windowWidth * 0.04, padding: windowWidth * 0.03, marginBottom: windowHeight * 0.02 }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { fontSize: windowWidth * 0.04, padding: windowWidth * 0.03, marginBottom: windowHeight * 0.02 }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerTxt}>Register</Text>
      </TouchableOpacity>
      <Text>Already Registered? </Text>
      <TouchableOpacity onPress={handleLoginNavigation}>
        <Text style={[styles.link, { fontSize: windowWidth * 0.03 }]}>Sign In</Text>
      </TouchableOpacity>
      {errorMessage ? (
        <Text style={[styles.errorMessage, { fontSize: windowWidth * 0.03, marginTop: windowHeight * 0.02 }]}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowWidth * 0.05,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  registerBtn:{
    paddingHorizontal:10,
    paddingVertical:10,
    borderWidth:1,
    borderRadius:8,
    borderColor:'#808080',
    backgroundColor:'black',
    width:windowWidth*0.4,
    marginBottom: windowHeight * 0.02,
  },
  registerTxt:{
    fontSize:windowWidth * 0.04,
    textAlign:'center',
    fontWeight:'500',
    color:'white'
  }
});

export default RegisterScreen;