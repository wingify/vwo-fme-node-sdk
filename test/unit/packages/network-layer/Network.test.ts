/**
 * Copyright 2024-2026 Wingify Software Pvt. Ltd.
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
import { LogManager } from '../../../../lib/packages/logger';
import { LogLevelEnum } from '../../../../lib/enums/LogLevelEnum';
import { HttpMethodEnum } from '../../../../lib/enums/HttpMethodEnum';

jest.mock('../../../../lib/packages/network-layer/client/NetworkClient'); // Mock the NetworkClient if it's used as a default client

// Create mock LogManager
const createMockLogManager = (): LogManager => {
  return new LogManager({
    isAlwaysNewInstance: true,
    level: LogLevelEnum.ERROR, // Set to ERROR to minimize console output during tests
  });
};

describe('NetworkManager', () => {
  let networkManager: NetworkManager;
  let mockClient: jest.Mocked<NetworkClientInterface>;
  let mockLogManager: LogManager;

  beforeEach(() => {
    mockClient = {
      GET: jest.fn(),
      POST: jest.fn(),
    };

    mockLogManager = createMockLogManager();

    networkManager = new NetworkManager(mockLogManager, mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('attachClient', () => {
    it('should attach a provided client', () => {
      // NetworkManager doesn't have attachClient method, so we'll test client assignment through constructor
      expect(networkManager['client']).toBe(mockClient);
    });

    it('should use a default client if none provided', () => {
      const networkManagerWithoutClient = new NetworkManager(mockLogManager);
      expect(networkManagerWithoutClient['client']).toBeDefined();
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
      const request = new RequestModel('endpoint', HttpMethodEnum.GET, '/path', {}, {}, {}, 'https', 443);
      const config = new GlobalRequestModel('api.example.com', {}, {}, {});
      networkManager.setConfig(config);
      const mergedRequest: RequestModel = networkManager.createRequest(request);
      expect(mergedRequest.getUrl()).toContain('endpoint');
    });
  });

  describe('get', () => {
    it('should perform a GET request and resolve with response', async () => {
      const request = new RequestModel('endpoint', HttpMethodEnum.GET, '/path', {}, {}, {}, 'https', 443);
      const response = new ResponseModel();
      mockClient.GET.mockResolvedValue(response);

      const result = await networkManager.get(request);

      expect(result).toBe(response);
      expect(mockClient.GET).toHaveBeenCalledWith(expect.any(RequestModel));
    });

    it('should reject if no URL is found', async () => {
      const request = new RequestModel('', HttpMethodEnum.GET, '/path', {}, {}, {}, 'https', 443);
      await expect(networkManager.get(request)).rejects.toThrow('no url found');
    });
  });

  describe('post', () => {
    it('should perform a POST request and resolve with response', async () => {
      const request = new RequestModel('endpoint', HttpMethodEnum.POST, '/path', {}, {}, {}, 'https', 443);
      const response = new ResponseModel();
      mockClient.POST.mockResolvedValue(response);

      const result = await networkManager.post(request);
      expect(result).toBe(response);
      expect(mockClient.POST).toHaveBeenCalledWith(expect.any(RequestModel));
    });

    it('should reject if no URL is found', async () => {
      const request = new RequestModel('', HttpMethodEnum.POST, '/path', {}, {}, {}, 'https', 443);
      await expect(networkManager.post(request)).rejects.toThrow('no url found');
    });
  });
});
