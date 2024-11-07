import { currencyFormat } from "@/utils/currency-format";

describe("currencyFormat", () => {
  it("should return the formatted currency", () => {
    expect(currencyFormat(10, 2)).toBe("$20.00");
  });
});
