/**
 * Mezcla una lista con Fisher-Yates y devuelve una copia (no muta la original).
 *
 * Usa crypto.getRandomValues en lugar de Math.random (SonarQube S2245).
 * En este proyecto solo se usa para barajar el orden de las opciones de una
 * trivia (no es un uso sensible), pero con crypto el hotspot desaparece sin
 * tener que marcarlo manualmente como "Safe". El sesgo por modulo es
 * despreciable para listas de pocos elementos.
 */
export function mezclar(lista) {
  const copia = [...lista];
  const buffer = new Uint32Array(1);

  for (let i = copia.length - 1; i > 0; i--) {
    globalThis.crypto.getRandomValues(buffer);
    const j = buffer[0] % (i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}
