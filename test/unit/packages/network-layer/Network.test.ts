/**
 * Copyright 2024-2025 Wingify Software Pvt. Ltd.
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
import { NetworkManager } from '../../../../lib/packages/network-layer/manager/NetworkManager';
import { NetworkClientInterface } from '../../../../lib/packages/network-layer/client/NetworkClientInterface';
import { GlobalRequestModel, RequestModel, ResponseModel } from '../../../../lib/packages/network-layer';

jest.mock('../../../../lib/packages/network-layer/client/NetworkClient'); // Mock the NetworkClient if it's used as a default client

// Mock LogManager
jest.mock('../../../../lib/packages/logger/core/LogManager', () => ({
  LogManager: {
    Instance: {
      debug: jest.fn(),
      errorLog: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      trace: jest.fn(),
    },
  },
}));

describe('NetworkManager', () => {
  let networkManager: NetworkManager;
  let mockClient: jest.Mocked<NetworkClientInterface>;

  beforeEach(() => {
    mockClient = {
      GET: jest.fn(),
      POST: jest.fn(),
    };
    networkManager = NetworkManager.Instance;
    networkManager.attachClient(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('attachClient', () => {
    it('should attach a provided client', () => {
      expect(networkManager['client']).toBe(mockClient);
    });

    it('should use a default client if none provided', () => {
      networkManager.attachClient();
      expect(networkManager['client']).toBeDefined();
    });
  });

  describe('setConfig and getConfig', () => {
    it('should set and get the global configuration', () => {
      const config = new GlobalRequestModel('api.example.com', {}, {}, {});
      networkManager.setConfig(config);
      expect(networkManager.getConfig()).toBe(config);
    });
  });

  describe('createRequest', () => {
    it('should merge specific request data with global config', () => {
      const request = new RequestModel('endpoint', 'GET', '/path', {}, {}, {});
      const config = new GlobalRequestModel('api.example.com', {}, {}, {});
      networkManager.setConfig(config);
      const mergedRequest: RequestModel = networkManager.createRequest(request);
      expect(mergedRequest.getUrl()).toContain('endpoint');
    });
  });

  describe('get', () => {
    it('should perform a GET request and resolve with response', async () => {
      const request = new RequestModel('endpoint', 'GET', '/path', {}, {}, {});
      const response = new ResponseModel();
      mockClient.GET.mockResolvedValue(response);

      const result = await networkManager.get(request);

      expect(result).toBe(response);
      expect(mockClient.GET).toHaveBeenCalledWith(expect.any(RequestModel));
    });

    it('should reject if no URL is found', async () => {
      const request = new RequestModel('', 'GET', '/path', {}, {}, {});
      await expect(networkManager.get(request)).rejects.toThrow('no url found');
    });
  });

  describe('post', () => {
    it('should perform a POST request and resolve with response', async () => {
      const request = new RequestModel('endpoint', 'POST', '/path', {}, {}, {});
      const response = new ResponseModel();
      mockClient.POST.mockResolvedValue(response);

      const result = await networkManager.post(request);
      expect(result).toBe(response);
      expect(mockClient.POST).toHaveBeenCalledWith(expect.any(RequestModel));
    });

    it('should reject if no URL is found', async () => {
      const request = new RequestModel('', 'POST', '/path', {}, {}, {});
      await expect(networkManager.post(request)).rejects.toThrow('no url found');
    });
  });
});
