import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';

export interface NetworkClientInterface {
  GET(request: RequestModel): Promise<ResponseModel>;

  POST(request: RequestModel): Promise<ResponseModel>;
}
