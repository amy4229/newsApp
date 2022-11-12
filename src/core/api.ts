import {NewsFeed,NewsDetail} from '../types/types';

export class Api{
    url: string;
  
    constructor(url:string){
      this.url = url
    }
  
    protected getRequest<FetchResponse>(cb:(data:FetchResponse) => void):void {
      fetch(this.url)
      .then(response => response.json())
      .then(cb)
      .catch(()=>console.error('데이터를 불러오지 못했습니다.'))
    }
  }
  
  export class NewsFeedApi extends Api {
    getData(cb:(data:NewsFeed[]) => void) : void {
      this.getRequest<NewsFeed[]>(cb);
    }
  }

  export class NewsDetailApi extends Api {
    getData(cb:(data:NewsDetail) => void) :void {
       this.getRequest<NewsDetail>(cb);
    }
  }
  