class ProductVideo extends HTMLElement{constructor(){super()}connectedCallback(){this.view=this.getAttribute("data-view"),this.type=this.getAttribute("data-type"),this.loop_enabled="true"===this.getAttribute("data-loop-enabled"),this.resizeListener(),"youtube"===this.type?(this.youtubeListeners(),theme.utils.libraryLoader("youtube",theme.libraries.youtube,window.onYouTubeIframeAPIReady)):(this.plyrListeners(),theme.utils.stylesheetLoader("plyr",theme.libraries.plyr+".css"),theme.utils.libraryLoader("plyr",theme.libraries.plyr+".en.js",()=>this.loadPlyrVideo()))}plyrListeners(){this.on("theme:section:load",()=>this.loadPlyrVideo()),this.on("pauseMedia",()=>{this.video&&this.video.pause()}),this.on("playMedia",()=>{this.video&&this.video.play()})}youtubeListeners(){window.on("theme:youtube:apiReady",()=>this.loadYoutubeVideo()),this.on("theme:section:load",()=>this.loadYoutubeVideo())}resizeListener(){window.on("resize.ProductVideo",()=>theme.utils.debounce(250,()=>this.trigger("pauseMedia")))}loadPlyrVideo(){this.video||this.skipVideo()||!Shopify.Video||(this.video=new Shopify.Video(this.querySelector("video"),{iconUrl:theme.libraries.plyr+".svg",loop:{active:this.loop_enabled}}),window.trigger("theme:product:mediaLoaded"))}loadYoutubeVideo(){var e,t;this.video||this.skipVideo()||!YT.Player||(e=this.querySelector(".product-video"),t=this.getAttribute("data-video-id"),this.video=new YT.Player(e,{videoId:t,events:{onReady:e=>{this.on("pauseMedia",()=>e.target.pauseVideo()),this.on("playMedia",()=>e.target.playVideo())},onStateChange:e=>{var t;0===e.data&&this.loop_enabled&&e.target.seekTo(0),1===e.data&&(t=document.querySelectorAll(".product-model--root, .product-video--root").not(this)).length&&t.forEach(e=>e.trigger("pauseMedia"))}}}),window.trigger("theme:product:mediaLoaded"))}skipVideo(){return"small"===theme.mqs.current_window&&"desktop"===this.view||"small"!==theme.mqs.current_window&&"mobile"===this.view}}customElements.define("product-video-root",ProductVideo);