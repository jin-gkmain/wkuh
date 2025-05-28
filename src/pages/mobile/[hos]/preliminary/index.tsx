import { testSlides } from "@/components/common/SlidesContent";
import MobileLayout from "@/components/pages/mobile/MobileLayout";
import PreliminaryLayout from "@/components/pages/mobile/preliminary/PreliminaryLayout";

export default function MobilePreliminaryPage() {
  return (
    <MobileLayout>
      <PreliminaryLayout slidesContent={testSlides} />
    </MobileLayout>
  );
}
