import {NewsFeed,NewsDetail} from '../types/types';

export class Api{
    url: string;
    ajax: XMLHttpRequest;
  
    constructor(url:string){
      this.url = url
      this.ajax = new XMLHttpRequest();
    }
  
    protected getRequest<AjaxResponse>(cb:(data:AjaxResponse) => void):void {
      this.ajax.open('GET', this.url);
      this.ajax.addEventListener('load', ()=>{
        cb(JSON.parse(this.ajax.response));
      })
      this.ajax.send();
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
  