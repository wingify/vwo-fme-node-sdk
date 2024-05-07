import { isFunction } from '../utils/DataTypeUtil';

interface Options {
  integrations?: {
    callback?: (properties: Record<string, any>) => void;
  };
}

class HooksManager {
  private callback: ((properties: Record<string, any>) => void) | undefined;
  private isCallBackFunction: boolean;
  private decision: Record<string, any>;

  constructor(options: Options = {}) {
    this.callback = options.integrations?.callback;
    this.isCallBackFunction = isFunction(this.callback);
    this.decision = {};
  }

  /**
   * Executes the callback
   * @param {Record<string, any>} properties Properties from the callback
   */
  execute(properties: Record<string, any>): void {
    if (this.isCallBackFunction) {
      this.callback(properties);
    }
  }

  /**
   * Sets properties to the decision object
   * @param {Record<string, any>} properties Properties to set
   */
  set(properties: Record<string, any>): void {
    if (this.isCallBackFunction) {
      this.decision = properties;
    }
  }

  /**
   * Retrieves the decision object
   * @returns {Record<string, any>} The decision object
   */
  get(): Record<string, any> {
    return this.decision;
  }
}

export default HooksManager;
