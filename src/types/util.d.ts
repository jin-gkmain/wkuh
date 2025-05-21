type DropdownOption<T> = {
  text: string;
  type: T;
  allowed?: boolean;
};

// type ModalType =
//   | 'new'
//   | 'manage'
//   | 'view'
//   | 'remove'
//   | 'confirm'
//   | 'download'
//   | 'completed';

type ModalType =
  | 'new'
  | 'manage'
  | 'view'
  | 'remove'
  | 'confirm'
  | 'download'
  | 'completed'
  | 'activate'
  | 'disabled'
  | 'qr';
