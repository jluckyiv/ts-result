import { just, nothing, Maybe } from "../../ts-maybe/src/maybe";

interface ResultInterface<E, A> {
  kind: "Ok" | "Err";
  withDefault: (defaultValue: A) => A;
  map: <B>(f: (arg: A) => B) => Result<E, B>;
  mapError: <F>(f: (arg: E) => F) => Result<F, A>;
  andThen: <B>(f: (arg: A) => Result<E, B>) => Result<E, B>;
  andMap: <B>(f: Result<E, FunctionValue<A, B> | B>) => Result<E, A>;
  toMaybe: (arg: Result<E, A>) => Maybe<A>;
}

interface FunctionValue<A, B> {
  value: (_: A) => B;
}

interface ErrMessage {
  error: string;
  message: string;
}

class Err<E> implements ResultInterface<E, unknown> {
  kind: "Err";
  error: E;

  constructor(error: E) {
    this.kind = "Err";
    this.error = error;
  }

  withDefault(defaultValue: unknown) {
    return withDefault(defaultValue)(this);
  }

  map(_: (arg: any) => unknown): Result<E, any> {
    return this;
  }

  mapError<F>(f: (arg: E) => F): Result<F, unknown> {
    return mapError(f)(this);
  }

  andThen(_: (_: any) => Result<E, unknown>): Result<E, any> {
    return this;
  }

  andMap(_: Result<E, unknown>) {
    return this;
  }

  toMaybe(): Maybe<unknown> {
    return toMaybe(this);
  }
}

class Ok<A> implements ResultInterface<unknown, A> {
  kind: "Ok";
  value: A;

  constructor(value: A) {
    this.kind = "Ok";
    this.value = value;
  }

  withDefault(_: A): A {
    return this.value;
  }

  map<B>(f: (arg: A) => B): Result<unknown, B> {
    return map(f)(this);
  }

  mapError<F>(_: (arg: any) => F): Result<F, any> {
    return this;
  }

  andThen<B>(f: (arg: A) => Result<unknown, B>): Result<unknown, B> {
    return andThen(f)(this);
  }

  andMap<B>(f: Result<unknown, FunctionValue<A, B> | B>): Result<unknown, A> {
    return andMap(this)(f);
  }

  toMaybe(): Maybe<A> {
    return toMaybe(this);
  }
}

const of = (value: unknown) => {
  if (value != null) {
    return ok(value);
  } else {
    return err("null value");
  }
};

const withDefault = <E, A>(defaultValue: A) => (result: Result<E, A>): A => {
  switch (result.kind) {
    case "Ok":
      return result.value;
    case "Err":
      return defaultValue;
  }
};

const andThen = <E, A, B>(f: (arg: A) => Result<E, B>) => (
  result: Result<E, A>
): Result<E, B> => {
  switch (result.kind) {
    case "Ok":
      return f(result.value);
    case "Err":
      return result;
  }
};

const fromMaybe = <E, A>(error: E) => (maybe: Maybe<A>): Result<E, A> => {
  switch (maybe.kind) {
    case "Just":
      return ok(maybe.value);
    case "Nothing":
      return err(error);
  }
};

const toMaybe = <E, A>(result: Result<E, A>): Maybe<A> => {
  if (result.kind === "Ok") {
    return just(result.value);
  } else {
    return nothing;
  }
};

const map = <E, A, B>(f: (arg: A) => B) => (
  result: Result<E, A>
): Result<E, B> => {
  switch (result.kind) {
    case "Ok":
      return ok(f(result.value));
    case "Err":
      return result;
  }
};

const mapError = <E, F, A>(f: (arg: E) => F) => (
  result: Result<E, A>
): Result<F, A> => {
  switch (result.kind) {
    case "Ok":
      return result;
    case "Err":
      return err(f(result.error));
  }
};

const map2 = <E, A, B, C>(f: (argA: A) => (argB: B) => C) => (
  resultA: Result<E, A>
) => (resultB: Result<E, B>): Result<E, C> => {
  if (resultA.kind === "Err") {
    return resultA;
  } else if (resultB.kind === "Err") {
    return resultB;
  } else {
    return ok(f(resultA.value)(resultB.value));
  }
};

const map3 = <E, A, B, C, D>(f: (argA: A) => (argB: B) => (argC: C) => D) => (
  resultA: Result<E, A>
) => (resultB: Result<E, B>) => (resultC: Result<E, C>): Result<E, D> => {
  if (resultA.kind === "Err") {
    return resultA;
  } else if (resultB.kind === "Err") {
    return resultB;
  } else if (resultC.kind === "Err") {
    return resultC;
  } else {
    return ok(f(resultA.value)(resultB.value)(resultC.value));
  }
};

const map4 = <E, A, B, C, D, F>(
  f: (argA: A) => (argB: B) => (argC: C) => (argD: D) => F
) => (resultA: Result<E, A>) => (resultB: Result<E, B>) => (
  resultC: Result<E, C>
) => (resultD: Result<E, D>): Result<E, F> => {
  if (resultA.kind === "Err") {
    return resultA;
  } else if (resultB.kind === "Err") {
    return resultB;
  } else if (resultC.kind === "Err") {
    return resultC;
  } else if (resultD.kind === "Err") {
    return resultD;
  } else {
    return ok(f(resultA.value)(resultB.value)(resultC.value)(resultD.value));
  }
};

const map5 = <E, A, B, C, D, F, G>(
  f: (argA: A) => (argB: B) => (argC: C) => (argD: D) => (argF: F) => G
) => (resultA: Result<E, A>) => (resultB: Result<E, B>) => (
  resultC: Result<E, C>
) => (resultD: Result<E, D>) => (resultF: Result<E, F>): Result<E, G> => {
  if (resultA.kind === "Err") {
    return resultA;
  } else if (resultB.kind === "Err") {
    return resultB;
  } else if (resultC.kind === "Err") {
    return resultC;
  } else if (resultD.kind === "Err") {
    return resultD;
  } else if (resultF.kind === "Err") {
    return resultF;
  } else {
    return ok(
      f(resultA.value)(resultB.value)(resultC.value)(resultD.value)(
        resultF.value
      )
    );
  }
};

const andMap = <E, A, B>(maybeFunction: Result<E, FunctionValue<A, B> | B>) => (
  result: Result<E, A>
): Result<E | ErrMessage, B> => {
  if (result.kind === "Err") {
    return result;
  } else if (maybeFunction.kind === "Err") {
    return maybeFunction;
  } else if (typeof maybeFunction.value !== "function") {
    return err({
      error: "not a function",
      message:
        "Result.andMap can be called only on a Result<E, (f: (arg: A) => B)>.",
    });
  } else {
    return ok(maybeFunction.value(result.value));
  }
};

export const Result = {
  andThen: andThen,
  fromMaybe: fromMaybe,
  map2: map2,
  map3: map3,
  map4: map4,
  map5: map5,
  map: map,
  mapError: mapError,
  of: of,
  toMaybe: toMaybe,
  withDefault: withDefault,
};

export type Result<E, A> = Ok<A> | Err<E>;
export const ok = <A>(value: A) => new Ok(value);
export const err = <E>(error: E) => new Err(error);
