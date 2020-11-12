import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase, { utils } from '@react-native-firebase/app';

function CheckPillScreen({ navigation, route }) {

  const { info } = route.params;

  const [name, setName] = useState("");
  const [refillUnits, setRefillUnits] = useState("");
  const [freq, setFreq] = useState("");
  const [dosage, setDosage] = useState("");
  const [freqUnits, setFreqButton] = useState(null);
  const [foodButton, setFoodButton] = useState(null);
  const [drowsyButton, setDrowsyButton] = useState(null);

  function sendNewUserInfo(){
    console.log(name, firebase.auth().currentUser.uid, refillUnits, dosage, freq, freqUnits, foodButton, drowsyButton);

    /* Make sure inputs are valid */
    if (name == "") {
      Alert.alert("Please enter a valid medication name");
      return;
    }
    var refill = parseInt(refillUnits);
    var dose = parseInt(dosage);
    var frq = parseInt(freq);
    if (isNaN(refill) || refill <= 0) {
      Alert.alert("Please enter a valid number of units for refill field");
      return;
    } else if (isNaN(frq) || frq <= 0 || frq > refill) {
      Alert.alert("Please enter a valid number of units for frequency field");
      return;
    } else if (freqUnits == null) {
      Alert.alert("Make a selection for frequency field");
      return;
    } else if (foodButton == null) {
      Alert.alert("Make a selection for food field");
      return;
    } else if (drowsyButton == null) {
      Alert.alert("Make a selection for drowsiness field");
      return;
    }

    /* MORE COMPLEX ERROR HANDLING */
    if (freqUnits == "weekly" && (frq > 6)) { // eg. can't have 8 pills weekly
      Alert.alert("Invalid number of pills for weekly frequency");
      return;
    } else if (foodButton && (frq > 3)) {
      Alert.alert("Invalid frequency for a pill taken with food");
      return;
    } else if (drowsyButton && (frq != 1)) {
      Alert.alert("Pills causing drowsiness can only be scheduled once a day!");
      return;
    }

    fetch('http://ec2-3-96-185-233.ca-central-1.compute.amazonaws.com:3000/pills', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        userId: firebase.auth().currentUser.uid,
        totalQuantity: refillUnits,
        remaining: refillUnits,
        frequency: freq,
        frequencyUnit: freqUnits,
        withFood: foodButton,
        withSleep: drowsyButton,
        dosage: dosage,
      })
    })
    .catch((error) => {
      console.error(error);
    });

    navigation.navigate("Home");
  }

  useEffect(() => {
    setName(name => info.name);
    setRefillUnits(refillUnits => info.totalQuantity);
    setFreq(freq => info.frequency);
    setFreqButton(freqUnits => info.frequencyUnit);
    setFoodButton(foodButton => info.withFood);
    setDrowsyButton(drowsyButton => info.withSleep);
    setDosage(dosage => info.dosage);
  }, [info]);

  return (
    <ScrollView>
      <View  style={styles.container}>
      <Text style={styles.title}>New Prescription</Text>

      <View style={{height: 30}} />

      <View style={styles.form_container}>

        <Text style={styles.form_titles}>1 - Medication Name</Text>
        <TextInput
          testID="Medication-Name"
          placeholder = "Medication Name"
          style= {styles.input}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText = {(text) => setName(text)}
          defaultValue = {name}
        />

        <Text style={styles.form_titles}>2 - Number of Units in Refill</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            testID="Units-Refill"
            placeholder = "Units"
            style= {styles.number_input}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='numeric'
            onChangeText = {(text) => setRefillUnits(text)}
            defaultValue = {refillUnits ? refillUnits.toString() : ""}
          />
          <Text style={styles.text}>  units</Text>
        </View>

        <Text style={styles.form_titles}>3 - Frequency</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.text}>Take  </Text>
          <TextInput
            testID="Units-Dosage"
            placeholder = "Units"
            style= {styles.number_input}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='numeric'
            onChangeText = {(text) => setDosage(text)}
            defaultValue = {dosage ? dosage.toString() : ""}
          />
          <Text style={styles.text}>  units, </Text>
          <TextInput
            placeholder = "Units"
            testID="Units-Frequency"
            style= {styles.number_input}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='numeric'
            onChangeText = {(text) => setFreq(text)}
            defaultValue = {freq ? freq.toString() : ""}
          />
          <Text style={styles.text}>  times</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: -15}}>
          <TouchableOpacity testID="Daily" style={freqUnits == "daily" ? styles.radioButtonPressed : styles.radioButtonUnPressed} onPress={()=>setFreqButton("daily")}/>
          <Text style={styles.radioText}>  Daily</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity testID="Weekly" style={freqUnits == "weekly" ? styles.radioButtonPressed : styles.radioButtonUnPressed} onPress={()=>setFreqButton("weekly")} />
          <Text style={styles.radioText}>  Weekly</Text>
        </View>
        <View style={{height: 20}} />

        <Text style={styles.form_titles}>4 - Take with Food?</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity testID="Food-Yes" style={foodButton == true ? styles.radioButtonPressed : styles.radioButtonUnPressed} onPress={()=>setFoodButton(true)}/>
          <Text style={styles.radioText}>  Yes</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity testID="Food-No" style={foodButton == false ? styles.radioButtonPressed : styles.radioButtonUnPressed} onPress={()=>setFoodButton(false)} />
          <Text style={styles.radioText}>  No</Text>
        </View>
        <View style={{height: 20}} />

        <Text style={styles.form_titles}>5 - Does it cause drowsiness?</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity testID="Sleep-Yes" style={drowsyButton == true ? styles.radioButtonPressed : styles.radioButtonUnPressed} onPress={()=>setDrowsyButton(true)}/>
          <Text style={styles.radioText}>  Yes</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity testID="Sleep-No" style={drowsyButton == false ? styles.radioButtonPressed : styles.radioButtonUnPressed} onPress={()=>setDrowsyButton(false)} />
          <Text style={styles.radioText}>  No</Text>
        </View>
        <View style={{height: 20}} />

      </View>

      <View style={{flexDirection: 'row', padding: 10, justifyContent:'space-between'}}>
        <TouchableOpacity style={styles.button}
                          onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
                          onPress={() => sendNewUserInfo()}>
          <Text style={styles.btnText}>VERIFY</Text>
        </TouchableOpacity>
      </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 35,
    color: '#538083'
  },
  form_container: {
    flex: 1,
  },
  form_titles: {
    fontFamily: 'Quicksand',
    fontSize: 20,
    color: '#538083',
    textDecorationLine: "underline",
  },
  input: {
    width: 315,
    height: 38,
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 5,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'Inter-Light'
  },
  number_input: {
    width: 53,
    height: 38,
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 5,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    fontFamily: 'Inter-Light',
  },
  text: {
    fontFamily: 'Quicksand',
    fontSize: 20, color: '#000000',
    paddingTop: 26,
  },
  button: {
    height: 60,
    width: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9FB7B9',
    borderRadius: 35,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  btnText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  },
  radioButtonPressed:{
    backgroundColor: '#538083',
    borderRadius: 100,
    height: 20,
    width: 20,
    marginTop: 0
  },
  radioButtonUnPressed:{
    borderRadius: 100,
    height: 20,
    width: 20,
    marginTop: 0,
    borderWidth: 1.5,
    borderColor: '#538083',
  },
  radioText: {
    fontFamily: 'Quicksand',
    fontSize: 20, color: '#000000',
  }
});

export default CheckPillScreen;
