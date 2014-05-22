///<reference path="../reference.ts" />

module Plottable {
  export module Utils {

    /**
     * Checks if x is between a and b.
     *
     * @param {number} x The value to test if in range
     * @param {number} a The beginning of the (inclusive) range
     * @param {number} b The ending of the (inclusive) range
     * @return {boolean} Whether x is in [a, b]
     */
    export function inRange(x: number, a: number, b: number) {
      return (Math.min(a,b) <= x && x <= Math.max(a,b));
    }

    /**
     * Takes two arrays of numbers and adds them together
     *
     * @param {number[]} alist The first array of numbers
     * @param {number[]} blist The second array of numbers
     * @return {number[]} An array of numbers where x[i] = alist[i] + blist[i]
     */
    export function addArrays(alist: number[], blist: number[]): number[] {
      return alist.map((_: number, i: number) => alist[i] + blist[i]);
    }

    export function accessorize(accessor: any): IAccessor {
      if (typeof(accessor) === "function") {
        return (<IAccessor> accessor);
      } else if (typeof(accessor) === "string" && accessor[0] !== "#") {
        return (d: any, i: number, s: any) => d[accessor];
      } else {
        return (d: any, i: number, s: any) => accessor;
      };
    }

    export function applyAccessor(accessor: IAccessor, dataSource: DataSource) {
      var activatedAccessor = accessorize(accessor);
      return (d: any, i: number) => activatedAccessor(d, i, dataSource.metadata());
    }

    export function uniq(strings: string[]): string[] {
      var seen: {[s: string]: boolean} = {};
      strings.forEach((s) => seen[s] = true);
      return d3.keys(seen);
    }

    export function translate(s: D3.Selection, x?: number, y?: number) {
      var xform = d3.transform(s.attr("transform"));
      if (x == null) {
        return xform.translate;
      } else {
        y = (y == null) ? 0 : y;
        xform.translate[0] = x;
        xform.translate[1] = y;
        s.attr("transform", xform.toString());
        return s;
      }
    }

    /**
     * Creates an array of length `count`, filled with value or (if value is a function), value()
     *
     * @param {any} value The value to fill the array with, or, if a function, a generator for values
     * @param {number} count The length of the array to generate
     * @return {any[]}
     */
    export function createFilledArray(value: any, count: number) {
      var out: any[] = [];
      for (var i = 0; i<count; i++) {
        out[i] = typeof(value) === "function" ? value(i) : value;
      }
      return out;
    }
  }
}
