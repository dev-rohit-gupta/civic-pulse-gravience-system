export class ApiResponse<T> {
  success: true;
  message: string;
  statusCode: number;
  data: T;

  constructor(data: T, message = "Success", statusCode = 200) {
    this.success = true;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
