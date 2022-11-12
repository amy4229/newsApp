import {Store} from "./types/types"
import Router from "./core/route"
import {NewsFeedView,NewsDetailView} from './pages';

const store: Store = {
  currentPage: 1,
  feeds: [],
}

declare global {
  interface Window {
    store: Store
  }
}
window.store = store;

const CONTAINER_ID = "root";
const router: Router = new Router();
const newsFeedView: NewsFeedView = new NewsFeedView(CONTAINER_ID);
const newsDetailView: NewsDetailView = new NewsDetailView(CONTAINER_ID);

router.setDefaultPage(newsFeedView)
router.addRoutePath('page', newsFeedView);
router.addRoutePath('show', newsDetailView);

router.route();
