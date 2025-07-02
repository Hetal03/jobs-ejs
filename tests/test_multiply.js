// tests/test_multiply.js
const multiply = require("../utils/multiply");
const get_chai = require("../utils/get_chai");

describe("testing multiply", () => {
  it("should return 7*6 = 42", async () => {
    const { expect } = await get_chai();
    expect(multiply(7, 6)).to.equal(42);
  });

  it("should return 0 when one factor is 0", async () => {
    const { expect } = await get_chai();
    expect(multiply(0, 10)).to.equal(0);
  });

  it("should return negative for one negative", async () => {
    const { expect } = await get_chai();
    expect(multiply(-3, 4)).to.equal(-12);
  });
});


