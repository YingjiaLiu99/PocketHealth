import React, { useState, useRef, useContext } from 'react';
import { View, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ShowcaseBoxWithLabel from '../../../components/ShowcaseBoxWithLabel';
import BigShowcaseBoxWithLabel from '../../../components/BigShowcaseBoxWithLabel';
import ProviderInputBox from './components/ProviderInputBox';
import VisitDataContext from '../../../context/context_VisitData';
import RequestMessContext from '../../../context/context_requestMess';

export default function ProviderResponseScreen({route, navigation}) { 
  const { visit_id } = route.params;
  const { visitData, setVisitData } = useContext(VisitDataContext);
  const { requests, setRequests } = useContext(RequestMessContext);

  const visit = visitData.find(visit => visit.patients.find(patient => patient.visit_id === visit_id));
  const patient = visit ? visit.patients.find(patient => patient.visit_id === visit_id) : null;

  const patientInfo = patient.visitNote.patientInfo;
  const medicalHistory = patient.visitNote.medicalHistory;
  const vitalData = patient.visitNote.vitalData;
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState(''); 
  const subjectiveRef = useRef(null);
  const objectiveRef = useRef(null);
  const assessmentRef = useRef(null);

const handleSubmit = () => {
  // if(assessment === '' || subjective === '' || objective === ''){
  //   setErrorMessage('Please fill in fields.');      
  // }
  if (confirmSubmit) {            
    // publish the visit 
    const updatedVisitData = visitData.map(visit => ({
      ...visit,
      patients: visit.patients.map(patient => 
        patient.visit_id === visit_id ? {
          ...patient,
          published: true,
          visitNote: {
            ...patient.visitNote,
            providerReport: [
              {label: 'Subjective', value: subjective},
              {label: 'Objective', value: objective},
              {label: 'Assessment / Plan', value: assessment},
            ]
          }
        } : patient
      )
    }));
    setVisitData(updatedVisitData);
    // delete the request:
    const updatedRequests = requests.filter(request => request.visit_id !== visit_id);
    setRequests(updatedRequests);
    navigation.navigate('Success');
  } 
  else {
    // Press first time, input is done, so set it true
    setConfirmSubmit(true);  
  }
}
 
  const handleOutsidePress = () => {
    if(confirmSubmit) {
      setConfirmSubmit(false);
    }    
  }; 

return (
  <View style={{flex:1}}>
    <View style={{
      position: 'absolute',              
      paddingTop: 0, 
      backgroundColor: '#DDE5FD', 
      zIndex: 999, 
      elevation: 3, 
      flexDirection: 'column',
      justifyContent: 'space-between',
      height:85
    }}>
      <View>

      <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 25, fontWeight: '500',width:'100%',}}>{patientInfo[0].value}</Text>
      </View>              
      
      <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 20, fontWeight: '400', width: '45%'}}>DOB: {patientInfo[1].value}</Text>
      </View>

      <View style={{ flexDirection: 'row', paddingLeft:5}}>
        <Text style={{fontSize: 20, fontWeight: '400', width: '100%'}}>{patientInfo[2].value} {'['} {patientInfo[3].value} {']'}</Text>
      </View>

      </View>

  </View>

    <ScrollView>
    <KeyboardAwareScrollView contentContainerStyle={{...styles.container, paddingTop: 85}}>
      <Text style={{fontSize:27}}>Visit Note</Text>

      <BigShowcaseBoxWithLabel
        label='Chief Complaint'
        value={patient.visitNote.chiefComplaint}
        unit=''
        width="100%"
      />            

      <View style={{width:'100%'}}>
        <ProviderInputBox 
          label="Subjective"
          value={subjective}
          width="100%"
          placeholder="Click to Enter Your Subjective ..."
          onChangeText={(text) => setSubjective(text)}
          onFocus={handleOutsidePress}
          autoFocus={true}
          returnKeyType={"next"}
          onSubmitEditing={() => objectiveRef.current.focus()}
          ref={subjectiveRef}
        />

        <BigShowcaseBoxWithLabel            
            label='Medical History'
            value={medicalHistory[0].value}
            unit= ''
            width="100%"
        />
        <BigShowcaseBoxWithLabel            
            label='Current Medication/Allergies'
            value={[medicalHistory[1].value, ' [Allergies: ' , medicalHistory[2].value, ']' ]}
            unit= ''
            width="100%"
        />
      </View>

      <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between',}}>
        <ShowcaseBoxWithLabel 
          label={vitalData[0].label}
          value={vitalData[0].value}
          unit={vitalData[0].unit}
          width='30%'
        />
        <ShowcaseBoxWithLabel 
          label={vitalData[1].label}
          value={vitalData[1].value}
          unit={vitalData[1].unit}
          width='30%'
        />
        <ShowcaseBoxWithLabel 
          label={vitalData[2].label}
          value={vitalData[2].value}
          unit={vitalData[2].unit}
          width='30%'
        />
      </View>

      <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between',}}>
        <ShowcaseBoxWithLabel
          label={vitalData[3].label}
          value={vitalData[3].value}
          unit={vitalData[3].unit}
          width='30%'
        />
        <ShowcaseBoxWithLabel
          label={vitalData[4].label}
          value={vitalData[4].value}
          unit={vitalData[4].unit}
          width='30%'
        />
        <ShowcaseBoxWithLabel
          label={vitalData[5].label}
          value={vitalData[5].value}
          unit={vitalData[5].unit}
          width='30%'
        />
      </View>


      <View style={{width:'100%'}}>
        <ProviderInputBox 
          label="Objective"
          value={objective}
          width="100%"
          placeholder="Click to Enter Your Objective ..."
          onChangeText={(text) => setObjective(text)}
          onFocus={handleOutsidePress}
          ref={objectiveRef}
          returnKeyType={"next"}
          onSubmitEditing={() => assessmentRef.current.focus()}
        />

        <ProviderInputBox 
          label="Assessment / Future Plan"
          value={assessment}
          width="100%"
          placeholder="Click to Enter Your Assessment/Future Plan ..."
          onChangeText={(text) => setAssessment(text)}
          onFocus={handleOutsidePress}
          ref={assessmentRef}
          returnKeyType={"done"}
        />
      </View>

      {errorMessage ? <Text style={{color:'red', fontSize:18, marginBottom:10}}>{errorMessage}</Text> : null}

      <View style={{width:'80%',alignItems:'center',marginTop:10,marginBottom:20}}>
        <TouchableOpacity style={confirmSubmit ? styles.confirmButton : styles.normalButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {confirmSubmit ? 'Submit' : 'Confirm'}
          </Text>
        </TouchableOpacity>
      </View>

    
    </KeyboardAwareScrollView>
    </ScrollView>          
  </View>    
  );
};