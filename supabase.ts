import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

export const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl,
  Constants.expoConfig?.extra?.supabaseAnonKey
);