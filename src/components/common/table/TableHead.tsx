import React from 'react';

type Props = {
  tds: TableHeadCol[];
};

export default function TableHead({ tds }: Props) {
  return (
    <thead className="table-header w-full thead">
      <tr className="table-row w-full">
        {tds.map(({ key, value, type, valueType, icon }, idx) => (
          <th
            className={`${
              type === 'button'
                ? 'table-row-btn'
                : type === 'menu'
                ? 'table-row-menu menu'
                : ''
            } ${valueType ? valueType : ''} text-center`}
            key={idx}
          >
            {icon && icon}
            {type === 'text' ? key : ''}
          </th>
        ))}
      </tr>
    </thead>
  );
}
