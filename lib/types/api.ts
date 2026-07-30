export type ResponseApiDto<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMetaDto = {
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
};
