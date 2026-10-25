export type VIPTier = 'Diamond Atelier' | 'Gold Privé' | 'Silver Silhouette' | 'Member';

export type RevisitStatus = 'due_soon' | 'on_cadence' | 'overdue' | 'rebooked';

export type ReminderStatus = 'scheduled' | 'queued' | 'sent' | 'responded' | 'confirmed' | 'snoozed';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read' | 'responded' | 'failed';

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vipTier: VIPTier;
  preferredStylist: string;
  tags: string[];
  totalVisits: number;
  lifetimeValue: number;
  avgTicket: number;
  lastVisitDate: string; // ISO date 'YYYY-MM-DD'
  lastService: string;
  nextCadenceDate: string; // ISO date 'YYYY-MM-DD'
  cadenceWeeks: number;
  revisitStatus: RevisitStatus;
  notes: string;
  colorFormula?: string;
  preferredContactWindow?: string;
  birthday?: string;
  avatarSeed?: string;
  createdAt: string;
}

export interface VisitRecord {
  id: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  stylist: string;
  date: string;
  totalAmount: number;
  notes: string;
  cadenceWeeks: number;
}

export interface Reminder {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientTier: VIPTier;
  serviceName: string;
  cadenceWeeks: number;
  dueDate: string; // 'YYYY-MM-DD'
  status: ReminderStatus;
  channel: 'WhatsApp';
  messageTemplateId: string;
  customMessage?: string;
  lastSentAt?: string;
  respondedAt?: string;
  revisitDateScheduled?: string;
  failureReason?: string;
}

export interface MessageLog {
  id: string;
  reminderId?: string;
  clientId: string;
  clientName: string;
  phone: string;
  serviceName: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  respondedAt?: string;
  status: MessageDeliveryStatus;
  messageBody: string;
  failureReason?: string;
  responseBody?: string;
  channel: 'WhatsApp';
}

export interface MessageTemplate {
  id: string;
  name: string;
  triggerEvent: string;
  triggerDaysBeforeOrAfter: number; // e.g. -2 for 48h before, +30 for 30d after
  text: string;
  isActive: boolean;
  category: 'Cadence Check-in' | 'Appointment Care' | 'VIP Milestone' | 'Post-Care Ritual';
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  location: string;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  whatsappProvider: 'simulation' | 'cloud_api' | 'twilio';
  whatsappPhoneNumber: string;
  isSimulationMode: boolean;
  autoCadenceEnabled: boolean;
  defaultCadences: {
    [serviceName: string]: number; // weeks
  };
  templates: MessageTemplate[];
  staff: Stylist[];
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatarInitials: string;
  activeClientsCount: number;
}

export interface DashboardMetrics {
  retentionRate: number; // e.g. 91.8
  retentionRateDelta: number; // e.g. +3.4
  activeClients: number;
  activeClientsDelta: number;
  avgTicket: number;
  avgTicketDelta: number;
  dueRemindersCount: number;
  overdueRemindersCount: number;
  messagesSentThisMonth: number;
  deliverySuccessRate: number;
  responseRate: number;
  rebookedThisMonth: number;
  revisitTrends: {
    month: string;
    targetCadence: number;
    actualRevisits: number;
    retentionRate: number;
  }[];
  cohortRetention: {
    service: string;
    cadenceWeeks: number;
    revisitRate: number;
    clientCount: number;
    avgSpend: number;
  }[];
}
