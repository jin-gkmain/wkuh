import React, { ReactNode, useEffect, useState, useContext } from 'react';
import Nav from './Nav';
import { useRouter } from 'next/router';
import SideBar from './SideBar';
import Dashboard from './icons/Dashboard';
import Work from './icons/Work';
import Calendar from './icons/Calendar';
import Hospitals from './icons/Hospitals';
import { usePathname } from 'next/navigation';
import PageHeader from './PageHeader';
import Speaker from './icons/Speaker';
import { WorkflowModalContext } from '@/context/WorkflowModalContext';
import useModal from '@/hooks/useModal';
import WorkflowModal from '../modal/WorkflowModal';
import TeleconsulgintModal from '../modal/TeleconsulgintModal';
import { TeleconsultingModalContext } from '@/context/TeleconsultingContext';
import useMe from '@/hooks/useMe';
import ArrowRightLine from './icons/ArrowRightLine';
import ArrowLeftLine from './icons/ArrowLeftLine';
import WithFooter from './WithFooter';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';

type Props = {
  children: ReactNode;
};

type TabType =
  | 'dashboard'
  | 'workflow'
  | 'appointments'
  | 'organizations'
  | 'notice';

const tabs = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
  },
  {
    text: 'Workflow',
    icon: <Work />,
  },
  {
    text: 'Appointments',
    icon: <Calendar />,
  },
  {
    text: 'Organizations',
    icon: <Hospitals />,
  },
  {
    text: 'Notice',
    icon: <Speaker />,
  },
];

export default function Layout({ children }: Props) {
  const { lang } = useContext(LanguageContext);
  const { userInfo, loading } = useMe();
  const { ModalPortal, modalOpened, openModal, closeModal } = useModal();
  const {
    ModalPortal: TeleModalPortal,
    modalOpened: teleModalIsOpened,
    openModal: openTeleModal,
    closeModal: closeTeleModal,
  } = useModal();
  const [sidebarOpened, setSidebarOpened] = useState(true);

  const tabs = [
    {
      tab: 'Dashboard',
      text: langFile[lang].LAYOUT_MENU_1, // 홈
      icon: <Dashboard />,
    },
    {
      tab: 'Workflow',
      text: langFile[lang].LAYOUT_MENU_2, // 진료관리
      icon: <Work />,
    },
    {
      tab: 'Appointments',
      text: langFile[lang].LAYOUT_MENU_3, // 일정관리
      icon: <Calendar />,
    },
    {
      tab: 'Organizations',
      text: langFile[lang].LAYOUT_MENU_4, // 기관관리
      icon: <Hospitals />,
    },
    {
      tab: 'Notice',
      text: langFile[lang].LAYOUT_MENU_5, // 공지사항
      icon: <Speaker />,
    },
  ];

  const router = useRouter();
  const path = usePathname();

  const handleClick = (tab: TabType) => {
    if (userInfo.p_idx) {
      if (tab !== 'workflow') return;
      else {
        return;
      }
    }
    // 몽골 병원 사용자가 organizations tab을 클릭했을 때는 기관목록이 아닌 사용자 목록만 보여야 하므로
    if (tab === 'organizations') {
      if (userInfo.country !== 'korea') {
        router.push(`/${tab}/${userInfo.o_idx}/users`);
        return;
      }
    }
    router.push('/' + tab);
  };

  const handleSidebarToggle = () => {
    setSidebarOpened(!sidebarOpened);
  };

  useEffect(() => {
    if (loading === 'completed' && !userInfo) {
      router.push('/');
      console.log('로딩 끝났는데 유저 정보 확인되지 않는경우');
    }
  }, [loading]);

  if (!userInfo) {
    return null;
  } else {
    return (
      <div className="layout-container">
        {/* 메인 nav */}
        <Nav />

        {/* 컨텐츠 */}
        <main className="contents flex justify-between">
          <TeleconsultingModalContext.Provider
            value={{
              isOpened: teleModalIsOpened,
              closeModal: closeTeleModal,
              openModal: openTeleModal,
            }}
          >
            <WorkflowModalContext.Provider
              value={{
                isOpened: modalOpened,
                openModal,
                closeModal,
              }}
            >
              <ModalPortal>
                <div>
                  <WorkflowModal closeModal={closeModal} />
                </div>
              </ModalPortal>

              <TeleModalPortal>
                <TeleconsulgintModal />
              </TeleModalPortal>

              {/* 메인 컨텐츠 */}
              <div
                className="main-contents relative"
                style={{
                  width: sidebarOpened
                    ? 'calc(100% - 353px - 8px)'
                    : 'calc(100% - 30px)',
                  transition: 'width .8s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <button
                  onClick={handleSidebarToggle}
                  className="sidebar-controller"
                >
                  {sidebarOpened ? <ArrowRightLine /> : <ArrowLeftLine />}
                </button>

                <div className="tabs-wrapper flex">
                  <ul className="tabs flex">
                    {tabs.map(({ tab, text, icon }) => (
                      <li
                        key={text}
                        className={`${
                          !!path?.includes(tab.toLowerCase()) ? 'selected' : ''
                        } flex flex-center gap-5 ${
                          userInfo.p_idx && tab.toLowerCase() !== 'workflow'
                            ? 'tab-disabled'
                            : ''
                        }`}
                        onClick={() =>
                          handleClick(tab.toLowerCase() as TabType)
                        }
                      >
                        {icon}
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* <div className="page">
                  <PageHeader />
                  {children}
                </div> */}
                <div
                  className="page"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  <PageHeader />
                  <WithFooter children={children} sidebarOpened={sidebarOpened}>
                    {/* {children} */}
                  </WithFooter>
                </div>
              </div>

              {/* SideBar */}
              <div
                className="sidebar"
                style={{
                  transition: 'transform .8s',
                  transform: sidebarOpened
                    ? `translateX(0px)`
                    : `translateX(353px)`,
                  position: 'absolute',
                  right: '0px',
                }}
              >
                <SideBar />
              </div>
            </WorkflowModalContext.Provider>
          </TeleconsultingModalContext.Provider>
        </main>
      </div>
    );
  }
}
