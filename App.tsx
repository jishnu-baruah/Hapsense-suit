import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ActivityIndicator, TouchableOpacity, ImageBackground, StyleSheet, Text } from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

const App = () => {
  const [data, setData] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [newIPAddress, setNewIPAddress] = useState('');
  const [ipAddressList, setIPAddressList] = useState([]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(); // Call fetchData every 100ms
    }, 10);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const loadIPAddressList = async () => {
    try {
      const savedIPAddresses = await AsyncStorage.getItem('ipAddresses');
      if (savedIPAddresses) {
        setIPAddressList(JSON.parse(savedIPAddresses));
      }
    } catch (error) {
      console.error('Error loading IP addresses:', error);
    }
  };

  const saveIPAddressList = async (list) => {
    try {
      await AsyncStorage.setItem('ipAddresses', JSON.stringify(list));
    } catch (error) {
      console.error('Error saving IP addresses:', error);
    }
  };

  // const handleAddIPAddress = () => {
  //   if (newIPAddress) {
  //     const updatedList = [...ipAddressList, newIPAddress];
  //     setIPAddressList(updatedList);
  //     saveIPAddressList(updatedList);
  //     setNewIPAddress('');
  //   }
  // };

  const handlePress = () => {
    ReactNativeHapticFeedback.trigger("rigid", options);

    if (selectedValue === "add") {
      handleAddIPAddress();
    } else {
      fetchData();
    }
  };




  // const handleDeleteIPAddress = (index) => {
  //   const updatedList = [...ipAddressList];
  //   updatedList.splice(index, 1);
  //   setIPAddressList(updatedList);
  //   saveIPAddressList(updatedList);
  // };

  const fetchData = async () => {
    try {
      const response = await fetch('http://10.230.245.167/');
      const jsonData = await response.json();
      setData(jsonData);
      // console.log('Data fetched successfully:', jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleMotor = async (pin) => {
    ReactNativeHapticFeedback.trigger("rigid", options);
    console.log("vib on " + pin);
    try {
      const response = await fetch('http://10.230.245.167/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });
      if (response.ok) {
        const text = await response.text(); // Extract the text from the response
        // console.log(`Motor pin ${pin} toggled successfully`);
        console.log('Response:', text); // Log the response text
      } else {
        console.error('Failed to toggle motor pin');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* <View>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Select an action..." value="" />
          {ipAddressList.map((ip, index) => (
            <Picker.Item key={index} label={ip} value={ip} />
          ))}
          <Picker.Item label="Add New IP" value="add" />
        </Picker>
        {/* <View style={{ marginTop: 10 }}> */}
      {/* <TextInput
            style={{ borderWidth: 1, borderColor: 'gray', padding: 5 }}
            placeholder="Enter a new IP address"
            value={newIPAddress}
            onChangeText={(text) => setNewIPAddress(text)}
          /> */}
      {/* <Button title="Add" onPress={handleAddIPAddress} /> */}
      {/* </View> */}
      {/* </View> */}
      <View style={styles.card}>
        {data ? (
          <View style={{ flexDirection: 'column' }}>
            <View style={{ marginRight: 20 }}>
              <Text style={styles.text}>
                rDist: {data.rDist}
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                lDist: {data.lDist}
              </Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="white" />
        )}
      </View>
      <ImageBackground
        style={{
          height: 300, width: 300,
          paddingBottom: 115,
          justifyContent: 'center', alignItems: 'center'
        }}
        source={require('./src/assets/human.png')}>

        <View style={styles.shoulder}>
          <TouchableOpacity onPress={() => toggleMotor(1)}>
            <View style={{ backgroundColor: 'red', width: 100, height: 30, margin: 5, borderRadius: 10, borderTopLeftRadius: 20, transform: [{ rotateZ: '-17deg' }] }}></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleMotor(2)}>
            <View style={{ backgroundColor: 'red', width: 100, height: 30, margin: 5, borderRadius: 10, borderTopRightRadius: 20, transform: [{ rotateZ: '17deg' }] }}></View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => toggleMotor(3)}>
            <View style={{ backgroundColor: 'red', width: 95, height: 40, margin: 4, borderRadius: 10, borderBottomRightRadius: 20, transform: [{ rotateZ: '-15deg' }] }}></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleMotor(4)}>
            <View style={{ backgroundColor: 'red', width: 95, height: 40, margin: 4, borderRadius: 10, borderBottomLeftRadius: 20, transform: [{ rotateZ: '15deg' }] }}></View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => toggleMotor(5)}>
            <View style={{ backgroundColor: 'red', width: 70, height: 20, margin: 5, borderRadius: 10, transform: [{ rotateZ: '-10deg' }] }}></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleMotor(6)}>
            <View style={{ backgroundColor: 'red', width: 70, height: 20, margin: 5, borderRadius: 10, transform: [{ rotateZ: '10deg' }] }}></View>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    </View>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'red',
    width: "50%",
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 10
  },
  shoulder: {
    flexDirection: 'row'
  },
  card: {
    backgroundColor: '#999',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});
