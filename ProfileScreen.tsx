// screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity
} from 'react-native';
import { ProfileService, MedicalProfile } from '../services/ProfileService';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Partial<MedicalProfile>>({
    full_name: '',
    dob: '',
    blood_type: '',
    allergies: [],
    medical_conditions: [],
    medications: [],
    emergency_contacts: [{ name: '', relationship: '', phone: '' }],
    notes: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await ProfileService.getProfile();
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load your medical profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await ProfileService.updateProfile(profile);
      Alert.alert('Success', 'Your medical profile has been updated');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save your medical profile');
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field) => {
    if (!newItem.trim()) return;
    
    setProfile({
      ...profile,
      [field]: [...(profile[field] || []), newItem.trim()]
    });
    setNewItem('');
    setActiveSection(null);
  };

  const removeArrayItem = (field, index) => {
    setProfile({
      ...profile,
      [field]: profile[field].filter((_, i) => i !== index)
    });
  };

  const addEmergencyContact = () => {
    setProfile({
      ...profile,
      emergency_contacts: [
        ...(profile.emergency_contacts || []),
        { name: '', relationship: '', phone: '' }
      ]
    });
  };

  const updateEmergencyContact = (index, field, value) => {
    const updatedContacts = [...profile.emergency_contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    
    setProfile({
      ...profile,
      emergency_contacts: updatedContacts
    });
  };

  const removeEmergencyContact = (index) => {
    setProfile({
      ...profile,
      emergency_contacts: profile.emergency_contacts.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading your medical profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-6">Medical Profile</Text>
      
      <View className="mb-4">
        <Text className="font-medium mb-1">Full Name</Text>
        <TextInput
          value={profile.full_name}
          onChangeText={(text) => setProfile({...profile, full_name: text})}
          placeholder="Enter your full name"
          className="border p-2 rounded"
        />
      </View>
      
      <View className="mb-4">
        <Text className="font-medium mb-1">Date of Birth</Text>
        <TextInput
          value={profile.dob}
          onChangeText={(text) => setProfile({...profile, dob: text})}
          placeholder="MM/DD/YYYY"
          className="border p-2 rounded"
        />
      </View>
      
      <View className="mb-4">
        <Text className="font-medium mb-1">Blood Type</Text>
        <View className="flex-row flex-wrap">
          {BLOOD_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setProfile({...profile, blood_type: type})}
              className={`mr-2 mb-2 px-3 py-2 rounded-full ${
                profile.blood_type === type ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text className={profile.blood_type === type ? 'text-white' : 'text-black'}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Allergies Section */}
      <View className="mb-4">
        <Text className="font-medium mb-1">Allergies</Text>
        {profile.allergies?.map((allergy, index) => (
          <View key={index} className="flex-row items-center mb-1">
            <Text className="flex-1 p-2 bg-red-100 rounded">{allergy}</Text>
            <TouchableOpacity 
              onPress={() => removeArrayItem('allergies', index)}
              className="ml-2 p-1"
            >
              <Text className="text-red-500">X</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {activeSection === 'allergies' ? (
          <View className="flex-row mt-2">
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Add allergy"
              className="flex-1 border p-2 rounded-l"
            />
            <TouchableOpacity
              onPress={() => addArrayItem('allergies')}
              className="bg-blue-500 px-4 justify-center rounded-r"
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setActiveSection('allergies')}
            className="mt-2 border border-dashed p-2 rounded items-center"
          >
            <Text className="text-blue-500">+ Add Allergy</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Medical Conditions Section - similar structure to allergies */}
      <View className="mb-4">
        <Text className="font-medium mb-1">Medical Conditions</Text>
        {profile.medical_conditions?.map((condition, index) => (
          <View key={index} className="flex-row items-center mb-1">
            <Text className="flex-1 p-2 bg-yellow-100 rounded">{condition}</Text>
            <TouchableOpacity 
              onPress={() => removeArrayItem('medical_conditions', index)}
              className="ml-2 p-1"
            >
              <Text className="text-red-500">X</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {activeSection === 'medical_conditions' ? (
          <View className="flex-row mt-2">
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Add medical condition"
              className="flex-1 border p-2 rounded-l"
            />
            <TouchableOpacity
              onPress={() => addArrayItem('medical_conditions')}
              className="bg-blue-500 px-4 justify-center rounded-r"
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setActiveSection('medical_conditions')}
            className="mt-2 border border-dashed p-2 rounded items-center"
          >
            <Text className="text-blue-500">+ Add Medical Condition</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Medications Section - similar structure to allergies */}
      <View className="mb-4">
        <Text className="font-medium mb-1">Medications</Text>
        {profile.medications?.map((medication, index) => (
          <View key={index} className="flex-row items-center mb-1">
            <Text className="flex-1 p-2 bg-green-100 rounded">{medication}</Text>
            <TouchableOpacity 
              onPress={() => removeArrayItem('medications', index)}
              className="ml-2 p-1"
            >
              <Text className="text-red-500">X</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {activeSection === 'medications' ? (
          <View className="flex-row mt-2">
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Add medication"
              className="flex-1 border p-2 rounded-l"
            />
            <TouchableOpacity
              onPress={() => addArrayItem('medications')}
              className="bg-blue-500 px-4 justify-center rounded-r"
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setActiveSection('medications')}
            className="mt-2 border border-dashed p-2 rounded items-center"
          >
            <Text className="text-blue-500">+ Add Medication</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Emergency Contacts */}
      <View className="mb-4">
        <Text className="font-medium mb-1">Emergency Contacts</Text>
        
        {profile.emergency_contacts?.map((contact, index) => (
          <View key={index} className="border rounded p-3 mb-3">
            <View className="flex-row justify-between">
              <Text className="font-medium">Contact #{index + 1}</Text>
              <TouchableOpacity onPress={() => removeEmergencyContact(index)}>
                <Text className="text-red-500">Remove</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              value={contact.name}
              onChangeText={(text) => updateEmergencyContact(index, 'name', text)}
              placeholder="Name"
              className="border p-2 rounded mt-2"
            />
            
            <TextInput
              value={contact.relationship}
              onChangeText={(text) => updateEmergencyContact(index, 'relationship', text)}
              placeholder="Relationship"
              className="border p-2 rounded mt-2"
            />
            
            <TextInput
              value={contact.phone}
              onChangeText={(text) => updateEmergencyContact(index, 'phone', text)}
              placeholder="Phone Number"
              className="border p-2 rounded mt-2"
              keyboardType="phone-pad"
            />
          </View>
        ))}
        
        <TouchableOpacity
          onPress={addEmergencyContact}
          className="border border-dashed p-2 rounded items-center"
        >
          <Text className="text-blue-500">+ Add Emergency Contact</Text>
        </TouchableOpacity>
      </View>
      
      <View className="mb-6">
        <Text className="font-medium mb-1">Additional Notes</Text>
        <TextInput
          value={profile.notes}
          onChangeText={(text) => setProfile({...profile, notes: text})}
          placeholder="Any other important medical information"
          multiline
          numberOfLines={4}
          className="border p-2 rounded h-24 text-base"
        />
      </View>
      
      <Button
        title={saving ? "Saving..." : "Save Medical Profile"}
        onPress={handleSave}
        disabled={saving}
      />
    </ScrollView>
  );
}