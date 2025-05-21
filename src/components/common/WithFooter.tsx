import React, { ReactNode, useContext } from 'react';
import footerLogo from '../../../public/images/footer-logo.png';
import Image from 'next/image';
import { LanguageContext } from '@/context/LanguageContext';
import langFile from '@/lang';

type Props = {
  children: ReactNode;
  sidebarOpened: boolean;
};

export default function WithFooter({ children, sidebarOpened }: Props) {
  const { lang } = useContext(LanguageContext);
  return (
    <div                   
    style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'auto',
      overflowX: 'hidden',
    }}>
      {children}
      <footer
        className="footer"
        style={{
          width: sidebarOpened ? 'calc(100% + 8px)' : '100vw',
          transition: 'width .8s',
          backgroundColor: 'white',
          flexShrink: 0,
        }}

      >
        <div className="flex align-center gap-20 flex-1 h-full justify-center">
          <Image src={footerLogo} width={70} height={38} alt="footer-logo" />
          <div className="flex flex-col gap-10">
            <div className="flex gap-10">
              <span>{langFile[lang].FOOTER_ADDRESS_TEXT}</span>
              <span>healthcare@kakao.com</span>
            </div>
            <p className="copyright">
              copyright © 2024 <span>KOIHEALTHCARE</span> Co., Ltd. All rights
              reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
