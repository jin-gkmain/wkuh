import HistorySearchBox from "@/components/common/HistorySearchBox";
import Layout from "@/components/common/Layout";
import MyHead from "@/components/common/MyHead";
import { ReactElement } from "react";

export default function HistoryPage() {
  return (
    <div className="organizations-page page-contents">
      <HistorySearchBox />
    </div>
  );
}

HistoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
