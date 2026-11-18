# yup `keyof InferType` includes `undefined` for optional properties

`keyof InferType<…>` of an `ObjectSchema<T>` includes `undefined` when `T` has optional (`?:`) properties. `OptionalKeys` preserves the optional modifier when mapping over `T`, so the `[keyof T]` lookup also returns `undefined`:

https://github.com/jquense/yup/blob/ff31eee8a2b10c938bb3a22544d9e33957a8cf01/src/util/objectTypes.ts#L62-L64

[`index.ts`](./index.ts):

```ts
import { type InferType, type ObjectSchema, object, string } from 'yup';

type Contact = {
  email: string;
  newsletter?: string;
};

const contactSchema: ObjectSchema<Contact> = object({
  email: string().required(),
  newsletter: string(),
});

type ContactOutput = InferType<typeof contactSchema>;

// Expected type: 'email' | 'newsletter'
type ContactOutputKey = keyof ContactOutput;

// Should be a type error, because undefined is not a key
const undefinedKey: ContactOutputKey = undefined;
// Should be a type error, because 'phone' is not a key
const unknownKey: ContactOutputKey = 'phone';
```

## Steps to reproduce

1. Install dependencies: `pnpm install`
2. Check types: `pnpm check-types`

Expected: 2 errors, for `undefined` and `'phone'`

Actual: 1 error, `undefined` is accepted as a key (yup 1.7.1, TypeScript 5.9.3):

```bash
$ pnpm check-types
$ tsc
index.ts(21,7): error TS2322: Type '"phone"' is not assignable to type '"email" | OptionalKeys<Contact>'.
```

With `-?` added to `OptionalKeys` in `node_modules/yup/index.d.ts` (`[k in keyof T]-?: undefined extends T[k] ? k : never;`):

```bash
$ pnpm check-types
$ tsc
index.ts(19,7): error TS2322: Type 'undefined' is not assignable to type '"email" | "newsletter"'.
index.ts(21,7): error TS2322: Type '"phone"' is not assignable to type '"email" | "newsletter"'.
```
