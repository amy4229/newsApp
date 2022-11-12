import View from "../core/view"

export interface Store  {
  currentPage:number;
  feeds:NewsFeed[];
}
  
export interface News  {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly user: string;
  readonly url: string;
  readonly content: string;
}
  
export interface NewsFeed extends News {
  readonly comments_count: number;
  read? : boolean;
  readonly points: number;
}
  
export interface NewsDetail extends News {
  readonly comments: NewsComment[];
}
  
export interface NewsComment extends News {
  readonly comments: NewsComment[]|null;
  readonly level: number;
}
  
export interface RouteInfo {
  path: string; 
  page: View;
}
