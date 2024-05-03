export class WebResponse<T> {
  data?: T;
  errors?: string[];
  message?: string;
  pagination?: Paginate;
}

export class Paginate {
  current_page: number;
  total_page: number;
  size: number;
}
