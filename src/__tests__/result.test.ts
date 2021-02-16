import { Result, ok, err } from "../result";
import { just, nothing } from "../../../ts-maybe/src/maybe";

const toUpper = (s: string) => s.toUpperCase();
const toString1 = (n: number) => n.toString();
const toString2 = (n1: number) => (n2: number) => n1.toString() + n2.toString();
const toString3 = (n1: number) => (n2: number) => (n3: number) =>
  n1.toString() + n2.toString() + n3.toString();
const toString4 = (n1: number) => (n2: number) => (n3: number) => (
  n4: number
) => n1.toString() + n2.toString() + n3.toString() + n4.toString();
const toString5 = (n1: number) => (n2: number) => (n3: number) => (
  n4: number
) => (n5: number) =>
  n1.toString() + n2.toString() + n3.toString() + n4.toString() + n5.toString();
const concat3 = (s1: string) => (s2: string) => (s3: string) => s1 + s2 + s3;
const concat4 = (s1: string) => (s2: string) => (s3: string) => (s4: string) =>
  s1 + s2 + s3 + s4;
const concat5 = (s1: string) => (s2: string) => (s3: string) => (
  s4: string
) => (s5: string) => s1 + s2 + s3 + s4 + s5;
const add1 = (n: number) => n + 1;
const add2 = (n1: number) => (n2: number) => n1 + n2;
const add3 = (n1: number) => (n2: number) => (n3: number) => n1 + n2 + n3;
const add4 = (n1: number) => (n2: number) => (n3: number) => (n4: number) =>
  n1 + n2 + n3 + n4;
const add5 = (n1: number) => (n2: number) => (n3: number) => (n4: number) => (
  n5: number
) => n1 + n2 + n3 + n4 + n5;
const toInt = (s: string) => {
  const i = parseInt(s);
  return isNaN(i) ? err("bad input") : ok(i);
};
const toValidMonth = (n: number) =>
  n < 1 || n > 12 ? err("bad input") : ok(n);

test("Result.withDefault function", () => {
  const result = ok(1);
  const actual = Result.withDefault(0)(result);
  expect(actual).toBe(1);
});

test("Result.withDefault method", () => {
  const result = ok(1);
  const actual = result.withDefault(0);
  expect(actual).toBe(1);
});

test("Result.map function with int", () => {
  const result = ok(1);
  const actual = Result.map(add1)(result);
  expect(actual).toStrictEqual(ok(2));
});

test("Result.map method with int", () => {
  const result = ok(1);
  const actual = result.map(add1);
  expect(actual).toStrictEqual(ok(2));
});

test("Result.map function with string", () => {
  const result = ok("hello");
  const actual = Result.map(toUpper)(result);
  expect(actual).toStrictEqual(ok("HELLO"));
});

test("Result.map method with string", () => {
  const result = ok("hello");
  const actual = result.map(toUpper);
  expect(actual).toStrictEqual(ok("HELLO"));
});

test("Result.map function int to string", () => {
  const result = ok(1);
  const actual = Result.map(toString1)(result);
  expect(actual).toEqual(ok("1"));
});

test("Result.map int method to string", () => {
  const result = ok(1);
  const actual = result.map(toString1);
  expect(actual).toEqual(ok("1"));
});

test("Result.map function with err", () => {
  const result = err("bad input");
  const actual = Result.map(toUpper)(result);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map method with err", () => {
  const result = err("bad input");
  const actual = result.map(toUpper);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.andThen function with ok", () => {
  const result = toInt("1");
  const actual = Result.andThen(toValidMonth)(result);
  expect(actual).toStrictEqual(ok(1));
});

test("Result.andThen method with ok", () => {
  const result = toInt("1");
  const actual = result.andThen(toValidMonth);
  expect(actual).toStrictEqual(ok(1));
});

test("Result.map method chain", () => {
  const result = ok(1);
  const actual = result.map(add1).map(add1).map(add1).map(add1);
  expect(actual).toStrictEqual(ok(5));
});

test("Result.andThen method chain", () => {
  const actual = ok("1").andThen(toInt).andThen(toValidMonth);
  expect(actual).toStrictEqual(ok(1));
});

test("Result.andThen method chain fail early", () => {
  const actual = ok("one").andThen(toInt).andThen(toValidMonth);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.andThen method chain fail late", () => {
  const actual = ok("13").andThen(toInt).andThen(toValidMonth);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map chain Result.andThen", () => {
  const actual = ok(1)
    .map(add1)
    .map(toString1)
    .andThen(toInt)
    .map(add1)
    .andThen(toValidMonth);
  expect(actual).toStrictEqual(ok(3));
});

test("Result.andThen method with early err", () => {
  const result = toInt("a");
  const actual = result.andThen(toValidMonth);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.andThen method with late err", () => {
  const result = toInt("13");
  const actual = result.andThen(toValidMonth);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map2 with ints", () => {
  const r1 = ok(1),
    r2 = ok(2);
  const actual = Result.map2(add2)(r1)(r2);
  expect(actual).toStrictEqual(ok(3));
});

