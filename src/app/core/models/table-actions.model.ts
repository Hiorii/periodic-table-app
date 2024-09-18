export interface TableActions<T> {
  name: string;
  callback: (row: T) => void;
}
