export type DestinationType = "website" | "x_profile";
export type ListingStatus = "pending_payment" | "active" | "archived" | "removed";
export type PaymentStatus = "pending" | "succeeded" | "failed";
export type RankEventType = "created" | "boosted" | "outbid" | "reclaimed" | "expired";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_name: string;
  sort_order: number;
  created_at: string;
}

export interface Listing {
  id: string;
  destination_type: DestinationType;
  destination_url: string | null;
  x_handle: string | null;
  normalized_key: string;
  slug: string;
  title: string;
  short_description: string | null;
  image_url: string | null;
  favicon_url: string | null;
  category_id: string;
  status: ListingStatus;
  first_paid_at: string | null;
  expires_at: string | null;
  click_count: number;
  created_at: string;
  updated_at: string;
  // Joined or denormalized fields
  category?: Category;
  spend?: ListingSpend;
  rank?: number;
}

export interface ListingSpend {
  listing_id: string;
  all_time_total: number;
  today_total: number;
  today_date: string;
  last_paid_at: string | null;
  updated_at: string;
}

export interface Payment {
  id: string;
  listing_id: string;
  paddle_event_id: string | null;
  paddle_transaction_id: string | null;
  paddle_customer_email: string | null;
  amount_usd: number;
  status: PaymentStatus;
  boost_window_expires_at: string | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
}

export interface RankEvent {
  id: string;
  listing_id: string;
  event_type: RankEventType;
  previous_rank: number | null;
  new_rank: number | null;
  amount_usd: number | null;
  created_at: string;
}

export interface BlacklistItem {
  id: string;
  pattern: string;
  type: "domain" | "x_handle" | "keyword";
  reason: string | null;
  created_at: string;
}
