<% _.each(list, function(item, index) { %>
    <% if(index == 0){%>
        <li class=""><%-item.name%></li>
    <%} else{%>
        <li><%-item.name%></li>
    <%}%>
<% }) %>  