test("Result.map2 with err first", () => {
  const r1 = ok(1),
    r2 = err("bad input");
  const actual = Result.map2(add2)(r1)(r2);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map2 with err second", () => {
  const r1 = err("bad input"),
    r2 = ok(1);
  const actual = Result.map2(add2)(r1)(r2);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map2 int to string", () => {
  const r1 = ok(1),
    r2 = ok(2);
  const actual = Result.map2(toString2)(r1)(r2);
  expect(actual).toStrictEqual(ok("12"));
});

test("Result.map3 with err first", () => {
  const r1 = err("bad input"),
    r2 = ok(2),
    r3 = ok(3);
  const actual = Result.map3(add3)(r1)(r2)(r3);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map3 with err second", () => {
  const r1 = ok(1),
    r2 = err("bad input"),
    r3 = ok(3);
  const actual = Result.map3(add3)(r1)(r2)(r3);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map3 with err third", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = err("bad input");
  const actual = Result.map3(add3)(r1)(r2)(r3);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map3 with ints", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3);
  const actual = Result.map3(add3)(r1)(r2)(r3);
  expect(actual).toStrictEqual(ok(6));
});

test("Result.map3 with strings", () => {
  const r1 = ok("first"),
    r2 = ok("second"),
    r3 = ok("third");
  const actual = Result.map3(concat3)(r1)(r2)(r3);
  expect(actual).toStrictEqual(ok("firstsecondthird"));
});

test("Result.map3 int to string", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3);
  const actual = Result.map3(toString3)(r1)(r2)(r3);
  expect(actual).toStrictEqual(ok("123"));
});

test("Result.map4 with err first", () => {
  const r1 = err("bad input"),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4);
  const actual = Result.map4(add4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map4 with err second", () => {
  const r1 = ok(1),
    r2 = err("bad input"),
    r3 = ok(3),
    r4 = ok(4);
  const actual = Result.map4(add4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map4 with err third", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = err("bad input"),
    r4 = ok(4);
  const actual = Result.map4(add4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map4 with err fourth", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = err("bad input");
  const actual = Result.map4(add4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map4 with ints", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4);
  const actual = Result.map4(add4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(ok(10));
});

test("Result.map4 with strings", () => {
  const r1 = ok("first"),
    r2 = ok("second"),
    r3 = ok("third"),
    r4 = ok("fourth");
  const actual = Result.map4(concat4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(ok("firstsecondthirdfourth"));
});

test("Result.map4 int to string", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4);
  const actual = Result.map4(toString4)(r1)(r2)(r3)(r4);
  expect(actual).toStrictEqual(ok("1234"));
});

test("Result.map5 with err first", () => {
  const r1 = err("bad input"),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4),
    r5 = ok(5);
  const actual = Result.map5(add5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map5 with err second", () => {
  const r1 = ok(1),
    r2 = err("bad input"),
    r3 = ok(3),
    r4 = ok(4),
    r5 = ok(5);
  const actual = Result.map5(add5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map5 with err third", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = err("bad input"),
    r4 = ok(4),
    r5 = ok(5);
  const actual = Result.map5(add5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map5 with err fourth", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = err("bad input"),
    r5 = ok(5);
  const actual = Result.map5(add5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map5 with err fifth", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4),
    r5 = err("bad input");
  const actual = Result.map5(add5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(err("bad input"));
});

test("Result.map5 with ints", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4),
    r5 = ok(5);
  const actual = Result.map5(add5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(ok(15));
});

test("Result.map5 with strings", () => {
  const r1 = ok("first"),
    r2 = ok("second"),
    r3 = ok("third"),
    r4 = ok("fourth"),
    r5 = ok("fifth");
  const actual = Result.map5(concat5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(ok("firstsecondthirdfourthfifth"));
});

test("Result.map5 int to string", () => {
  const r1 = ok(1),
    r2 = ok(2),
    r3 = ok(3),
    r4 = ok(4),
    r5 = ok(5);
  const actual = Result.map5(toString5)(r1)(r2)(r3)(r4)(r5);
  expect(actual).toStrictEqual(ok("12345"));
});

test("Result.mapError function", () => {
  const result = err("should be caps");
  const actual = Result.mapError(toUpper)(result);
  expect(actual).toStrictEqual(err("SHOULD BE CAPS"));
});

test("Result.mapError method", () => {
  const result = err("should be caps");
  const actual = result.mapError(toUpper);
  expect(actual).toStrictEqual(err("SHOULD BE CAPS"));
});

test("Result.fromMaybe nothing", () => {
  const actual = Result.fromMaybe("error from nothing")(nothing);
  expect(actual).toStrictEqual(err("error from nothing"));
});

test("Result.fromMaybe just(1)", () => {
  const actual = Result.fromMaybe("error")(just(1));
  expect(actual).toStrictEqual(ok(1));
});

test("Result.toMaybe function error", () => {
  const actual = Result.toMaybe(err("error"));
  expect(actual).toStrictEqual(nothing);
});

test("Result.toMaybe function ok(1)", () => {
  const actual = Result.toMaybe(ok(1));
  expect(actual).toStrictEqual(just(1));
});

test("Result.toMaybe method ok(1)", () => {
  const result = ok(1);
  const actual = result.toMaybe();
  expect(actual).toStrictEqual(just(1));
});

test("Result.toMaybe method error", () => {
  const result = err("error");
  const actual = result.toMaybe();
  expect(actual).toStrictEqual(nothing);
});
