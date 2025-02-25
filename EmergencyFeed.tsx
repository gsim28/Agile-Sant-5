import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { EmergencyService } from '../services/EmergencyService';
import { useAuth } from '../context/AuthContext';

const EmergencyTypeColors = {
  medical: 'bg-red-100 border-red-500',
  accident: 'bg-orange-100 border-orange-500',
  fire: 'bg-amber-100 border-amber-500',
  safety: 'bg-blue-100 border-blue-500',
  other: 'bg-gray-100 border-gray-500'
};

const EmergencyTypeLabels = {
  medical: 'Medical',
  accident: 'Accident',
  fire: 'Fire',
  safety: 'Safety Threat',
  other: 'Other'
};

export default function EmergencyFeed({ navigation }) {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await EmergencyService.getEmergencies();
      if (error) throw error;
      setEmergencies(data || []);
    } catch (error) {
      console.error('Failed to load emergencies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmergencies();

    // Subscribe to real-time updates
    const subscription = EmergencyService.subscribeToEmergencies(payload => {
      setEmergencies(current => [payload.new, ...current]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEmergencies();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderEmergencyItem = ({ item }) => {
    const isUserEmergency = item.user_id === user?.id;
    const colorClass = EmergencyTypeColors[item.type] || EmergencyTypeColors.other;
    
    return (
      <View className={`mb-3 p-4 rounded-lg border ${colorClass}`}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg">
            {EmergencyTypeLabels[item.type] || 'Unknown'} Emergency
          </Text>
          <View className={`px-2 py-1 rounded ${item.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
            <Text className="text-white text-xs font-medium">
              {item.status === 'pending' ? 'Pending' : 'Responded'}
            </Text>
          </View>
        </View>
        
        <Text className="mb-2">
          <Text className="font-medium">Location: </Text>
          {item.location.lat.toFixed(6)}, {item.location.lng.toFixed(6)}
        </Text>
        
        {item.notes && (
          <Text className="mb-2 italic">"{item.notes}"</Text>
        )}
        
        <Text className="text-xs text-gray-500">
          Reported: {formatDate(item.created_at)}
        </Text>
        
        {isUserEmergency && (
          <Text className="mt-1 text-xs font-medium">This is your emergency report</Text>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="red" />
        <Text className="mt-4">Loading emergencies...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Emergency Feed</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EmergencyForm')}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Report</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={emergencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEmergencyItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="py-8 items-center">
            <Text className="text-gray-500">No emergencies reported</Text>
          </View>
        }
      />
    </View>
  );
}