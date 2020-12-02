
<% _.each(lists.list, function(item, index) { %>
<% if(item.recommendTag !=1){%>
<% if(index == 0){%>
<div class="first_ul clearfix">
<%}else{%>
<div class="first_ul clearfix p-hide">
<% }%>
    <% _.each(item.products, function(itemone, i) {%>
    <% if((i+1)%3 == 0){%>
    <div class="s_course">
    <% } else{%>  
    <div class="s_course mid">
    <%}%>
        <a class="aLink" href="<%-itemone.detail%>?scene=<%-lists.scene%>20kaoyan_gkkkb_pc_bm" target="_blank">
            <div class="course-img">
                <img class="course_cover" src="<%-itemone.pictureUrl%>" alt="">
                <p class="keshi">
                    <% if(!item.liveStartTime && !itemone.liveEndTime){%>
                    
                    <%}else{%>
                        <span>直播时间：<%-itemone.liveStartTime%>-<%-itemone.liveEndTime%></span>
                    <%}%>
                    <span><%-itemone.classHours%>课时</span>
                </p>
            </div>
            <h1 class="title"><%-itemone.saleName%></h1>
            <p class="description">
            
                <% _.each(itemone.tagList, function(tags1, ind) { %>
                   
                    <span><%-tags1%></span>
                    
                <% }) %>  
            </p>
            <p class="course-teacher">主讲：
                <% _.each(itemone.teachers, function(itemone1, ind) { %>
                    <%if(ind == itemone.teachers.length-1){%>
                    <%-itemone1%>
                    <%}else{%>
                    <%-itemone1%> 、
                    <%}%>
                <% }) %>   
                </p>
            <div class="price clearfix">
                <p class="presentPrice">￥<span><%-itemone.currentPrice%></span></p>
                
            </div>

            <div class="course-num">
                <span class="yb_count">已有<%-itemone.salesCount%>人领取</span>
                <span class="xb_count"></span>
            </div>
        </a>
        <% if(!itemone.currentPrice){%>
        <span class="bntA quickpay" data-id="<%-itemone.productId%>">立即领取</span>
        <% } else{%> 
        <span class="bntA quickpay" data-id="<%-itemone.productId%>">立即报名</span>
        <% }%>   

    </div>
    <% }) %>
</div>
<%}%>
<% }) %>  

