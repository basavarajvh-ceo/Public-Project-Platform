
import React from 'react';
import { CivicItem, IssueStatus } from './types';

export const MOCK_ISSUES: CivicItem[] = [
  {
    id: 'CIT-101',
    title: 'Green Energy Primary School - Sector 4',
    description: 'Construction of a zero-emission primary school equipped with solar panels and rainwater harvesting to support the growing population sustainably.',
    category: 'school',
    type: 'proposal',
    location: { lat: 12.9716, lng: 77.5946, address: 'Sector 4, HSR Layout' },
    mediaUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.CITIZEN_SUBMITTED,
    submittedBy: 'Cit-1',
    createdAt: '2023-10-01'
  },
  {
    id: 'CIT-102',
    title: 'Smart Pedestrian Skywalk - MG Road',
    description: 'An AI-monitored, fully accessible skywalk over the busy intersection to ensure pedestrian safety and smooth traffic flow.',
    category: 'bridge',
    type: 'issue',
    location: { lat: 12.9352, lng: 77.6245, address: 'MG Road, Bangalore' },
    mediaUrl: 'https://images.unsplash.com/photo-1506269085878-5c33839927e9?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1506269085878-5c33839927e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.OPEN_FOR_PROPOSAL,
    submittedBy: 'Cit-2',
    createdAt: '2023-11-15',
    budget: 85000000
  },
  {
    id: 'CIT-103',
    title: 'Tech-Enabled Community Hub - Whitefield',
    description: 'Upgrading the local community center with high-speed internet, co-working spaces, and digital literacy training facilities.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 12.9562, lng: 77.7011, address: 'Whitefield, Bangalore' },
    mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.FUNDING_PHASE,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-1',
    investorStatus: 'WAITING',
    submittedBy: 'Cit-3',
    createdAt: '2023-11-20',
    budget: 150000000
  },
  {
    id: 'CIT-104',
    title: 'Solar-Powered Water Purification Plant',
    description: 'A large-scale, off-grid water purification facility utilizing advanced reverse osmosis and solar energy to provide clean drinking water to 50,000 residents.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 13.0827, lng: 80.2707, address: 'North Chennai' },
    mediaUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441314-1f4144186d3e?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.IN_PROGRESS,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-2',
    investorStatus: 'FUNDED',
    submittedBy: 'Cit-4',
    createdAt: '2023-12-05',
    budget: 320000000
  },
  {
    id: 'CIT-105',
    title: 'Rural Connectivity Highway Expansion',
    description: 'Expanding the existing 2-lane state highway to a 4-lane expressway with smart tolling and wildlife corridors.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 18.5204, lng: 73.8567, address: 'Pune-Nashik Highway' },
    mediaUrl: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.FUNDING_PHASE,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-3',
    investorStatus: 'WAITING',
    submittedBy: 'Cit-5',
    createdAt: '2023-12-10',
    budget: 1250000000
  },
  {
    id: 'CIT-106',
    title: 'Advanced Medical Research & Diagnostic Center',
    description: 'State-of-the-art medical facility focusing on genomic research and advanced diagnostics for rare diseases.',
    category: 'other',
    type: 'proposal',
    location: { lat: 17.3850, lng: 78.4867, address: 'Jubilee Hills, Hyderabad' },
    mediaUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.PROPOSAL_UNDER_REVIEW,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-4',
    submittedBy: 'Cit-6',
    createdAt: '2024-01-15',
    budget: 850000000
  },
  {
    id: 'CIT-107',
    title: 'AI-Driven Traffic Management System',
    description: 'City-wide implementation of AI cameras and smart traffic lights to reduce congestion and emergency response times by 30%.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 28.7041, lng: 77.1025, address: 'Central Delhi' },
    mediaUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.OPEN_FOR_PROPOSAL,
    submittedBy: 'Cit-7',
    createdAt: '2024-01-20',
    budget: 450000000
  },
  {
    id: 'CIT-108',
    title: 'Sustainable Waste-to-Energy Plant',
    description: 'Processing 500 tons of municipal solid waste daily to generate 10MW of clean electricity for the local grid.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 19.0760, lng: 72.8777, address: 'Deonar, Mumbai' },
    mediaUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.IN_PROGRESS,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-5',
    investorStatus: 'FUNDED',
    submittedBy: 'Cit-8',
    createdAt: '2024-02-01',
    budget: 680000000
  },
  {
    id: 'CIT-109',
    title: 'High-Speed Rail Corridor - Phase 1',
    description: 'Initial 50km stretch of the new high-speed rail network connecting major economic zones with travel times reduced by 60%.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad to Surat' },
    mediaUrl: 'https://images.unsplash.com/photo-1564694230-2212e3e15037?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1564694230-2212e3e15037?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.FUNDING_PHASE,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-6',
    investorStatus: 'WAITING',
    submittedBy: 'Cit-9',
    createdAt: '2024-02-10',
    budget: 5500000000
  },
  {
    id: 'CIT-110',
    title: 'Smart Grid Electrical Upgrade',
    description: 'Modernizing the city electrical grid with smart meters and automated load balancing to eliminate blackouts.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 12.2958, lng: 76.6394, address: 'Mysuru City' },
    mediaUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.COMPLETED,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-7',
    investorStatus: 'FUNDED',
    submittedBy: 'Cit-10',
    createdAt: '2023-08-15',
    budget: 210000000
  },
  {
    id: 'CIT-111',
    title: 'Eco-Friendly Public Transit Hub',
    description: 'A central transit hub integrating electric buses, metro, and bike-sharing, powered entirely by renewable energy.',
    category: 'infrastructure',
    type: 'proposal',
    location: { lat: 10.8505, lng: 76.2711, address: 'Kochi, Kerala' },
    mediaUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.CITIZEN_SUBMITTED,
    submittedBy: 'Cit-11',
    createdAt: '2024-02-18'
  },
  {
    id: 'CIT-112',
    title: 'Cybersecurity Training Institute',
    description: 'A specialized educational facility dedicated to training the next generation of cybersecurity experts for government and private sectors.',
    category: 'school',
    type: 'proposal',
    location: { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' },
    mediaUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.PROPOSAL_UNDER_REVIEW,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-8',
    submittedBy: 'Cit-12',
    createdAt: '2024-02-20',
    budget: 340000000
  },
  {
    id: 'CIT-113',
    title: 'Agri-Tech Innovation Center',
    description: 'Research and development center focusing on precision farming, drone technology, and drought-resistant crop varieties.',
    category: 'other',
    type: 'proposal',
    location: { lat: 30.9010, lng: 75.8573, address: 'Ludhiana, Punjab' },
    mediaUrl: 'https://images.unsplash.com/photo-1586771107513-047d771925c5?auto=format&fit=crop&w=800&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1586771107513-047d771925c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'
    ],
    status: IssueStatus.IN_PROGRESS,
    proposalUrl: '#proposal-file-ppt',
    contractorId: 'Con-9',
    investorStatus: 'FUNDED',
    submittedBy: 'Cit-13',
    createdAt: '2024-01-05',
    budget: 420000000
  }
];

export const CATEGORIES = [
  { value: 'school', label: 'Schools & Education', icon: <i className="fas fa-school"></i> },
  { value: 'infrastructure', label: 'General Infrastructure', icon: <i className="fas fa-building"></i> },
  { value: 'bridge', label: 'Bridges & Overpasses', icon: <i className="fas fa-bridge"></i> },
  { value: 'other', label: 'Others', icon: <i className="fas fa-ellipsis-h"></i> }
];
