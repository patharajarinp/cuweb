import Router from 'next/router'
import React from 'react'
import api from '../utils/api'
export default class LineCallback extends React.Component{

    constructor(props){
      super(props)
      this.state = {done : false}
    }
    componentDidMount(){
        if(!window.opener){
            return Router.push('/');
        }
        var query = window.location.search.substring(1);
        var qs = this.parse_query_string(query);
        const {code,state} = qs;
        var message = {};
        if(code && state){
            
            const origin = window.location.origin;
            api.loginLine(code)
            
            .then(res => {
              // console.log(res.data)
              // alert(res.data)
              window.opener.postMessage(res.data,origin);
              window.close();
            })
            .catch(err => {
                console.log(err.response);
                window.opener.postMessage({error : 'Something was wrong'},origin);
                window.close();
            })


        }
            
        else{
            message = {error : 'Something was wrong'}
            window.opener.postMessage(message,origin);
            window.close();
        }

        

        
        
       
    }
 
    parse_query_string = (query) => {
        var vars = query.split("&");
        var query_string = {};
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          var key = decodeURIComponent(pair[0]);
          var value = decodeURIComponent(pair[1]);
          // If first entry with this name
          if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
          } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
          } else {
            query_string[key].push(decodeURIComponent(value));
          }
        }
        return query_string;
    }
    render(){
        return (
        <div>
          {this.state.done ? 'Login successfully': 'Authorizing. . .'}
            
        </div>

        )

    }
}