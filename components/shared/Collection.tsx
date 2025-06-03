import type { IEvent } from "@/lib/database/models/event.model";

import  Card from "./Card";
import { Pagination } from "./Pagination";

type CollectionProps = {
  data: IEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  total?: number;
  urlParamName?: string;
  collectionType?: "Events_Organized" | "Registered_Events" | "All_Events";
};

export const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  total = 0,
  collectionType,
  urlParamName,
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              const hasOrderLink = collectionType === "Events_Organized";
              const hidePrice = collectionType === "Registered_Events";

              return (
                <li className="flex justify-center" key={event._id}>
                  <Card
                    event={event}
                    hasOrderLink={hasOrderLink}
                    hidePrice={hidePrice}
                  />
                </li>
              );
            })}
          </ul>

          {total > 1 && (
            <Pagination urlParamName={urlParamName} page={page} total={total} />
          )}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-gray-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};