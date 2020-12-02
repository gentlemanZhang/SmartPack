
function addEvent(obj,type,fn){
    if(obj.attachEvent){ //ie
        obj.attachEvent('on'+type,function(){
            fn.call(obj);
        })
    }else{
        obj.addEventListener(type,fn,false);
    }
}
function getElementPosition(e) {
    let x = 0;
    let y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return { x, y };
}
  
function lazyLoaderImg(options){
    /* */
    this.selector = options.selector;
    this.attr = options.attr;
    this.elements = document.querySelectorAll(this.selector+'['+this.attr+']');
}

lazyLoaderImg.prototype.load = function(){ // 执行此方法的时候加载
    var self = this;
    self.elements.forEach(function(item){
        if(item.getAttribute('src') === item.getAttribute(self.attr)) return ;
        item.setAttribute('src', item.getAttribute(self.attr));
    })
}
lazyLoaderImg.prototype.scrollLoad = function(){ // 显示到这个图片的时候加载
    console.log('scrollLoad');
    var self = this;
    addEvent(window, 'scroll', function(){
        self.elements.forEach(function(item, index){
            // console.log('11111111');
            if(item.getAttribute(self.attr) === '') return;
            if(item.getAttribute('src') === item.getAttribute(self.attr)) return;

            // var itemTop = getElementPosition(item).y,
            var itemTop = item.parentNode && item.parentNode.getBoundingClientRect() && item.parentNode.getBoundingClientRect().top || 0,
            windowHeight = document.documentElement.clientHeight || document.body.clientHeight,
            windowScrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
            if(windowScrollTop + windowHeight > itemTop){
                console.log(windowScrollTop + windowHeight, item.parentNode.getAttribute('class'), itemTop);
                item.setAttribute('src', item.getAttribute(self.attr));
                item.setAttribute(self.attr,'');
            }
            // console.log(itemTop);
        })
    })
}

module.exports = lazyLoaderImg;
