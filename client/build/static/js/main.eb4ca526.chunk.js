(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{43:function(e,t,n){e.exports=n(97)},48:function(e,t,n){},68:function(e,t,n){},94:function(e,t){},97:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),l=n(36),s=n.n(l),o=(n(48),n(37)),c=n(38),r=n(41),u=n(39),d=n(42),h=n(3),m=n(16),p=n.n(m),b=n(17),f=n.n(b),v=(n(68),"http://localhost:8080/"),g=n(40),k=n.n(g),w=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(r.a)(this,Object(u.a)(t).call(this,e))).socket=k()(v),n.state={headlineInput:"",headlines:{}},n.getHeadlines=n.getHeadlines.bind(Object(h.a)(Object(h.a)(n))),n.submitHeadline=n.submitHeadline.bind(Object(h.a)(Object(h.a)(n))),n}return Object(d.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.getHeadlines()}},{key:"getHeadlines",value:function(){var e=this;console.log("here"),f.a.get(p()(v,"/headlines")).then(function(t){e.setState({headlines:t.data}),console.log("asdf"),console.log(t)})}},{key:"submitHeadline",value:function(e){var t=this;e.preventDefault(),f.a.post(p()(v,"/headlines"),{headline:this.state.headlineInput,author:"chuckdries"}).then(function(){return t.getHeadlines()}),this.setState({headlineInput:""})}},{key:"render",value:function(){var e=this;return i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-header"},i.a.createElement("h1",null,"Stale Mess Headline Voting System")),i.a.createElement("div",{className:"headline-area"},i.a.createElement("ul",null,Object.keys(this.state.headlines).map(function(t){return i.a.createElement("li",{key:t},e.state.headlines[t].headline)}))),i.a.createElement("form",{onSubmit:this.submitHeadline},i.a.createElement("input",{value:this.state.headlineInput,onChange:function(t){return e.setState({headlineInput:t.target.value})},type:"text",name:"headline"}),i.a.createElement("input",{type:"submit",value:"submit"})))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(i.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[43,2,1]]]);
//# sourceMappingURL=main.eb4ca526.chunk.js.map