import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

// COOKIES
import Cookies from 'js-cookie';

// TYPES
import { IService, EHttpMethod } from '@/types';
export const tensurftoken = 'tensurftoken';
export class HttpService {
  private http: AxiosInstance;
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders()
    });
  }

  // Get authorization token for requests
  private get getAuthorization() {
    const accessToken = Cookies.get(tensurftoken) || '';
    return accessToken ? { Authorization: `Token ${accessToken}` } : {};
  }

  // Initialize service configuration
  public service() {
    this.injectInterceptors();

    return this;
  }

  // Set up request headers
  private setupHeaders(hasAttachment = false) {
    return hasAttachment
      ? { 'Content-Type': 'multipart/form-data', ...this.getAuthorization }
      : { 'Content-Type': 'application/json', ...this.getAuthorization };
  }

  // Handle HTTP requests
  private async request<T>(method: EHttpMethod, url: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options
      });

      return response.data;
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  // Perform GET request
  public async get<T>(url: string, params?: IService.IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params,
      headers: this.setupHeaders(hasAttachment)
    });
  }

  // Perform POST request
  public async push<T, P>(
    url: string,
    payload: P,
    params?: IService.IParams,
    hasAttachment: boolean = false,
    blob: boolean = false
  ): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params,
      data: payload,
      responseType: blob ? 'blob' : undefined,
      headers: this.setupHeaders(hasAttachment)
    });
  }

  // Perform UPDATE request
  public async update<T, P>(url: string, payload: P, params?: IService.IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment)
    });
  }

  // Perform DELETE request
  public async remove<T>(url: string, params?: IService.IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params,
      headers: this.setupHeaders(hasAttachment)
    });
  }

  // Inject interceptors for request and response
  private injectInterceptors() {
    // Set up request interceptor
    this.http.interceptors.request.use(request => {
      // * Perform an action
      // TODO: implement an NProgress
      return request;
    });

    // Set up response interceptor
    this.http.interceptors.response.use(
      response => {
        // * Do something
        return response;
      },

      error => {
        // * Implement a global error alert
        return Promise.reject(error);
      }
    );
  }

  // Normalize errors
  private normalizeError(error: any) {
    if (error.response?.data) {
      if (error.response.status === 401) {
        Cookies.remove(tensurftoken);
        Cookies.remove(tensurftoken, { domain: 'tensurf.ai' });
        Cookies.remove(tensurftoken, { domain: '.tensurf.ai' });
        window.location.replace(process.env.NEXT_PUBLIC_TENSURF_URL + '/signin');
      }
    }
    return Promise.reject(error);
  }
}

export { HttpService as default };
