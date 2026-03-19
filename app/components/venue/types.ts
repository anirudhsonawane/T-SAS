export type TicketStatus = "available" | "sold_out";

export type VenueSectionId = "seating" | "festival" | "vip" | "premium";

export type VenueSection = {
  id: VenueSectionId;
  label: string;
  colorName: string;
  price: number;
  availabilityText: string;
  status: TicketStatus;
  accent: "purple" | "yellow" | "orange" | "red";
};

