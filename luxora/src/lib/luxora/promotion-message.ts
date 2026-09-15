import { formatCents } from "@/lib/luxora/money";

export function suggestPromotionMessage(
  code: string,
  discountType: string,
  discountValue: number,
  businessName: string,
): string {
  const discount = discountType === "percent" ? `${discountValue}% off` : `${formatCents(discountValue * 100)} off`;
  return `${businessName}: Use code ${code} for ${discount} your next visit!`;
}
