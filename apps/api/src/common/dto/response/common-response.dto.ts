export class CommonResponseDto<T> {
  statusCode: number;
  data?: T;
  message?: string;
}
