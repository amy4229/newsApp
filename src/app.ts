import Store from "./store"
import Router from "./core/route"
import {NewsFeedView,NewsDetailView} from './pages';

const store = new Store();
const CONTAINER_ID = "root";
const router: Router = new Router();
const newsFeedView: NewsFeedView = new NewsFeedView(CONTAINER_ID, store);
const newsDetailView: NewsDetailView = new NewsDetailView(CONTAINER_ID, store);

router.setDefaultPage(newsFeedView)
router.addRoutePath('page', newsFeedView);
router.addRoutePath('show', newsDetailView);

router.route();
