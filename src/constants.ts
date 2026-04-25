import { Department } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Expert care for your heart and cardiovascular system.',
    icon: 'Activity'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Specialized treatment for disorders of the nervous system.',
    icon: 'Brain'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Expert care for musculoskeletal injuries and conditions.',
    icon: 'Bone'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Comprehensive medical care for infants, children, and adolescents.',
    icon: 'Baby'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Care for skin, hair, and nail health.',
    icon: 'Stethoscope'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    description: 'Dedicated treatment and support for cancer patients.',
    icon: 'ShieldAlert'
  }
];

export const INITIAL_DOCTORS = [
  {
    id: 'doc-sarah-wilson',
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiologist',
    department: 'Cardiology',
    experience: '12 years',
    bio: 'Specializing in interventional cardiology and heart failure management.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=256&h=256',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
  },
  {
    id: 'doc-james-miller',
    name: 'Dr. James Miller',
    specialty: 'Neurologist',
    department: 'Neurology',
    experience: '15 years',
    bio: 'Expert in treating neurological disorders including migraines and tremors.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256&h=256',
    availability: ['08:00', '09:00', '13:00', '14:00', '16:00']
  },
  {
    id: 'doc-emily-chen',
    name: 'Dr. Emily Chen',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    experience: '8 years',
    bio: 'Passionate about child healthcare and preventive medicine.',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=256&h=256',
    availability: ['10:00', '11:00', '13:00', '15:00', '17:00']
  }
];
