import {NewsFeed,NewsDetail} from '../types/types';

export class Api{
    url: string;
  
    constructor(url:string){
      this.url = url
    }
  
    protected async request<FetchResponse>():Promise<FetchResponse> {
      const response = await fetch(this.url);
      return await response.json() as FetchResponse;     
    }
  }
  
  export class NewsFeedApi extends Api {
    async getData() : Promise<NewsFeed[]> {
      return await this.request<NewsFeed[]>();
    }
  }

  export class NewsDetailApi extends Api {
    async getData() : Promise<NewsDetail> {
       return await this.request<NewsDetail>();
    }
  }
  