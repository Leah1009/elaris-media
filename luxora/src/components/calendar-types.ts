export type CalendarStaff = { id: string; full_name: string };

export type CalendarAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  notes: string | null;
  staffId: string;
  depositStatus: string;
  depositAmountCents: number;
  depositPaidCents: number;
  client: {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    sms_consent: boolean;
    email_consent: boolean;
  } | null;
  services: { name: string; color: string }[];
  messages: { id: string; channel: string; body: string; status: string; createdAt: string }[];
};

export type CalendarBlock = {
  id: string;
  startAt: string;
  endAt: string;
  staffId: string | null;
  reason: string | null;
};
