import { describe, test, expect } from 'vitest';
import { mezclar } from './mezclar';

describe('mezclar (Fisher-Yates, Issue #43)', () => {
  test('conserva los mismos elementos', () => {
    const original = ['a', 'b', 'c', 'd'];
    const resultado = mezclar(original);

    expect(resultado).toHaveLength(original.length);
    expect([...resultado].sort()).toEqual([...original].sort());
  });

  test('no muta la lista original', () => {
    const original = [1, 2, 3, 4, 5];
    mezclar(original);

    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  test('maneja listas vacias y de un solo elemento', () => {
    expect(mezclar([])).toEqual([]);
    expect(mezclar(['x'])).toEqual(['x']);
  });
});
