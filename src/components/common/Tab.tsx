import { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";


type props = {
  handleClick: (tab: string) => void,
  tabs: {
    tab: string,
    text: string,
    icon?: ReactNode,
  }[],
}

export default function Tab({ handleClick, tabs }: props) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  return (                
  <div className="tabs-wrapper flex font-size-18 gap-10">
    <ul className="tabs flex">
      {tabs.map(({ tab, text, icon }) => (
        <li
          key={text}
          className={`${
            currentTab === tab.toLowerCase() ? 'selected' : ''
          } flex flex-center gap-5` }
          onClick={() =>
            handleClick(tab.toLowerCase())
          }
        >
          {icon ? icon : ""}
          <span>{text}</span>
        </li>
      ))}
    </ul>
  </div>
  );
}

