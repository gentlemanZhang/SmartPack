import './css/base.css';
import './css/index.css';
import './css/page.scss';
import 'dplayer/dist/DPlayer.min.css';
import 'swiper/dist/css/swiper.min.css';
const part1 = require('./components/part1/js/part1');
const lazyLoaderImg = require('./components/common/lazyloaderimg/lazyloaderimg');
const app = {
    init() {
        part1.init();
        new lazyLoaderImg({selector: 'img', attr:'data-src'}).scrollLoad();
    }
};

$(() => {
    app.init();
});
