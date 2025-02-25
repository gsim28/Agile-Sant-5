import { supabase } from '../lib/supabase';

type EmergencyData = {
  type: string;
  location: { lat: number; lng: number };
  notes?: string;
};

export const EmergencyService = {
  async submitEmergency(data: EmergencyData) {
    const user = supabase.auth.getUser();
    return supabase.from('emergencies').insert({
      ...data,
      user_id: (await user).data.user?.id,
      status: 'pending'
    });
  },

  async getEmergencies() {
    return supabase
      .from('emergencies')
      .select('*')
      .order('created_at', { ascending: false });
  },

  subscribeToEmergencies(callback: (payload: any) => void) {
    return supabase
      .channel('emergency-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emergencies' }, callback)
      .subscribe();
  }
};