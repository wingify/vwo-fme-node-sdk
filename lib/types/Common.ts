export type dynamic =
  | boolean
  | number
  | string
  | Date
  | void
  | undefined
  | null
  | Record<string, any>
  | Array<dynamicArray>
  | Map<string, dynamicArray>;

export type dynamicArray = boolean | number | string | Record<string, any>;
