import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { EmergencyService } from '../services/EmergencyService';

export default function EmergencyForm({ navigation }) {
  const [type, setType] = useState('medical');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for emergency reporting.');
        return;
      }

      try {
        setLocationLoading(true);
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        });
      } catch (error) {
        Alert.alert('Location Error', 'Could not determine your location. Please try again.');
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Missing Location', 'We need your location to send emergency services.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await EmergencyService.submitEmergency({
        type,
        location,
        notes
      });

      if (error) throw error;

      Alert.alert(
        'Emergency Reported',
        'Your emergency has been reported. Help is on the way.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit emergency: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-5">Report Emergency</Text>

      {locationLoading ? (
        <View className="mb-4 items-center">
          <ActivityIndicator size="large" color="red" />
          <Text className="mt-2">Getting your location...</Text>
        </View>
      ) : location ? (
        <View className="mb-4 bg-green-100 p-3 rounded-lg">
          <Text className="text-green-800">
            Location detected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </Text>
        </View>
      ) : (
        <View className="mb-4 bg-red-100 p-3 rounded-lg">
          <Text className="text-red-800">Could not detect location</Text>
          <Button title="Retry" onPress={() => navigation.replace('EmergencyFormModal')} />
        </View>
      )}

      <Text className="mb-2 font-medium">Emergency Type</Text>
      <View className="border rounded mb-4">
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Medical Emergency" value="medical" />
          <Picker.Item label="Accident" value="accident" />
          <Picker.Item label="Fire" value="fire" />
          <Picker.Item label="Safety Threat" value="safety" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <Text className="mb-2 font-medium">Additional Notes</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={setNotes}
        placeholder="Describe your emergency (symptoms, situation, etc.)"
        className="border rounded p-2 mb-6 h-32 text-base"
      />

      <Button
        title={loading ? "Submitting..." : "Report Emergency"}
        onPress={handleSubmit}
        disabled={loading || locationLoading || !location}
        color="red"
      />
    </View>
  );
}