/**
 * 全局对象.
 *
 * @author  yusangeng@outlook.com
 */

let g: any;

if (typeof window !== "undefined") {
  g = window;
} else if (typeof global !== "undefined") {
  g = global;
} else if (typeof self !== "undefined") {
  g = self;
} else {
  g = {};
}

export default g;
