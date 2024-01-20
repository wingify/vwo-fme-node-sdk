import { Deferred } from '../../../utils/PromiseUtil';
import { GlobalRequestModel } from '../models/globalRequestModel';
import { NetworkClient } from '../client/networkClient';
import { RequestModel } from '../models/requestModel';
import { RequestHandler } from '../handlers/requestHandler';
import { ResponseModel } from '../models/responseModel';
import { NetworkClientInterface } from '../client/networkClientInterface';

export class NetworkManager {
  private config: GlobalRequestModel;
  private client: NetworkClientInterface;
  private static instance: NetworkManager;

  attachClient(client?: NetworkClientInterface): void {
    this.client = client || new NetworkClient();
    this.config = new GlobalRequestModel(null, null, null, null);
  }

  static get Instance(): NetworkManager {
    this.instance = this.instance || new NetworkManager();

    return this.instance;
  }

  setConfig(config: GlobalRequestModel): void {
    this.config = config;
  }

  getConfig(): GlobalRequestModel {
    return this.config;
  }

  createRequest(request: RequestModel): RequestModel {
    const options: RequestModel = new RequestHandler().createRequest(request, this.config);
    return options;
  }

  get(request: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();

    const networkOptions: RequestModel = this.createRequest(request);
    if (networkOptions === null) {
      deferred.reject(new Error('no url found'));
    } else {
      this.client
        .GET(networkOptions)
        .then((response: ResponseModel) => {
          deferred.resolve(response);
        })
        .catch((errorResponse: ResponseModel) => {
          deferred.reject(errorResponse);
        });
    }

    return deferred.promise;
  }

  post(request: RequestModel): Promise<ResponseModel> {
    const deferred = new Deferred();
    const networkOptions: RequestModel = this.createRequest(request);

    if (networkOptions === null) {
      deferred.reject(new Error('no url found'));
    } else {
      this.client
        .POST(networkOptions)
        .then((response: ResponseModel) => {
          deferred.resolve(response);
        })
        .catch((error: ResponseModel) => {
          deferred.reject(error);
        });
    }

    return deferred.promise;
  }
}
