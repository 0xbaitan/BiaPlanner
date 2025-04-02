import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";

import Pagination from "react-bootstrap/Pagination";
import { useMemo } from "react";

export type PaginationComponentProps = {
  numPages: number;
  currentPage: number;
  onPageChange: (pageSelected: number) => void;
  numberOfPagesToShowOnTruncation?: number;

  showFirstLast?: boolean;
};
export default function PaginationComponent(props: PaginationComponentProps) {
  const { numPages, currentPage, onPageChange, numberOfPagesToShowOnTruncation = 8, showFirstLast } = props;
  const delta = Math.max(numberOfPagesToShowOnTruncation, 5);
  const shouldTruncate = numPages - delta >= 2;
  const shouldTruncateEnd = shouldTruncate && currentPage >= 1 && currentPage <= delta;
  const shouldTruncateStart = shouldTruncate && currentPage >= numPages - delta + 1 && currentPage <= numPages;
  const shouldTruncateBoth = shouldTruncate && !(shouldTruncateStart || shouldTruncateEnd);
  const itemsWithEndTruncation = useMemo(() => {
    if (!shouldTruncateEnd) {
      return null;
    }
    const items: JSX.Element[] = [];
    for (let i = 1; i <= delta; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    items.push(<Pagination.Ellipsis key="end-ellipsis" onClick={() => onPageChange(delta + 1)} />);
    items.push(
      <Pagination.Item key={numPages} active={numPages === currentPage} onClick={() => onPageChange(numPages)}>
        {numPages}
      </Pagination.Item>
    );
    return items;
  }, [shouldTruncateEnd, numPages, currentPage, delta, onPageChange]);

  const itemsWithStartTruncation = useMemo(() => {
    if (!shouldTruncateStart || shouldTruncateEnd) {
      return null;
    }
    const items: JSX.Element[] = [];
    items.push(
      <Pagination.Item key={1} active={1 === currentPage} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>
    );
    items.push(<Pagination.Ellipsis key="start-ellipsis" onClick={() => onPageChange(numPages - delta)} />);
    for (let i = numPages - delta + 1; i <= numPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return items;
  }, [shouldTruncateStart, shouldTruncateEnd, currentPage, onPageChange, numPages, delta]);

  const itemsWithBothTruncation = useMemo(() => {
    if (!shouldTruncateBoth) {
      return null;
    }
    const items: JSX.Element[] = [];
    const start = Math.ceil(currentPage - (delta - 2) / 2);
    const end = Math.floor(currentPage + (delta - 2) / 2);
    items.push(
      <Pagination.Item key={1} active={1 === currentPage} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>
    );
    items.push(<Pagination.Ellipsis key="start-ellipsis" onClick={() => onPageChange(currentPage - delta)} />);
    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    items.push(<Pagination.Ellipsis key="both-ellipsis" onClick={() => onPageChange(currentPage + delta)} />);
    items.push(
      <Pagination.Item key={numPages} active={numPages === currentPage} onClick={() => onPageChange(numPages)}>
        {numPages}
      </Pagination.Item>
    );
    return items;
  }, [shouldTruncateBoth, currentPage, delta, numPages, onPageChange]);

  const itemsWithoutTruncation = useMemo(() => {
    if (shouldTruncate) {
      return null;
    }
    const items: JSX.Element[] = [];
    for (let i = 1; i <= numPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return items;
  }, [shouldTruncate, numPages, currentPage, onPageChange]);
  return (
    <div className="">
      <Pagination>
        {showFirstLast && (
          <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            <FaAnglesLeft size={13} />
            &nbsp;First
          </Pagination.First>
        )}
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <FaAngleLeft size={13} />
          &nbsp;Back
        </Pagination.Prev>
        {itemsWithStartTruncation}

        {itemsWithEndTruncation}
        {itemsWithBothTruncation}
        {itemsWithoutTruncation}
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === numPages}>
          Next&nbsp;
          <FaAngleRight size={13} />
        </Pagination.Next>
        {showFirstLast && (
          <Pagination.Last onClick={() => onPageChange(numPages)} disabled={currentPage === numPages}>
            Last&nbsp;
            <FaAnglesRight size={13} />
          </Pagination.Last>
        )}
      </Pagination>
    </div>
  );
}
