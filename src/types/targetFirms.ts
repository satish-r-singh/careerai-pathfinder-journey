
export interface TargetFirm {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  alertsEnabled: boolean;
  lastUpdate: string;
  website?: string;
}

export interface Alert {
  id: string;
  firmId: string;
  firmName: string;
  type: 'job_posting' | 'news' | 'people_update' | 'funding';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NewFirmData {
  name: string;
  industry: string;
  size: string;
  location: string;
  priority: 'high' | 'medium' | 'low';
  website: string;
}
