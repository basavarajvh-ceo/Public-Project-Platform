
export enum UserRole {
  GUEST = 'GUEST',
  CITIZEN = 'CITIZEN',
  CONTRACTOR = 'CONTRACTOR',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum IssueStatus {
  CITIZEN_SUBMITTED = 'CITIZEN_SUBMITTED', 
  OPEN_FOR_PROPOSAL = 'OPEN_FOR_PROPOSAL', 
  PROPOSAL_UNDER_REVIEW = 'PROPOSAL_UNDER_REVIEW', 
  FUNDING_PHASE = 'FUNDING_PHASE', 
  IN_PROGRESS = 'IN_PROGRESS', 
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export type InvestorInterestStatus = 'INTERESTED' | 'WAITING' | 'DECLINED' | 'NONE' | 'FUNDED';

export interface CivicItem {
  id: string;
  title: string;
  description: string;
  category: 'school' | 'infrastructure' | 'bridge' | 'other';
  type: 'issue' | 'proposal';
  location: {
    lat: number;
    lng: number;
    address: string;
    pincode?: string;
  };
  mediaUrl: string;
  mediaUrls?: string[];
  proposalUrl?: string;
  status: IssueStatus;
  investorStatus?: InvestorInterestStatus;
  submittedBy: string;
  contractorId?: string;
  investorId?: string;
  createdAt: string;
  budget?: number;
  timeline?: string;
}

export interface AuthState {
  user: {
    id: string;
    role: UserRole;
    name: string;
    isApproved: boolean;
    pincode?: string;
    isPremium?: boolean;
  } | null;
}
