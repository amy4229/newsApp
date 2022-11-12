interface Store  {
  currentPage:number;
  feeds:NewsFeed[];
}

interface News  {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly user: string;
  readonly url: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly comments_count: number;
  read? : boolean;
  readonly points: number;
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[]|null;
  readonly level: number;
}

interface RouteInfo {
  path: string; 
  page: View;
}




const store: Store = {
  currentPage: 1,
  feeds: [],
}

class Api{
  url: string;
  ajax: XMLHttpRequest;

  constructor(url:string){
    this.url = url
    this.ajax = new XMLHttpRequest();
  }

  protected getRequest<AjaxResponse>() : AjaxResponse {
    this.ajax.open('GET', this.url, false);
    this.ajax.send();
    return JSON.parse(this.ajax.response);
  }
}

class NewsFeedApi extends Api {
  getData() : NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}
class NewsDetailApi extends Api {
  getData() : NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}

class Router {
  routeTable:RouteInfo[]
  defaultRoute: RouteInfo | null
  constructor(){
      
    this.routeTable = [];    
    window.addEventListener('hashchange', this.route.bind(this));
  }

  setDefaultPage(page:View): void{
    this.defaultRoute = {path:'', page}
  }

  addRoutePath(path:string, page:View){
    this.routeTable.push({path, page})
  }

  route(){
    const routePath = location.hash;
    const [,path, value] = routePath.split("/");
    console.log("path",path, "value",value,)
    
    if (routePath === '') {
      this.defaultRoute.page.render();
    } 
    
    for(const routeInfo of this.routeTable){
      if(path === routeInfo.path){
        if(path === "page"){
          store.currentPage = Number(value);
        }
        routeInfo.page.render();
        break;
      }
    }

  }

}

abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];

  constructor(containerid: string, template: string){
    const containerElement = document.getElementById(containerid) ;
    if(!containerElement){
      throw Error("최상위 엘리먼트가 존재하지 않습니다.")
    }
    
    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updateView():void{
      this.container.innerHTML = this.renderTemplate;
      this.renderTemplate = this.template;
  }

  protected addHtml(htmlString:string): void{
    this.htmlList.push(htmlString)
  }

  protected getHtml():string {
    const snapshot = this.htmlList.join("")
    this.clearHTMLList();
    return snapshot;
  }

  protected setTemplateData(key:string, value:string):void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHTMLList():void{
    this.htmlList = [];
  }

  abstract render():void;

}

class NewsFeedView extends View{
  private api: NewsFeedApi;
  private feeds: NewsFeed[];
  private NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';

  constructor(containerId: string){
    let template = `
      <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                  Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                  Next
                </a>
              </div>
            </div> 
          </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
          {{__news_feed__}}        
        </div>
      </div>
    `;
    super(containerId, template);
    this.api = new NewsFeedApi(this.NEWS_URL);
    this.feeds = store.feeds;
    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeeds();
    }
  }

  render() :void{
    for (let i= (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      const feed =this.feeds[i]
      this.addHtml(`
        <div class="p-6 ${feed.read ? 'bg-red-100' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${feed.id}">${feed.title}</a>  
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${feed.comments_count}</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${feed.user}</div>
              <div><i class="fas fa-heart mr-1"></i>${feed.points}</div>
              <div><i class="far fa-clock mr-1"></i>${feed.time_ago}</div>
            </div>  
          </div>
        </div>    
      `);
    }
  
    this.setTemplateData('news_feed', this.getHtml());
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData('next_page', String(store.currentPage + 1));
  
    this.updateView();
  }

  private makeFeeds() : void{
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }
}



class NewsDetailView extends View{
  private CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
  private newsContent: NewsDetail;

  constructor(containerId: string){
    let template = `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">
            {{__content__}}
          </div>
  
          {{__comments__}}
  
        </div>
      </div>
    `;
    super(containerId, template);
  }

  render():void{
    const id = location.hash.substring(7);
    const api = new NewsDetailApi(this.CONTENT_URL.replace('@id', id));
    const {title, content, comments} = api.getData();



    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }
  
    this.setTemplateData('currentPage', String(store.currentPage))
    this.setTemplateData('title', title)
    this.setTemplateData('content', content)
    this.setTemplateData('comments', this.makeComment(comments))

    this.updateView();
  }

  private makeComment(comments: NewsComment[]) : string {
  
    for (let i = 0; i < comments.length; i++) {
      const comment:NewsComment = comments[i]
      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>      
      `);
  
      if (comment.comments.length > 0) {
       this.addHtml(this.makeComment(comment.comments));
      }
    }
  
    return this.getHtml();
  }
}


const CONTAINER_ID = "root";
const router: Router = new Router();
const newsFeedView: NewsFeedView = new NewsFeedView(CONTAINER_ID);
const newsDetailView: NewsDetailView = new NewsDetailView(CONTAINER_ID);

router.setDefaultPage(newsFeedView)
router.addRoutePath('page', newsFeedView);
router.addRoutePath('show', newsDetailView);

router.route();
