type ListRes<T> = T[] | '';

type SimpleRes = 'OK' | 'ERROR';

type MyResponse<T> = {
  result: T;
};
