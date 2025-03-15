import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
type Props = {
  allRows: any[];
  hasNextPage: boolean;
};

export const withVirtualizeCards =
  (Card) =>
  ({ hasNextPage, allRows }: Props) => {
    const parentRef = useRef(null);
    const rowVirtualizer = useVirtualizer({
      count: hasNextPage ? allRows.length + 1 : allRows.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 500,
      overscan: 10,
    });
    return (
      <>
        <div
          className="List"
          style={{
            height: `500px`,
            width: `100%`,
            overflow: "auto",
          }}
          ref={parentRef}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((p) => {
              const isLoaderRow = p.index > allRows.length - 1;
              const order = allRows[p.index];
              return (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${p.size}px`,
                    transform: `translateY(${p.start}px)`,
                  }}
                  key={p.index}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      "Loading more..."
                    ) : (
                      "Nothing more to load"
                    )
                  ) : (
                    <Card order={order} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
