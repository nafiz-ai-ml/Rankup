import { Listing, Payment, BlacklistItem } from "@/types/database";
import { MOCK_LISTINGS, MOCK_PAYMENTS, MOCK_BLACKLIST } from "@/lib/mockData";

// Global mutable cache for mock data when Supabase credentials are placeholder
declare global {
  // eslint-disable-next-line no-var
  var __rankup_admin_listings: Listing[] | undefined;
  // eslint-disable-next-line no-var
  var __rankup_admin_payments: Payment[] | undefined;
  // eslint-disable-next-line no-var
  var __rankup_admin_blacklist: BlacklistItem[] | undefined;
}

export function getAdminListings(): Listing[] {
  if (!global.__rankup_admin_listings) {
    global.__rankup_admin_listings = JSON.parse(JSON.stringify(MOCK_LISTINGS));
  }
  return global.__rankup_admin_listings!;
}

export function updateAdminListing(id: string, updates: Partial<Listing>): Listing | null {
  const listings = getAdminListings();
  const index = listings.findIndex((l) => l.id === id);
  if (index === -1) return null;
  listings[index] = { ...listings[index], ...updates, updated_at: new Date().toISOString() };
  return listings[index];
}

export function getAdminPayments(): Payment[] {
  if (!global.__rankup_admin_payments) {
    global.__rankup_admin_payments = JSON.parse(JSON.stringify(MOCK_PAYMENTS));
  }
  return global.__rankup_admin_payments!;
}

export function updateAdminPayment(id: string, updates: Partial<Payment>): Payment | null {
  const payments = getAdminPayments();
  const index = payments.findIndex((p) => p.id === id);
  if (index === -1) return null;
  payments[index] = { ...payments[index], ...updates };
  return payments[index];
}

export function getAdminBlacklist(): BlacklistItem[] {
  if (!global.__rankup_admin_blacklist) {
    global.__rankup_admin_blacklist = JSON.parse(JSON.stringify(MOCK_BLACKLIST));
  }
  return global.__rankup_admin_blacklist!;
}

export function addAdminBlacklistItem(item: Omit<BlacklistItem, "id" | "created_at">): BlacklistItem {
  const list = getAdminBlacklist();
  const newItem: BlacklistItem = {
    ...item,
    id: `b${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  list.unshift(newItem);
  return newItem;
}

export function removeAdminBlacklistItem(id: string): boolean {
  const list = getAdminBlacklist();
  const index = list.findIndex((b) => b.id === id);
  if (index === -1) return false;
  list.splice(index, 1);
  return true;
}
