/** HEX color model i.e. `#XXX` or `#XXXXXX`. */
export type ModelHEX = `#${number}${number}${number}` | `#${number}${number}${number}${number}${number}${number}`;

/** RGB color model i.e. `rgb(A, B, C)`, where _A,B,C_ – numbers in range _[0, 255]_. */
export type ModelRGB = `rgb(${number}, ${number}, ${number})`;

/** RGBA color model i.e. `rgba(A, B, C, D)`, where
 * - _A, B, C_ – numbers in range _[0, 255]_;
 * - _D_ – _[0, 1]_.
 */
export type ModelRGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
