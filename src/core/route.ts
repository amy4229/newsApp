import {RouteInfo} from '../types/types';
import View from './view';

export default class Router {
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
      
      if (routePath === '') {
        this.defaultRoute.page.render();
      } 
      
      for(const routeInfo of this.routeTable){
        if(routePath.indexOf(routeInfo.path) >= 0){
          routeInfo.page.render();
          break;
        }
      }
  
    }
  
  }