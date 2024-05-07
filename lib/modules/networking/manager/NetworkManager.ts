/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Deferred } from '../../../utils/PromiseUtil';
import { NetworkClient } from '../client/NetworkClient';
import { NetworkClientInterface } from '../client/NetworkClientInterface';
import { RequestHandler } from '../handlers/RequestHandler';
import { GlobalRequestModel } from '../models/GlobalRequestModel';
import { RequestModel } from '../models/RequestModel';
import { ResponseModel } from '../models/ResponseModel';

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
