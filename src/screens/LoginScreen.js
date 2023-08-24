import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet,TouchableOpacity, Dimensions} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/authActions';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    } else {
      const userData = { email, password };
      dispatch(loginUser(userData));
    }
  };

  useEffect(() => {
    if (errorMessage === '') {
      navigation.navigate('Home');
      setEmail('');
      setPassword('');
    } else if (errorMessage) {
      Alert.alert('Error', errorMessage);
    }
  }, [errorMessage, navigation]);

  const handleRegisterNavigation = () => {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
    navigation.navigate('Register');
    setEmail('');
    setPassword('')
  };


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: windowWidth * 0.08, marginBottom: windowHeight * 0.03 }]}>Login</Text>
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
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginTxt}>Login</Text>
      </TouchableOpacity>
     
      <Text>Not registered yet? </Text>
      <TouchableOpacity onPress={handleRegisterNavigation}>
        <Text style={[styles.link, { fontSize: windowWidth * 0.03 }]}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={[styles.errorMessage, { fontSize: windowWidth * 0.03, marginTop: windowHeight * 0.02 }]}>
        {errorMessage}
      </Text>
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
  link:{
    textDecorationLine:'underline',
    color:'blue'
  },
  loginBtn:{
    paddingHorizontal:10,
    paddingVertical:10,
    borderWidth:1,
    borderRadius:8,
    borderColor:'#808080',
    backgroundColor:'black',
    width:windowWidth*0.4,
    marginBottom: windowHeight * 0.02
  },
  loginTxt:{
    fontSize:windowWidth * 0.04,
    textAlign:'center',
    fontWeight:'500',
    color:'white'
  }
});

export default LoginScreen;