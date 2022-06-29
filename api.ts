import axios, { AxiosRequestConfig, Method } from 'axios';
import qs from 'querystring';

const METHOD_GET = 'get';
const METHOD_POST = 'post';
const METHOD_PUT = 'put';
const METHOD_DELETE = 'delete';

type DataRequest = {
  url: string;
  method?: Method;
  headers?: any;
  params?: any;
  isJSON?: boolean;
  isLoading?: boolean;
  isLoadingInSide?: boolean;
  isMessage?: boolean;
  isCallbackMessage?: boolean;
  isEnableLog?: boolean;
  id?: string;
};

class API {
  private message: string = '';
  async request(data: DataRequest) {
    const { method, url, id, headers = {}, params = {}, isJSON = false, isLoading = true, isMessage = true, isLoadingInSide = true, isEnableLog = false, isCallbackMessage = false } = data;
    let _params = params;
    // console.log('API > request > _id: ', _id);

    if (isJSON) {
      headers['Content-Type'] = 'application/json';
    }

    if (isJSON && (method === METHOD_POST || method === METHOD_PUT)) {
      headers['Content-Type'] = 'application/json';
    } else if (method === METHOD_POST || method === METHOD_PUT) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      _params = qs.stringify(params);
    }

    const config: AxiosRequestConfig = { url, headers, method, validateStatus: () => true, timeout: 15000 };
    if (method === METHOD_GET) {
      config.params = _params;
    } else {
      config.data = _params;
    }
    // console.log('API > request > config: ', config);

    const startTime = new Date().getTime();
    //const res = await axios(config);
    // const endTime = new Date().getTime();
    // if (url !== this.getUrl('/master-data/list-coins') && isEnableLog) {
    //   console.log('-----------------------------');
    //   console.log(`[${method?.toUpperCase()}] [${endTime - startTime}ms] [${url}] [${JSON.stringify(_params)}]\n${JSON.stringify(res)}`);
    //   console.log('-----------------------------');
    // }
    // if (isCallbackMessage) {
    //   return res;
    // } else {
    //   if (res.status === 200 || res.status === 201) {
    //     return res?.data;
    //   } else {
    //     if (res?.data?.message && isMessage) {
    //     }
    //     console.log("Error")
    //     return null;
    //   }
    // }
    try {
      const res = await axios(config);
      const endTime = new Date().getTime();
      if (url !== this.getUrl('/master-data/list-coins') && isEnableLog) {
        console.log('-----------------------------');
        console.log(`[${method?.toUpperCase()}] [${endTime - startTime}ms] [${url}] [${JSON.stringify(_params)}]\n${JSON.stringify(res)}`);
        console.log('-----------------------------');
      }
      if (isCallbackMessage) {
        return res;
      } else {
        if (res.status === 200 || res.status === 201) {
          return res?.data;
        } else {
          if (res?.data?.message && isMessage) {
          }
          console.log("Error")
          return null;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error' + error)
      } else {
        console.log('Unexpected error')
      }
    }
  }

  async get(data: DataRequest) {
    data.method = METHOD_GET;
    return await this.request(data);
  }

  async post(data: DataRequest) {
    data.method = METHOD_POST;
    return await this.request(data);
  }

  async put(data: DataRequest) {
    data.method = METHOD_PUT;
    return await this.request(data);
  }

  async delete(data: DataRequest) {
    data.method = METHOD_DELETE;
    return await this.request(data);
  }

  getUrl(suffix?: string) {
    // console.log('API > getUrl > network: ', network);
    // return URL.default.api(network) + suffix;
    return suffix ? "http://10.10.10.184:9090/" + suffix : "http://10.10.10.184:9090/";
  }

  async getSample(word: string) {
    const url = this.getUrl('get_sample');
    const params = { text_input: word };
    return await this.post({ url, params });
  }

  async compareStroke(point: string, size: number) {
    const url = this.getUrl('compare_stroke');
    const params = { strokes: point, size: size };
    return await this.post({ url, params });
  }
}
export default new API();