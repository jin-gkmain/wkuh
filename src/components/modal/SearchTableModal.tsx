import React, { ReactNode } from 'react';
import ModalFrame from './ModalFrame';
import TableHead from '../common/table/TableHead';

type Props = {
  tds: TableHeadCol[];
  closeModal: () => void;
  children: ReactNode;
};

export default function SearchTableModal({ closeModal, children, tds }: Props) {
  return (
    <div className="search-table-modal">
      <ModalFrame
        hideBtns={true}
        title="담당자 선택"
        onClose={closeModal}
        onComplete={() => {}}
      >
        <table className="table">
          <TableHead tds={tds} />
          {/* <div className="t-head">
            {tds.map(({ key, type, value, valueType }) => {
              return (
                <span className={valueType ? valueType : ''} key={key}>
                  {type === 'text' ? key : ''}
                </span>
              );
            })}
          </div> */}
          <tbody>{children}</tbody>
        </table>
      </ModalFrame>
    </div>
  );
}
