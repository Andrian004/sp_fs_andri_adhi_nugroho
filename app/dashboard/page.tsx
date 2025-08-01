import { Suspense } from "react";
import { BoardList } from "./_components/board-list";

export default function DashboardHome() {
  return (
    <div className="w-full mb-20 px-2 md:px-4">
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
}
