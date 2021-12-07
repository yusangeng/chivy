/**
 * 日志配置.
 *
 * @author  yusangeng@outlook.com
 */

/* istanbul ignore file */

import konph from "konph";
import { anything2Level } from "./levelHelper";

export type ChivyConfig = {
  "chivy-level": number;
  "chivy-modules": Array<string>;
  "chivy-driver-flags": Array<string>;
};

export default konph({
  "chivy-level": {
    def: 2, // 等价于WARN
    fit: anything2Level
  },

  "chivy-modules": {
    def: ["**"],
    fit: konph.helper.fit.strings
  },

  "chivy-driver-flags": {
    def: ["color", "level", "module"], // 'color', 'level', 'module', 'time'
    fit: konph.helper.fit.strings
  }
});
