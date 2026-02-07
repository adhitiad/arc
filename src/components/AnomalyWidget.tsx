import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Navigation2Icon,
  Trash,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export interface AnomalyProps {
  type: "DISTRIBUTION_DETECTED" | "ACCUMULATION_DETECTED" | "NORMAL";
  message: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

function AnomalyItem({ data }: { data: AnomalyProps }) {
  if (data.type === "NORMAL") return null;

  const isDist = data.type === "DISTRIBUTION_DETECTED"; // Harga turun, Berita Bagus

  return (
    <div
      className={`rounded-lg p-4 border-l-4 mb-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-top-2
        ${isDist ? "bg-red-900/20 border-red-500" : "bg-green-900/20 border-green-500"}`}
    >
      <div
        className={`p-2 rounded-full ${isDist ? "bg-red-900/50" : "bg-green-900/50"}`}
      >
        {isDist ? (
          <TrendingDown className="w-5 h-5 text-red-400" />
        ) : (
          <TrendingUp className="w-5 h-5 text-green-400" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4
            className={`font-bold text-sm flex items-center gap-2 ${isDist ? "text-red-400" : "text-green-400"}`}
          >
            <Zap className="w-3 h-3" />
            {isDist ? "DISTRIBUTION DETECTED" : "ACCUMULATION DETECTED"}
          </h4>
          {data.severity === "HIGH" && (
            <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              CRITICAL
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-300 mt-1">{data.message}</p>
        <div className="mt-2 text-xs text-zinc-500 flex gap-4">
          <span>
            Sentiment:{" "}
            <strong className={isDist ? "text-green-400" : "text-red-400"}>
              {isDist ? "Very Positive" : "Very Negative"}
            </strong>
          </span>
          <span>
            Price Action:{" "}
            <strong className={isDist ? "text-red-400" : "text-green-400"}>
              {isDist ? (
                <Trash className="w-4 h-4 inline" />
              ) : (
                <Navigation2Icon className="w-4 h-4 inline" />
              )}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export function AnomalyWidget({
  data,
}: {
  data: AnomalyProps[] | AnomalyProps;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Ensure data is always an array
  const dataArray = Array.isArray(data) ? data : [data];

  // Filter out NORMAL items
  const filteredData = dataArray?.filter((item) => item.type !== "NORMAL");

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (filteredData.length === 0) return null;

  return (
    <div>
      {/* Anomaly Items */}
      {currentItems?.map((item, index) => (
        <AnomalyItem key={index} data={item} />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </Pagination>
      )}
    </div>
  );
}
