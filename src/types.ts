export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
}

export interface Doctor {
  id: string;
  userId?: string;
  name: string;
  specialty: string;
  department: string;
  experience: string;
  bio: string;
  imageUrl: string;
  availability: string[]; // Standard times (fallback)
  schedule?: Record<string, string[]>; // Date-specific availability: { "2024-05-10": ["09:00", "10:00"] }
}

export interface Appointment {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  title: string;
  url: string;
  notes: string;
  date: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}
