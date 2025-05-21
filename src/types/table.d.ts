type TableHeadCol = {
  icon?: ReactNode;
  key: string;
  value?: keyof T | null;
  valueType?:
    | 'auto'
    | 'id'
    | 'title'
    | 'body'
    | 'name'
    | 'localName'
    | 'date'
    | 'date-long'
    | 'organization'
    | 'phone'
    | 'address'
    | 'notification'
    | 'country'
    | 'duration'
    | 'number'
    | 'email'
    | 'sep' ;
  type: 'text' | 'button' | 'menu';
};

// type TableMenuOption = 'remove' | 'manage';
type TableMenuOption = 'remove' | 'manage' | 'disabled' | 'activate';
