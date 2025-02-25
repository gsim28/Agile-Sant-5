// services/ProfileService.ts
import { supabase } from '../lib/supabase';

export type MedicalProfile = {
  id?: string;
  user_id: string;
  full_name: string;
  dob: string;
  blood_type: string;
  allergies: string[];
  medical_conditions: string[];
  medications: string[];
  emergency_contacts: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  notes: string;
};

export const ProfileService = {
  async getProfile() {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.data.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  async updateProfile(profile: Partial<MedicalProfile>) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');
    
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.data.user.id)
      .single();
    
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select();
        
      if (error) throw error;
      return data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profile,
          user_id: user.data.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      return data;
    }
  }
};