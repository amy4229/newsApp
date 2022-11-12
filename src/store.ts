import { NewsFeed } from './types/types'
import { NewsStore } from './types/types';
export default class Store implements NewsStore{
    private feeds: NewsFeed[];
    private _currentPage: number;
    
    constructor(){
        this._currentPage = 1 
        this.feeds= [];
    }

    get currentPage():number{
        return this._currentPage;
    }

    set currentPage(page: number){
        this._currentPage = page
    }

    get nextPage():number{
        const max = Math.ceil(this.feeds.length/10);
        return Math.min(this._currentPage+1, max);
    }

    get prevPage():number{
        return this._currentPage>1? this._currentPage-1:1;
    }

    get numberOfFeed(): number {
        return this.feeds.length;
    }

    get hasFeeds(): boolean{
        return this.feeds.length > 0;
    }

    getAllFeeds(): NewsFeed[] {
        return this.feeds;
    }

    getFeed(position:number):NewsFeed{
        return  this.feeds[position];
    }

    setFeeds(feeds: NewsFeed[]):void{
        this.feeds = feeds.map(feed =>({
            ...feed,
            read: false
        }))
    }

    makeRead(id:number): void{
        const feed = this.feeds.filter((feed:NewsFeed)=>feed.id=== id)[0];
        if(feed) feed.read = true;
    }

}