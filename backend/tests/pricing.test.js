describe('Pricing Logic', () => {
  const GST_RATE = 0.18;

  function calcSubtotal(items) {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function calcTax(subtotal) {
    return Math.round(subtotal * GST_RATE * 100) / 100;
  }

  function calcTotal(subtotal) {
    return subtotal + calcTax(subtotal);
  }

  test('calculates correct subtotal for single item', () => {
    expect(calcSubtotal([{ price: 1499, qty: 1 }])).toBe(1499);
  });

  test('calculates correct subtotal for multiple items', () => {
    expect(calcSubtotal([{ price: 1499, qty: 2 }, { price: 599, qty: 1 }])).toBe(3597);
  });

  test('calculates 18% GST correctly', () => {
    expect(calcTax(1000)).toBe(180);
    expect(calcTax(1499)).toBe(269.82);
  });

  test('calculates total correctly', () => {
    const subtotal = calcSubtotal([{ price: 1499, qty: 1 }]);
    expect(calcTotal(subtotal)).toBe(1499 + 269.82);
  });
});
