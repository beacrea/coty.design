webpackJsonp([0],{0:function(t,e){},"05+W":function(t,e){},"56jE":function(t,e){t.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjEycHgiIHZpZXdCb3g9IjAgMCA5IDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OSAoNTEwMDIpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlBhdGggMjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJDb21wb25lbnRzLS0tTmF2IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgIDxnIGlkPSJidXR0b24vc3RhbmRhcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzUuMDAwMDAwLCAtMTQuMDAwMDAwKSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiPgogICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTc5LjQ2MTAwOSwgMjAuMDAwMDAwKSBzY2FsZSgtMSwgMSkgcm90YXRlKDkwLjAwMDAwMCkgdHJhbnNsYXRlKC0xNzkuNDYxMDA5LCAtMjAuMDAwMDAwKSAiIHBvaW50cz0iMTg0LjQwNzIxNiAxNy4zOTAzNjU4IDE3OS4zNzU4OTkgMjIuNjA5NjM0MiAxNzQuNTE0ODAyIDE3LjM5MDM2NTgiPjwvcG9seWxpbmU+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="},DWOZ:function(t,e){},HtoV:function(t,e){},MxuW:function(t,e){},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("7+uW"),a=i("8+8L"),s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("nav",{attrs:{id:"navigation"}},[i("router-link",{attrs:{to:"intro"},nativeOn:{click:function(e){t.changeBg(e)}}},[t._v("Intro")]),t._v(" "),i("router-link",{attrs:{to:"work"},nativeOn:{click:function(e){t.changeBg(e)}}},[t._v("Work")]),t._v(" "),i("router-link",{attrs:{to:"stats"},nativeOn:{click:function(e){t.changeBg(e)}}},[t._v("Stats")]),t._v(" "),i("router-link",{attrs:{to:"contact"},nativeOn:{click:function(e){t.changeBg(e)}}},[t._v("Contact")])],1)},staticRenderFns:[]};var o=i("VU/8")({components:{},data:function(){return{msg:"This is a message"}},methods:{changeBg:function(){this.$emit("pageChange"),this.$emit("introStatus",0)}}},s,!1,function(t){i("DWOZ")},"data-v-480d2281",null).exports;n.a.use(a.a);var r={components:{Navigation:o},name:"App",data:function(){return{activeBg:"pg-"+this.$route.name,blurAbout:0}},methods:{changeBG:function(t){this.activeBg="pg-"+this.$route.name},introBlurred:function(t){this.blurAbout=t},afterEnter:function(t,e){console.log("Page changed to: "+this.$route.name)}}},c={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{class:t.activeBg,attrs:{id:"app"}},[i("span",{style:{opacity:t.blurAbout},attrs:{id:"overlay"}}),t._v(" "),i("transition",{attrs:{name:"fade",mode:"out-in",appear:""},on:{"after-enter":t.afterEnter}},[i("router-view",{on:{introStatus:t.introBlurred,pageChange:t.changeBG}})],1),t._v(" "),i("Navigation",{on:{pageChange:t.changeBG,introStatus:t.introBlurred}})],1)},staticRenderFns:[]};var l=i("VU/8")(r,c,!1,function(t){i("nrGi")},null,null).exports,d=i("/ocq"),u={components:{},data:function(){return{msg:"This is the about page.",latestVersion:{updated:!1,name:"",url:""},initOffset:0,currentOffset:0}},created:function(){var t=this;this.$http.get("https://api.github.com/repos/beacrea/coty.design/releases/latest").then(function(e){t.latestVersion.updated=!0,t.latestVersion.name=e.data.tag_name,t.latestVersion.url=e.data.html_url},function(t){console.log("Error fetching latest version from Github repo.")})},mounted:function(){var t=document.getElementById("downArrow");this.initOffset=this.calcOffset(t).top,this.currentOffset=this.calcOffset(t).top},methods:{reportPosition:function(){var t=document.getElementById("downArrow"),e=this.calcOffset(t).top;this.currentOffset=e;var i=this.initOffset-this.currentOffset/6;this.currentOffset>=i?this.$emit("introStatus",0):this.currentOffset<i&&this.$emit("introStatus",1)},calcOffset:function(t){var e=t.getBoundingClientRect(),i=window.pageYOffset||document.documentElement.scrollTop;return{top:e.top+i}},changeBg:function(){this.$emit("pageChange"),this.$emit("introStatus",0)}}},m={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"about"},on:{scroll:t.reportPosition}},[n("section",{attrs:{id:"intro"}},[n("a",{directives:[{name:"show",rawName:"v-show",value:t.latestVersion.updated,expression:"latestVersion.updated"}],staticClass:"version",attrs:{href:t.latestVersion.url,target:"_blank"}},[t._v(t._s(t.latestVersion.name))]),t._v(" "),t._m(0),t._v(" "),n("img",{attrs:{src:"/static/img/arrow-down.png",id:"downArrow",alt:""}})]),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),t._m(4),t._v(" "),n("section",{attrs:{id:"qa5"}},[n("header",[n("h2",[t._v("Let's chat more over tea.")]),t._v(" "),n("div",{staticClass:"linkBox"},[n("router-link",{staticClass:"aboutCta",attrs:{to:"contact"},nativeOn:{click:function(e){t.changeBg(e)}}},[t._v("Contact me "),n("img",{attrs:{src:i("56jE"),alt:""}})])],1)])])])},staticRenderFns:[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("header",[i("h1",[i("span",[t._v("I’ve seen things")]),t._v(" "),i("span",[t._v("you people")]),t._v(" "),i("span",[t._v("wouldn’t believe.")])]),t._v(" "),i("p",[t._v("Overclocked Pentiums on fire in suburban basements.\n        "),i("span",{staticClass:"lg"},[t._v("I watched gif text glitter in Netscape before the great browser wars.")])]),t._v(" "),i("p",[t._v("All of these moments will be lost, "),i("a",{staticClass:"tears",attrs:{href:"https://youtu.be/NoAzpa1x7jU?t=1m45s",target:"_blank"}},[t._v("like tears in rain")]),t._v(".")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("section",{attrs:{id:"qa1"}},[e("header",[e("h1",[this._v("My name is Coty Beasley")]),this._v(" "),e("h2",[this._v("I'm a product designer based in San Francisco.")]),this._v(" "),e("h2",[this._v("I specialize in digital product strategy and interaction.")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("section",{attrs:{id:"qa2"}},[e("header",[e("h1",[this._v("I began designing over ten years ago so I could one day help build the future.")]),this._v(" "),e("h2",[this._v("Here are some questions you might be asking:")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("section",{attrs:{id:"qa3"}},[e("header",[e("h1",[this._v('"Where do you typically fit into the product cycle?"')]),this._v(" "),e("h2",[this._v("I’m an end-to-end product designer.")]),this._v(" "),e("h3",[this._v("I'm usually brought into the process while the business team and product managers are coming up with their goals. From there, I'll often guide things from the interface designs to the end of development.")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("section",{attrs:{id:"qa4"}},[e("header",[e("h1",[this._v('"Do you see yourself as a manager or an individual contributor?"')]),this._v(" "),e("h2",[this._v("I prefer being a senior-level individual contributor, often guiding the product vision of new initiatives or features.")]),this._v(" "),e("h3",[this._v("I've managed a handful of small teams in the past, acting as the product manager and/or owner. In the right situations, I'm happy to take on the responsibility.")])])])}]};var h=i("VU/8")(u,m,!1,function(t){i("HtoV")},"data-v-0f05e6ba",null).exports,g=i("zHt6"),p=i.n(g),v={components:{},data:function(){return{msg:"This is the stats page.",diceImage:"../../static/img/dice.svg",itemPath:"../../static/icons/stats/",itemPH:"../../static/img/cube.svg",diceSpin:!1,diceTimer:{},stats:p.a.stats,tools:p.a.tools,gear:p.a.gear}},methods:{getRandom:function(){return Math.floor(80*Math.random())+20},setRandom:function(){var t=this;this.diceSpin=!1,clearTimeout(this.diceTimer),this.stats.forEach(function(e,i){e.value=t.getRandom()}),this.diceSpin=!0,this.diceTimer=this.delayDiceClear(),this.delayDiceClear()},clearDice:function(){this.diceSpin=!1,this.diceTimer=0},delayDiceClear:function(){var t=this;setTimeout(function(){t.clearDice()},500)},getStatImg:function(t){return this.itemPath+t+".svg"}}},f={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"stats"}},[i("section",{attrs:{id:"statsGroup"}},[i("header",[i("h1",[t._v("Current Stats")]),t._v(" "),i("span",{staticClass:"dice",class:{active:t.diceSpin},style:{backgroundImage:"url('"+t.diceImage+"')"},attrs:{alt:"Roll the dice!"},on:{click:t.setRandom}})]),t._v(" "),i("div",{staticClass:"gaugeGroup"},t._l(t.stats,function(e){return i("div",{key:e.name,staticClass:"stat"},[i("div",{staticClass:"label"},[t._v(t._s(e.name))]),t._v(" "),i("div",{staticClass:"guage"},[i("div",{staticClass:"fill",style:{width:e.value+"%"}})])])}))]),t._v(" "),i("section",{attrs:{id:"toolGroup"}},[i("h1",[t._v("Tool List")]),t._v(" "),i("div",t._l(t.tools,function(e){return i("div",{key:e.name,staticClass:"item"},[i("div",{staticClass:"itemBox"},[i("img",{attrs:{src:t.getStatImg(e.icon),alt:"item.desc"}})]),t._v(" "),i("div",{staticClass:"content"},[i("header",[t._v(t._s(e.name)),i("span",[t._v("("+t._s(e.type)+")")])]),t._v(" "),i("div",{staticClass:"text"},[t._v(t._s(e.desc))])])])}))]),t._v(" "),i("section",{attrs:{id:"gearGroup"}},[i("h1",[t._v("Gear List")]),t._v(" "),i("div",t._l(t.gear,function(e){return i("div",{key:e.name,staticClass:"item"},[i("div",{staticClass:"itemBox"},[i("img",{attrs:{src:t.getStatImg(e.icon),alt:"item.desc"}})]),t._v(" "),i("div",{staticClass:"content"},[i("header",[t._v(t._s(e.name)),i("span",[t._v("("+t._s(e.type)+")")])]),t._v(" "),i("div",{staticClass:"text"},[t._v(t._s(e.desc))])])])}))])])},staticRenderFns:[]};var b=i("VU/8")(v,f,!1,function(t){i("MxuW")},"data-v-8de79654",null).exports,_={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"contact"}},[i("section",[i("h2",[t._v("Where I'm Found")]),t._v(" "),i("div",{staticClass:"grid"},[i("div",{staticClass:"icon"},[i("a",{attrs:{href:t.icon.dribbble.link,target:"_blank"}},[i("img",{attrs:{src:t.setIcon(t.icon.dribbble.asset)}})]),t._v(" "),i("span",[t._v(t._s(t.icon.dribbble.title))])]),t._v(" "),i("div",{staticClass:"icon"},[i("a",{attrs:{href:t.icon.github.link,target:"_blank"}},[i("img",{attrs:{src:t.setIcon(t.icon.github.asset)}})]),t._v(" "),i("span",[t._v(t._s(t.icon.github.title))])]),t._v(" "),i("div",{staticClass:"icon"},[i("a",{attrs:{href:t.icon.linkedin.link,target:"_blank"}},[i("img",{attrs:{src:t.setIcon(t.icon.linkedin.asset)}})]),t._v(" "),i("span",[t._v(t._s(t.icon.linkedin.title))])])])])])},staticRenderFns:[]};var y=i("VU/8")({components:{},data:function(){return{msg:"This is the contact page.",iconPath:"../../../static/icons/contact/",icon:{dribbble:{title:"Dribbble",link:"http://dribbble.com/beacrea",asset:"dribbble.svg"},twitter:{title:"Twitter",link:"http://twitter.com/beacrea",asset:"twitter.svg"},github:{title:"Github",link:"http://github.com/beacrea",asset:"github.svg"},codepen:{title:"Codepen",link:"http://codepen.io/beacrea/",asset:"codepen.svg"},linkedin:{title:"Linkedin",link:"http://linkedin.com/in/cbeasley0",asset:"linkedin-in.svg"}}}},methods:{setIcon:function(t){return this.iconPath+t}}},_,!1,function(t){i("05+W")},"data-v-79233aba",null).exports,k=i("am65"),I=i.n(k),w={components:{},data:function(){return{workItems:I.a}}},C={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"work"}},[t._m(0),t._v(" "),i("section",t._l(t.workItems,function(e){return i("div",{key:e.id,staticClass:"item"},[i("div",{staticClass:"preview",style:{backgroundImage:"url(../../static/img/"+e.assets.assetDir+"/"+e.assets.thumbnail.name+")"}},[i("div",{staticClass:"tags",class:e.assets.thumbnail.color},t._l(e.tags.slice(0,3),function(e){return i("span",{key:e.name},[t._v(t._s(e.name))])}))]),t._v(" "),i("div",{staticClass:"content",class:e.assets.thumbnail.color},[i("h1",[t._v(t._s(e.project.title))]),t._v(" "),i("div",{staticClass:"text"},[t._v(t._s(e.project.shortDesc))]),t._v(" "),t._m(1,!0)])])}))])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("header",[e("h1",[this._v("Here's a bit of my work.")]),this._v(" "),e("p",[this._v("Through the years I’ve worked on everything from bobbleheads, robotics, health outcomes, sports tech, chatbots, and more.")]),this._v(" "),e("p",[this._v("A common thread in all my projects is a desire to solve complex problems with emerging technologies that have a chance to improve the world around me.")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"cta"},[e("span",[this._v("COMING SOON")])])}]};var D=i("VU/8")(w,C,!1,function(t){i("iaWo")},"data-v-6275d242",null).exports;n.a.use(d.a);var A=new d.a({routes:[{path:"*",redirect:{name:"intro"}},{path:"/",redirect:{name:"intro"}},{path:"/intro",name:"intro",component:h},{path:"/stats",name:"stats",component:b},{path:"/contact",name:"contact",component:y},{path:"/work",name:"work",component:D}]});n.a.config.productionTip=!1,new n.a({el:"#app",router:A,components:{App:l},template:"<App/>"})},am65:function(t,e){t.exports=[{id:"nly_ostrom",tags:[{name:"UI"},{name:"Dev"},{name:"Strategy"}],project:{title:"A Communications Platform For Public Finance",exposure:"internal/public",year:"2017",duration:"3 Weeks",shipped:!0,shortDesc:"Neighborly needed to create a communications strategy in order to connect with communities around the world. Project Ostrom became an overarching initiative that included infrastructure, tooling, and thought leadership.",summary:""},technologies:[{name:"Ghost",url:"https://ghost.org/"},{name:"Foundation for Emails",url:"https://foundation.zurb.com/emails.html"}],background:{summary:"",users:["",""],pain:["",""],goal:""},personalContext:{p1:"Yo, this is a story all",p2:"all about how",p3:"my life got flipped turned upside down"},assets:{thumbnail:{color:"purple",name:"ostrom_thumb.png"},hero:"",assetDir:"work"},company:{name:"Neighborly",location:"San Francisco, CA",shortDescription:"Positioned at the intersection of technology, finance and government, Neighborly develops technologies to radically modernize public finance, the $1 billion per day, 200 year-old market that powers vital public projects like schools, parks, and next-generation infrastructure.",logo:""},team:{involved:["Engineering","Marketing","Design"],roles:["Product Owner","Designer"],noInvolved:"Team of 4"}},{id:"eus_gen",tags:[{name:"UI"},{name:"Dev"},{name:"Strategy"}],project:{title:"Measuring Human Performance",exposure:"internal/public",year:"2017",duration:"3 Weeks",shipped:!0,shortDesc:"Football players are some of the most measured individuals in the world. Edge Up took a look at traditional metrics and supplemented them with new ones like unstructured NLP, vocal tonality, microexpression analysis, and more.",summary:""},technologies:[{name:"Ghost",url:"https://ghost.org/"},{name:"Foundation for Emails",url:"https://foundation.zurb.com/emails.html"}],background:{summary:"",users:["",""],pain:["",""],goal:""},personalContext:{p1:"Yo, this is a story all",p2:"all about how",p3:"my life got flipped turned upside down"},assets:{thumbnail:{color:"light",name:"brady_thumb.jpg"},hero:"",assetDir:"work"},company:{name:"Neighborly",location:"San Francisco, CA",shortDescription:"Positioned at the intersection of technology, finance and government, Neighborly develops technologies to radically modernize public finance, the $1 billion per day, 200 year-old market that powers vital public projects like schools, parks, and next-generation infrastructure.",logo:""},team:{involved:["Engineering","Marketing","Design"],roles:["Product Owner","Designer"],noInvolved:"Team of 4"}},{id:"sora_triage",tags:[{name:"UI"},{name:"Dev"},{name:"Strategy"}],project:{title:"Improving Medical Diagnosis",exposure:"internal/public",year:"2017",duration:"3 Weeks",shipped:!0,shortDesc:"Sora sought to improve outcomes for Code Blues, Stroke, and Sepsis after seeing a 12-20% survival rate for critical events, nurses writing on their pants while keeping track of drug timers, and everyone spending hours writing documentation.",summary:""},technologies:[{name:"Ghost",url:"https://ghost.org/"},{name:"Foundation for Emails",url:"https://foundation.zurb.com/emails.html"}],background:{summary:"",users:["",""],pain:["",""],goal:""},personalContext:{p1:"Yo, this is a story all",p2:"all about how",p3:"my life got flipped turned upside down"},assets:{thumbnail:{color:"pink",name:"sora_thumb.jpg"},hero:"",assetDir:"work"},company:{name:"Neighborly",location:"San Francisco, CA",shortDescription:"Positioned at the intersection of technology, finance and government, Neighborly develops technologies to radically modernize public finance, the $1 billion per day, 200 year-old market that powers vital public projects like schools, parks, and next-generation infrastructure.",logo:""},team:{involved:["Engineering","Marketing","Design"],roles:["Product Owner","Designer"],noInvolved:"Team of 4"}},{id:"ccam_gen",tags:[{name:"Design"},{name:"Strategy"},{name:"Marketing"}],project:{title:"Flying Robotic Cameras",exposure:"internal/public",year:"2017",duration:"3 Weeks",shipped:!0,shortDesc:"Before drones came on the scene, serious filmmakers were trying to get sophisticated shots that were programmable and repeatable, especially for CGI and post-production work on a budget.",summary:""},technologies:[{name:"Ghost",url:"https://ghost.org/"},{name:"Foundation for Emails",url:"https://foundation.zurb.com/emails.html"}],background:{summary:"",users:["",""],pain:["",""],goal:""},personalContext:{p1:"Yo, this is a story all",p2:"all about how",p3:"my life got flipped turned upside down"},assets:{thumbnail:{color:"dark",name:"ccam_thumb.jpg"},hero:"",assetDir:"work"},company:{name:"Neighborly",location:"San Francisco, CA",shortDescription:"Positioned at the intersection of technology, finance and government, Neighborly develops technologies to radically modernize public finance, the $1 billion per day, 200 year-old market that powers vital public projects like schools, parks, and next-generation infrastructure.",logo:""},team:{involved:["Engineering","Marketing","Design"],roles:["Product Owner","Designer"],noInvolved:"Team of 4"}}]},iaWo:function(t,e){},nrGi:function(t,e){},zHt6:function(t,e){t.exports={id:"stats-model",stats:[{name:"Luck",value:90},{name:"Sleep",value:75},{name:"Tea",value:80}],tools:[{icon:"i-framer",name:"Framer",type:"Prototyping",desc:"For interaction design, especially complex motion and flows."},{icon:"i-sketch",name:"Sketch",type:"UI Design",desc:"Interface design and component system master files. Where I live most days."},{icon:"i-github",name:"Git/Abstract",type:"Versioning",desc:"Code and design asset versioning for maximum time machine status."},{icon:"i-adobe",name:"Creative Cloud",type:"Multimedia",desc:"Motion design, production, illustration, audio engineering, photo editing."}],gear:[{icon:"i-macbook",name:"Macbook Pro",type:"Computing",desc:"My go-to processing machine. Where all my work gets done."},{icon:"i-oculus",name:"Oculus",type:"VR",desc:"A little immersion to pass the time."},{icon:"i-ipad",name:"iPad Pro + Pencil",type:"Concepting",desc:"I've given up paper for Paper by FiftyThree. Life-changing."},{icon:"i-ps4",name:"Playstation 4",type:"Gaming",desc:"Chilling out with Horizon: Zero Dawn, Monster Hunter World, or Dark Souls III"},{icon:"i-pebble",name:"Pebble Watch",type:"HUD",desc:"The little important things that need my attention. RIP."}]}}},["NHnr"]);
//# sourceMappingURL=app.8e65833194cbe1e35e51.js.map