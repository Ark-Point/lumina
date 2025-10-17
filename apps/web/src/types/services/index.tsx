// default API ResponseType

export interface BaseApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message?: string;
}

// export interface PaginationResponse<T = unknown> {
//   items: T[];
//   pagination: {
//     totalCount: number;
//     skip: number;
//     take: number;
//     currentPage: number;
//     totalPages: number;
//     hasPreviousPage: boolean;
//     hasNextPage: boolean;
//   };
// }
