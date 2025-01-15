/**
 * 路径封装类.
 *
 * @author  yusangeng@outlook.com
 */

const wildcard = "*";
const doubleWildcard = "**";

const isString = (v: any) => typeof v === "string";

/**
 * 路径封装类.
 *
 * 路径是指形如`a/b/c/d`的字符串, 其中`/`隔开的部分叫做分段, 分段可以为字符串、通配符`*`, 或者多分段通配符`**`
 * 注意, 在一个分段内, 不支持通配符和和其他字符混用.
 *
 * 相当于简陋版的minimatch(https://github.com/isaacs/minimatch).
 *
 * 可以通过赋值Logger.injector.Path替换.
 *
 * @export
 * @class Path
 */
export default class Path {
  private segments_: Array<string>;
  private str_ = "";

  /**
   * 路径分段列表
   *
   * @readonly
   *
   * @memberof Path
   */
  get segments() {
    return this.segments_.slice();
  }

  /**
   * Creates an instance of Path.
   *
   * @param {string|Path} source 路径字符串或其他路径对象, 不可为空字符串
   *
   * @memberof Path
   * @private
   */
  constructor(source: string | Path) {
    const pathStr = typeof source === "string" ? source : source.toString();

    if (!pathStr || !pathStr.trim()) {
      console.warn(`不建议使用空字符串("${pathStr}")构造Path实例.`);
    }

    this.str_ = pathStr;
    this.segments_ = pathStr
      .split(/\/+/)
      .map(el => el.trim())
      .filter(el => el.length);
  }

  /**
   * 转化为字符串
   *
   * @returns {string} 转化结果
   *
   * @memberof Path
   * @instance
   */
  toString(): string {
    return this.str_;
  }

  /**
   * 是否相等
   *
   * @param {string | Path} other 路径字符串或其他路径对象
   * @returns {boolean} 相等返回true, 否则返回false
   *
   * @memberof Path
   * @instance
   */
  equal(other: string | Path): boolean {
    return this.toString() === other.toString();
  }

  /**
   * 是否匹配
   *
   * `a/#/b`可以匹配`a/foobar/b`, `a/##/b`可以匹配`a/foobar/b`、`a/foo/bar/b`以及`a/b`, `##`可以匹配任意路径(#号实际为*号)
   *
   * @param {string | Path} other 路径字符串或其他路径对象, 不可包含通配符
   * @returns {boolean} 匹配返回true, 否则返回false
   *
   * @memberof Path
   * @instance
   */
  match(other: string | Path): boolean {
    const otherPath = isString(other) ? new Path(other as string) : other;

    if (other.toString().indexOf(wildcard) !== -1) {
      throw new Error("被匹配的路径不可包含通配符(*或**).");
    }

    return segmentListMatch(this.segments, (otherPath as Path).segments);
  }
}

enum SegmentMatchResult {
  NotMatch = -1,
  Match = 0,
  NextMatch = 1
}

/**
 * 路径分段匹配算法
 *
 * @param {Array<string>} left
 * @param {Array<string>} right
 * @returns {boolean} 匹配返回true, 否则返回false
 */
function segmentListMatch(left: Array<string>, right: Array<string>): boolean {
  while (left.length && right.length) {
    const currentLeft = left.shift() as string;
    const nextLeft = left[0]; // 如果数组里没元素则为undefined, segmentMatch会认为没有nextLeft可用
    const currentRight = right.shift() as string;

    const segmentResult = segmentMatch(currentLeft, nextLeft, currentRight);

    if (segmentResult === SegmentMatchResult.NotMatch) {
      return false;
    } else if (segmentResult === SegmentMatchResult.Match) {
      if (currentLeft === doubleWildcard) {
        // 把通配符放回去
        left.unshift(currentLeft);
      }
    } else if (segmentResult === SegmentMatchResult.NextMatch) {
      if (currentLeft === doubleWildcard) {
        // 此时需要要把下一个元素取出来, 下次匹配的时候直接从下下个开始
        left.shift();
      }
    }
  }

  if (right.length) {
    return false;
  }

  if (left.length && left.filter(el => el !== doubleWildcard).length) {
    // 如果left中剩下的不止有多段通配符, 则说明匹配失败
    return false;
  }

  return true;
}

/**
 * 单个路径分段匹配算法
 *
 * @param {string} left
 * @param {string} nextLeft
 * @param {string} right
 * @returns {SegmentMatchResult} left匹配right返回Match, nextLeft匹配right返回NextMatch, 不匹配返回NotMatch
 */
function segmentMatch(
  left: string,
  nextLeft: string,
  right: string
): SegmentMatchResult {
  if (left === wildcard) {
    // 通配符
    return SegmentMatchResult.Match;
  }

  if (left === doubleWildcard) {
    // 多分段通配符
    if (segmentMatch(nextLeft, "", right) === SegmentMatchResult.Match) {
      // **/x 或 **/* 或 **/**
      return SegmentMatchResult.NextMatch;
    }

    return SegmentMatchResult.Match;
  }

  if (left === right) {
    return SegmentMatchResult.Match;
  }

  return SegmentMatchResult.NotMatch;
}
