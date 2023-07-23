import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackActions } from '@react-navigation/native';

import VitalsInputBoxWithLabel from './components/VitalsInputBoxWithLabel';
import styles from './styles';


export default function UploadVitals({ navigation }) {
  const labelProperties = {
    'Pain Level(0~10,0-no pain,10-worst pain)': { unit: '', width: '95%' },
    'Temperature': { unit: 'F', width: '95%' },
    'Blood Pressure': { unit: 'mmHg', width: '95%' },
    'Pulse': { unit: 'bpm', width: '95%' },
    'Oxygen': { unit: '%', width: '95%' },
    'Glucose': { unit: 'mg/dl', width: '95%' },
    'Weight': { unit: 'Lbs', width: '95%' },
    // Add more entries as needed
  };

  // initialize all the vitals to null
  const initialInputValues = Object.keys(labelProperties).reduce((values, label) => {
    values[label] = '';
    return values;
  }, {});

  // function to check if the patient enter any vital
  const isInputEmpty = (inputValues) => {
    for (let key in inputValues) {
      if (inputValues[key] !== '') {
        return false;
      }
    }
    return true;
  };


  const [inputValues, setInputValues] = useState(initialInputValues);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 

  const handleInputChange = (label, value) => {
    setInputValues({
      ...inputValues,
      [label]: value,
    });
    // input is on going, so set it false
    if (confirmSubmit) {
      setConfirmSubmit(false);
    }
  };

  const handleSubmit = () => {

    // Set error message
    if (isInputEmpty(inputValues)) {
      setErrorMessage('Please fill in fields.');
      return;
    }
    else {
      setErrorMessage('');
    }
   
    if (confirmSubmit) {
              
      // prevent user to go back from Upload MedHis to Upload Vitals 
      navigation.dispatch(StackActions.replace('Upload MedHis'));
      setConfirmSubmit(false);
  
    } 
    else {
      // Press first time, input is done, so set it true
      setConfirmSubmit(true);  
    }
  };

  const handleSkip = () => {
    navigation.dispatch(StackActions.replace('Upload MedHis')); 
  };

  // When press outside of the target button, it reverse to not confirm to submit
  const handleOutsidePress = () => {
    if(confirmSubmit) {
      setConfirmSubmit(false);
    }
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
      <ScrollView style={{flex: 1}}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      
        <View style={{marginTop: 20,marginBottom:20,width:'100%'}}>
          <Text style={{fontSize:35, fontWeight:400}}>Update My Vitals</Text>          
        </View> 

        <View style={{width:"100%"}}>
          {Object.entries(labelProperties).map(([label, properties], index) => (
            <VitalsInputBoxWithLabel
              key={index}
              label={label}
              value={inputValues[label] || ''}
              unit={properties.unit}
              width={properties.width}
              onChange={(value) => handleInputChange(label, value)}
            />
          ))}
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}  

        <View style={{width:'80%',alignItems:'center',marginTop:0,marginBottom:0}}>
          <TouchableOpacity style={confirmSubmit ? styles.confirmButton : styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {confirmSubmit ? 'Submit' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        </View>

      < View style={{width:'80%',alignItems:'center',marginTop:0,marginBottom:0}}>
          <TouchableOpacity style={styles.button} onPress={handleSkip}>
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
