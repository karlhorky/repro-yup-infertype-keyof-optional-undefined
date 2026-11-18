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
