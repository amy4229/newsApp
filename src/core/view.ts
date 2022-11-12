export default abstract class View {
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