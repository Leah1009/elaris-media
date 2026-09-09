export const BUSINESS_TYPES = [
  { value: "hair_salon", label: "Hair Salon" },
  { value: "nail_salon", label: "Nail Salon" },
  { value: "lash_studio", label: "Lash Studio" },
  { value: "brow_studio", label: "Brow Studio" },
  { value: "makeup_studio", label: "Makeup Studio" },
  { value: "beauty_suite", label: "Beauty Suite" },
  { value: "full_service_beauty_salon", label: "Full Service Beauty Salon" },
  { value: "other", label: "Other" },
] as const;

export type BusinessTypeValue = (typeof BUSINESS_TYPES)[number]["value"];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function randomSlugSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}
