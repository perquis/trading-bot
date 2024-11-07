import { calculatedPriceWithTreshold } from "@/utils/calculated-price-with-treshold";

describe("calculatedPriceWithTreshold", () => {
  it("should return calculated price with treshold", () => {
    expect(calculatedPriceWithTreshold(100, 5)).toBe(105);
    expect(calculatedPriceWithTreshold(100, -5)).toBe(95);
  });
});
