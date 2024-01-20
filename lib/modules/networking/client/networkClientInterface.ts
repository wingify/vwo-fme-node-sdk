import { RequestModel } from '../models/requestModel';
import { ResponseModel } from '../models/responseModel';

export interface NetworkClientInterface {
  GET(request: RequestModel): Promise<ResponseModel>;

  POST(request: RequestModel): Promise<ResponseModel>;
}
