import { Result, ok, err } from "../result";
import { just, nothing } from "../../../ts-maybe/src/maybe";

describe("Result", () => {
  describe("Result.of", () => {
    describe("truthy values return ok(value)", () => {
      test("Result.of(1) is ok(1)", () => {
        const actual = Result.of(1);
        expect(actual).toStrictEqual(ok(1));
      });
    });
    describe("falsy values", () => {
      describe("undefined and null return err", () => {
        test("Result.of(null) returns err('null value')", () => {
          const actual = Result.of(null);
          expect(actual).toStrictEqual(err("null value"));
        });
        test("Result.of(undefined) returns err('null value')", () => {
          const actual = Result.of(undefined);
          expect(actual).toStrictEqual(err("null value"));
        });
      });
      describe("other falsy values are ok(value)", () => {
        test("Result.of(false) returns ok(false)", () => {
          const actual = Result.of(false);
          expect(actual).toStrictEqual(ok(false));
        });
        test("Result.of(0) returns ok(0)", () => {
          const actual = Result.of(0);
          expect(actual).toStrictEqual(ok(0));
        });
        test("Result.of(-0) returns ok(-0)", () => {
          const actual = Result.of(-0);
          expect(actual).toStrictEqual(ok(-0));
        });
        test("Result.of('') returns ok('')", () => {
          const actual = Result.of("");
          expect(actual).toStrictEqual(ok(""));
        });
        test("Result.of(NaN) returns ok(NaN)", () => {
          const actual = Result.of(NaN);
          expect(actual).toStrictEqual(ok(NaN));
        });
      });
    });
  });
  describe("Result.fromMaybe", () => {
    test("with nothing returns err", () => {
      const actual = Result.fromMaybe("error from nothing")(nothing);
      expect(actual).toStrictEqual(err("error from nothing"));
    });

    test("with just(value) returns ok(value)", () => {
      const actual = Result.fromMaybe("error")(just(1));
      expect(actual).toStrictEqual(ok(1));
    });
  });
  describe("Result.withDefault", () => {
    describe("as function", () => {
      test("with err returns default value", () => {
        const actual = Result.withDefault(0)(err(""));
        expect(actual).toBe(0);
      });
      test("with ok(value) returns value", () => {
        const actual = Result.withDefault(0)(ok(1));
        expect(actual).toBe(1);
      });
    });
    describe("as method", () => {
      test("with err returns default value", () => {
        const actual = err("").withDefault(0);
        expect(actual).toBe(0);
      });
      test("with ok(value) returns value", () => {
        const actual = ok(1).withDefault(0);
        expect(actual).toBe(1);
      });
    });
  });
  describe("Result.toMaybe", () => {
    describe("as function", () => {
      test("with err returns nothing", () => {
        const actual = Result.toMaybe(err("error"));
        expect(actual).toStrictEqual(nothing);
      });
      test("with ok(value) returns just(value)", () => {
        const actual = Result.toMaybe(ok(1));
        expect(actual).toStrictEqual(just(1));
      });
    });
    describe("as method", () => {});
    test("with err returns nothing", () => {
      const actual = err("error").toMaybe();
      expect(actual).toStrictEqual(nothing);
    });
    test("with ok(value) returns just(value)", () => {
      const actual = ok(1).toMaybe();
      expect(actual).toStrictEqual(just(1));
    });
  });
  describe("Result.map", () => {
    const add1 = (n: number) => n + 1;
    const toString = (n: number) => n.toString();

    describe("as function", () => {
      test("with err return err", () => {
        const actual = Result.map(toString)(err("null value"));
        expect(actual).toStrictEqual(err("null value"));
      });
      test("with ok(value) applies function", () => {
        const actual = Result.map(toString)(ok(1));
        expect(actual).toStrictEqual(ok("1"));
      });
    });
    describe("as method", () => {
      test("with err return err", () => {
        const actual = err("null value").map(toString);
        expect(actual).toStrictEqual(err("null value"));
      });
      test("with ok(value) applies function", () => {
        const actual = ok(1).map(toString);
        expect(actual).toStrictEqual(ok("1"));
      });
      test("can chain mapped functions", () => {
        const actual = ok(1)
          .map(add1)
          .map(add1)
          .map(add1)
          .map(add1)
          .map(toString);
        expect(actual).toStrictEqual(ok("5"));
      });
    });
  });
  describe("Result.mapError", () => {
    const toUpper = (s: string) => s.toUpperCase();
    describe("as function", () => {
      test("with err applies function", () => {
        const actual = Result.mapError(toUpper)(err("should be caps"));
        expect(actual).toStrictEqual(err("SHOULD BE CAPS"));
      });
      test("with ok(value) does nothing", () => {
        const actual = Result.mapError(toUpper)(ok("don't touch me"));
        expect(actual).toStrictEqual(ok("don't touch me"));
      });
    });
    describe("as method", () => {
      test("with err applies function", () => {
        const actual = err("should be caps").mapError(toUpper);
        expect(actual).toStrictEqual(err("SHOULD BE CAPS"));
      });
      test("with ok(value) does nothing", () => {
        const actual = ok("don't touch me").mapError(toUpper);
        expect(actual).toStrictEqual(ok("don't touch me"));
      });
    });
  });
  describe("Result.andThen", () => {
    const add1 = (n: number) => n + 1;
    const toString = (n: number) => n.toString();
    const toInt = (s: string) => {
      const i = parseInt(s);
      return isNaN(i) ? err("bad input") : ok(i);
    };
    const toValidMonth = (n: number) =>
      n < 1 || n > 12 ? err("bad input") : ok(n);

    describe("as function", () => {
      test("with err returns err", () => {
        const actual = Result.andThen(toInt)(err("null value"));
        expect(actual).toStrictEqual(err("null value"));
      });
      test("with ok(value) applies function", () => {
        const actual = Result.andThen(toInt)(ok("1"));
        expect(actual).toStrictEqual(ok(1));
      });
    });
    describe("as method", () => {
      test("with err early", () => {
        const actual = err("null value").andThen(toInt);
        expect(actual).toStrictEqual(err("null value"));
      });
      test("with err late", () => {
        const actual = ok(13).andThen(toValidMonth);
        expect(actual).toStrictEqual(err("bad input"));
      });
      test("can chain andThen", () => {
        const actual = ok("1").andThen(toInt).andThen(toValidMonth);
        expect(actual).toStrictEqual(ok(1));
      });
      test("can chain with map", () => {
        const actual = ok("1")
          .andThen(toInt)
          .map(add1)
          .map(add1)
          .map(add1)
          .map(add1)
          .andThen(toValidMonth)
          .map(toString);
        expect(actual).toStrictEqual(ok("5"));
      });
    });
  });
  describe("Result.map2", () => {
    const add2 = (n1: number) => (n2: number) => n1 + n2;
    test("with err first", () => {
      const actual = Result.map2(add2)(err("null value"))(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err second", () => {
      const actual = Result.map2(add2)(ok(1))(err("null value"));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with valid input", () => {
      const actual = Result.map2(add2)(ok(1))(ok(1));
      expect(actual).toStrictEqual(ok(2));
    });
  });
  describe("Result.map3", () => {
    const add3 = (n1: number) => (n2: number) => (n3: number) => n1 + n2 + n3;
    test("with err first", () => {
      const actual = Result.map3(add3)(err("null value"))(ok(1))(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err second", () => {
      const actual = Result.map3(add3)(ok(1))(err("null value"))(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err third", () => {
      const actual = Result.map3(add3)(ok(1))(ok(1))(err("null value"));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with valid input", () => {
      const actual = Result.map3(add3)(ok(1))(ok(1))(ok(1));
      expect(actual).toStrictEqual(ok(3));
    });
  });
  describe("Result.map4", () => {
    const add4 = (n1: number) => (n2: number) => (n3: number) => (n4: number) =>
      n1 + n2 + n3 + n4;
    test("with err first", () => {
      const actual = Result.map4(add4)(err("null value"))(ok(1))(ok(1))(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err second", () => {
      const actual = Result.map4(add4)(ok(1))(err("null value"))(ok(1))(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err third", () => {
      const actual = Result.map4(add4)(ok(1))(ok(1))(err("null value"))(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err fourth", () => {
      const actual = Result.map4(add4)(ok(1))(ok(1))(ok(1))(err("null value"));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with valid input", () => {
      const actual = Result.map4(add4)(ok(1))(ok(1))(ok(1))(ok(1));
      expect(actual).toStrictEqual(ok(4));
    });
  });
  describe("Result.map5", () => {
    const add5 = (n1: number) => (n2: number) => (n3: number) => (
      n4: number
    ) => (n5: number) => n1 + n2 + n3 + n4 + n5;
    test("with err first", () => {
      const actual = Result.map5(add5)(err("null value"))(ok(1))(ok(1))(ok(1))(
        ok(1)
      );
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err second", () => {
      const actual = Result.map5(add5)(ok(1))(err("null value"))(ok(1))(ok(1))(
        ok(1)
      );
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err third", () => {
      const actual = Result.map5(add5)(ok(1))(ok(1))(err("null value"))(ok(1))(
        ok(1)
      );
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err fourth", () => {
      const actual = Result.map5(add5)(ok(1))(ok(1))(ok(1))(err("null value"))(
        ok(1)
      );
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err fifth", () => {
      const actual = Result.map5(add5)(ok(1))(ok(1))(ok(1))(ok(1))(
        err("null value")
      );
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with valid input", () => {
      const actual = Result.map5(add5)(ok(1))(ok(1))(ok(1))(ok(1))(ok(1));
      expect(actual).toStrictEqual(ok(5));
    });
  });
  describe("Result.andMap", () => {
    const add3 = (n1: number) => (n2: number) => (n3: number) => n1 + n2 + n3;
    test("with err first", () => {
      const actual = ok(add3)
        .andMap(err("null value"))
        .andMap(ok(1))
        .andMap(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err second", () => {
      const actual = ok(add3)
        .andMap(ok(1))
        .andMap(err("null value"))
        .andMap(ok(1));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("with err third", () => {
      const actual = ok(add3)
        .andMap(ok(1))
        .andMap(ok(1))
        .andMap(err("null value"));
      expect(actual).toStrictEqual(err("null value"));
    });
    test("without function as first argument", () => {
      const actual = ok(1).andMap(ok(1));
      expect(actual).toStrictEqual(
        err({
          error: "not a function",
          message:
            "Result.andMap can be called only on a Result<E, (f: (arg: A) => B)>.",
        })
      );
    });
    test("with valid input", () => {
      const actual = ok(add3).andMap(ok(1)).andMap(ok(1)).andMap(ok(1));
      expect(actual).toStrictEqual(ok(3));
    });
  });
});
