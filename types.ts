// Auth Types
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type AuthResponse = {
  data: {
    user: User | null;
    session: any;
  };
  error: Error | null;
};

// Emergency Types
export type Emergency = {
  id: string;
  user_id: string;
  type: 'medical' | 'accident' | 'fire' | 'safety' | 'other';
  location: {
    lat: number;
    lng: number;
  };
  notes?: string;
  status: 'pending' | 'responded';
  created_at: string;
};

// Profile Types
export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

export type MedicalProfile = {
  id?: string;
  user_id: string;
  full_name: string;
  dob: string;
  blood_type: string;
  allergies: string[];
  medical_conditions: string[];
  medications: string[];
  emergency_contacts: EmergencyContact[];
  notes: string;
};
