if(!self.define){let e,i={};const a=(a,t)=>(a=new URL(a+".js",t).href,i[a]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=i,document.head.appendChild(e)}else e=a,importScripts(a),i()})).then((()=>{let e=i[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(t,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let n={};const r=e=>a(e,o),c={module:{uri:o},exports:n,require:r};i[o]=Promise.all(t.map((e=>c[e]||r(e)))).then((e=>(s(...e),n)))}}define(["./workbox-7c2a5a06"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"501743043f495d56a138fc8204f8b8d2"},{url:"/_next/static/F9IuoJlsPKdSNIMzv7lgu/_buildManifest.js",revision:"fc1fd8d287a728a188f277c2b75e11ff"},{url:"/_next/static/F9IuoJlsPKdSNIMzv7lgu/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/01b72599.395f7b6f6ca8934c.js",revision:"395f7b6f6ca8934c"},{url:"/_next/static/chunks/1330.363171c448b0f87a.js",revision:"363171c448b0f87a"},{url:"/_next/static/chunks/1365-eb39c1d93b723671.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/2655.231e24456149c81c.js",revision:"231e24456149c81c"},{url:"/_next/static/chunks/29.9769981cfa477110.js",revision:"9769981cfa477110"},{url:"/_next/static/chunks/301.b8df9c47241c4153.js",revision:"b8df9c47241c4153"},{url:"/_next/static/chunks/3150.ecc5b83778a6145e.js",revision:"ecc5b83778a6145e"},{url:"/_next/static/chunks/3795.bdaf67ac08bf1a98.js",revision:"bdaf67ac08bf1a98"},{url:"/_next/static/chunks/392.476c2c16bf353886.js",revision:"476c2c16bf353886"},{url:"/_next/static/chunks/4048.4f2306459671be69.js",revision:"4f2306459671be69"},{url:"/_next/static/chunks/4511.466667e283f9e258.js",revision:"466667e283f9e258"},{url:"/_next/static/chunks/469.81046b77fb02e8b1.js",revision:"81046b77fb02e8b1"},{url:"/_next/static/chunks/5103.5110ef9d5a4d2f2b.js",revision:"5110ef9d5a4d2f2b"},{url:"/_next/static/chunks/5367.b3883882576c4f0f.js",revision:"b3883882576c4f0f"},{url:"/_next/static/chunks/5595.968d3c156021d594.js",revision:"968d3c156021d594"},{url:"/_next/static/chunks/5783.e973cc5e4d7c3709.js",revision:"e973cc5e4d7c3709"},{url:"/_next/static/chunks/5855.a67be49883d8434c.js",revision:"a67be49883d8434c"},{url:"/_next/static/chunks/590.0a95484cbf68e341.js",revision:"0a95484cbf68e341"},{url:"/_next/static/chunks/6210.71789e767d249fbf.js",revision:"71789e767d249fbf"},{url:"/_next/static/chunks/6334-ac6adbeb0ce61b6d.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/6783-d820b8e4da7d02b1.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/7043-e262b288d07e8db4.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/7219.1eb5a57996bb8dd0.js",revision:"1eb5a57996bb8dd0"},{url:"/_next/static/chunks/735.1b79f6c345d4dd73.js",revision:"1b79f6c345d4dd73"},{url:"/_next/static/chunks/7905.1d031576f92a5f13.js",revision:"1d031576f92a5f13"},{url:"/_next/static/chunks/7910.83dcdb480726e96e.js",revision:"83dcdb480726e96e"},{url:"/_next/static/chunks/7913-d6b6bdc7e6e42a39.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/7975.5091f9f4dfe3e78d.js",revision:"5091f9f4dfe3e78d"},{url:"/_next/static/chunks/808.55b24abf9633c1f0.js",revision:"55b24abf9633c1f0"},{url:"/_next/static/chunks/8103.279891857c84eb3b.js",revision:"279891857c84eb3b"},{url:"/_next/static/chunks/8104.d360703ca7d0776b.js",revision:"d360703ca7d0776b"},{url:"/_next/static/chunks/8412.3fb314879eab01bf.js",revision:"3fb314879eab01bf"},{url:"/_next/static/chunks/8503-1dcba8b1d1fa98d8.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/8582.39212fc7c4063968.js",revision:"39212fc7c4063968"},{url:"/_next/static/chunks/870fdd6f-0250565d16f7af74.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/8763-5f28573dddf590c8.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/91dbc596.1d84efc316aa9ba3.js",revision:"1d84efc316aa9ba3"},{url:"/_next/static/chunks/9326.cfd0f03131c647ab.js",revision:"cfd0f03131c647ab"},{url:"/_next/static/chunks/9798.afab8b5ac006c07d.js",revision:"afab8b5ac006c07d"},{url:"/_next/static/chunks/ad2d9488-05322c187153860e.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/app/impressum/page-5c19f565147ce756.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/app/layout-2cc1e4ef8cdd3a18.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/app/not-found-248e4af8243f55ed.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/app/page-556d0a785bc85db3.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/app/studies/summaries/%5BsummaryName%5D/page-3e4cf1eef6c8a1fb.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/app/studies/summaries/page-2b03b5102d87a063.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/fd9d1056-22d9c10c4fdf068e.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/framework-4498e84bb0ba1830.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/main-app-178275e264b0b20d.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/main-de9d83d10d808e19.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/pages/_app-929a65dfe4413450.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/pages/_error-e56463f842927dba.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-b43991a1a8457222.js",revision:"F9IuoJlsPKdSNIMzv7lgu"},{url:"/_next/static/css/3b5bda97c867371f.css",revision:"3b5bda97c867371f"},{url:"/_next/static/css/7dace7a423d1fb59.css",revision:"7dace7a423d1fb59"},{url:"/_next/static/css/b84911e87d57f9fa.css",revision:"b84911e87d57f9fa"},{url:"/_next/static/media/KaTeX_AMS-Regular.1608a09b.woff",revision:"1608a09b"},{url:"/_next/static/media/KaTeX_AMS-Regular.4aafdb68.ttf",revision:"4aafdb68"},{url:"/_next/static/media/KaTeX_AMS-Regular.a79f1c31.woff2",revision:"a79f1c31"},{url:"/_next/static/media/KaTeX_Caligraphic-Bold.b6770918.woff",revision:"b6770918"},{url:"/_next/static/media/KaTeX_Caligraphic-Bold.cce5b8ec.ttf",revision:"cce5b8ec"},{url:"/_next/static/media/KaTeX_Caligraphic-Bold.ec17d132.woff2",revision:"ec17d132"},{url:"/_next/static/media/KaTeX_Caligraphic-Regular.07ef19e7.ttf",revision:"07ef19e7"},{url:"/_next/static/media/KaTeX_Caligraphic-Regular.55fac258.woff2",revision:"55fac258"},{url:"/_next/static/media/KaTeX_Caligraphic-Regular.dad44a7f.woff",revision:"dad44a7f"},{url:"/_next/static/media/KaTeX_Fraktur-Bold.9f256b85.woff",revision:"9f256b85"},{url:"/_next/static/media/KaTeX_Fraktur-Bold.b18f59e1.ttf",revision:"b18f59e1"},{url:"/_next/static/media/KaTeX_Fraktur-Bold.d42a5579.woff2",revision:"d42a5579"},{url:"/_next/static/media/KaTeX_Fraktur-Regular.7c187121.woff",revision:"7c187121"},{url:"/_next/static/media/KaTeX_Fraktur-Regular.d3c882a6.woff2",revision:"d3c882a6"},{url:"/_next/static/media/KaTeX_Fraktur-Regular.ed38e79f.ttf",revision:"ed38e79f"},{url:"/_next/static/media/KaTeX_Main-Bold.b74a1a8b.ttf",revision:"b74a1a8b"},{url:"/_next/static/media/KaTeX_Main-Bold.c3fb5ac2.woff2",revision:"c3fb5ac2"},{url:"/_next/static/media/KaTeX_Main-Bold.d181c465.woff",revision:"d181c465"},{url:"/_next/static/media/KaTeX_Main-BoldItalic.6f2bb1df.woff2",revision:"6f2bb1df"},{url:"/_next/static/media/KaTeX_Main-BoldItalic.70d8b0a5.ttf",revision:"70d8b0a5"},{url:"/_next/static/media/KaTeX_Main-BoldItalic.e3f82f9d.woff",revision:"e3f82f9d"},{url:"/_next/static/media/KaTeX_Main-Italic.47373d1e.ttf",revision:"47373d1e"},{url:"/_next/static/media/KaTeX_Main-Italic.8916142b.woff2",revision:"8916142b"},{url:"/_next/static/media/KaTeX_Main-Italic.9024d815.woff",revision:"9024d815"},{url:"/_next/static/media/KaTeX_Main-Regular.0462f03b.woff2",revision:"0462f03b"},{url:"/_next/static/media/KaTeX_Main-Regular.7f51fe03.woff",revision:"7f51fe03"},{url:"/_next/static/media/KaTeX_Main-Regular.b7f8fe9b.ttf",revision:"b7f8fe9b"},{url:"/_next/static/media/KaTeX_Math-BoldItalic.572d331f.woff2",revision:"572d331f"},{url:"/_next/static/media/KaTeX_Math-BoldItalic.a879cf83.ttf",revision:"a879cf83"},{url:"/_next/static/media/KaTeX_Math-BoldItalic.f1035d8d.woff",revision:"f1035d8d"},{url:"/_next/static/media/KaTeX_Math-Italic.5295ba48.woff",revision:"5295ba48"},{url:"/_next/static/media/KaTeX_Math-Italic.939bc644.ttf",revision:"939bc644"},{url:"/_next/static/media/KaTeX_Math-Italic.f28c23ac.woff2",revision:"f28c23ac"},{url:"/_next/static/media/KaTeX_SansSerif-Bold.8c5b5494.woff2",revision:"8c5b5494"},{url:"/_next/static/media/KaTeX_SansSerif-Bold.94e1e8dc.ttf",revision:"94e1e8dc"},{url:"/_next/static/media/KaTeX_SansSerif-Bold.bf59d231.woff",revision:"bf59d231"},{url:"/_next/static/media/KaTeX_SansSerif-Italic.3b1e59b3.woff2",revision:"3b1e59b3"},{url:"/_next/static/media/KaTeX_SansSerif-Italic.7c9bc82b.woff",revision:"7c9bc82b"},{url:"/_next/static/media/KaTeX_SansSerif-Italic.b4c20c84.ttf",revision:"b4c20c84"},{url:"/_next/static/media/KaTeX_SansSerif-Regular.74048478.woff",revision:"74048478"},{url:"/_next/static/media/KaTeX_SansSerif-Regular.ba21ed5f.woff2",revision:"ba21ed5f"},{url:"/_next/static/media/KaTeX_SansSerif-Regular.d4d7ba48.ttf",revision:"d4d7ba48"},{url:"/_next/static/media/KaTeX_Script-Regular.03e9641d.woff2",revision:"03e9641d"},{url:"/_next/static/media/KaTeX_Script-Regular.07505710.woff",revision:"07505710"},{url:"/_next/static/media/KaTeX_Script-Regular.fe9cbbe1.ttf",revision:"fe9cbbe1"},{url:"/_next/static/media/KaTeX_Size1-Regular.e1e279cb.woff",revision:"e1e279cb"},{url:"/_next/static/media/KaTeX_Size1-Regular.eae34984.woff2",revision:"eae34984"},{url:"/_next/static/media/KaTeX_Size1-Regular.fabc004a.ttf",revision:"fabc004a"},{url:"/_next/static/media/KaTeX_Size2-Regular.57727022.woff",revision:"57727022"},{url:"/_next/static/media/KaTeX_Size2-Regular.5916a24f.woff2",revision:"5916a24f"},{url:"/_next/static/media/KaTeX_Size2-Regular.d6b476ec.ttf",revision:"d6b476ec"},{url:"/_next/static/media/KaTeX_Size3-Regular.9acaf01c.woff",revision:"9acaf01c"},{url:"/_next/static/media/KaTeX_Size3-Regular.a144ef58.ttf",revision:"a144ef58"},{url:"/_next/static/media/KaTeX_Size3-Regular.b4230e7e.woff2",revision:"b4230e7e"},{url:"/_next/static/media/KaTeX_Size4-Regular.10d95fd3.woff2",revision:"10d95fd3"},{url:"/_next/static/media/KaTeX_Size4-Regular.7a996c9d.woff",revision:"7a996c9d"},{url:"/_next/static/media/KaTeX_Size4-Regular.fbccdabe.ttf",revision:"fbccdabe"},{url:"/_next/static/media/KaTeX_Typewriter-Regular.6258592b.woff",revision:"6258592b"},{url:"/_next/static/media/KaTeX_Typewriter-Regular.a8709e36.woff2",revision:"a8709e36"},{url:"/_next/static/media/KaTeX_Typewriter-Regular.d97aaf4a.ttf",revision:"d97aaf4a"},{url:"/_next/static/media/logo_name_black.13c5237f.png",revision:"6a1a1c6e79c39cb68ea78e310729e7ad"},{url:"/_next/static/media/logo_name_white.846e9120.png",revision:"56a7e361c25e2728081f732205995224"},{url:"/_next/static/media/roboto-cyrillic-300-normal.17dc3449.woff",revision:"17dc3449"},{url:"/_next/static/media/roboto-cyrillic-300-normal.88798412.woff2",revision:"88798412"},{url:"/_next/static/media/roboto-cyrillic-400-normal.19f93502.woff",revision:"19f93502"},{url:"/_next/static/media/roboto-cyrillic-400-normal.2d9c9d60.woff2",revision:"2d9c9d60"},{url:"/_next/static/media/roboto-cyrillic-500-normal.6e4060e5.woff",revision:"6e4060e5"},{url:"/_next/static/media/roboto-cyrillic-500-normal.aa68ea54.woff2",revision:"aa68ea54"},{url:"/_next/static/media/roboto-cyrillic-700-normal.1ea775f3.woff",revision:"1ea775f3"},{url:"/_next/static/media/roboto-cyrillic-700-normal.258a358e.woff2",revision:"258a358e"},{url:"/_next/static/media/roboto-cyrillic-ext-300-normal.cd7c5715.woff2",revision:"cd7c5715"},{url:"/_next/static/media/roboto-cyrillic-ext-300-normal.de365ce5.woff",revision:"de365ce5"},{url:"/_next/static/media/roboto-cyrillic-ext-400-normal.02e18372.woff",revision:"02e18372"},{url:"/_next/static/media/roboto-cyrillic-ext-400-normal.d7827ae3.woff2",revision:"d7827ae3"},{url:"/_next/static/media/roboto-cyrillic-ext-500-normal.a05054d8.woff",revision:"a05054d8"},{url:"/_next/static/media/roboto-cyrillic-ext-500-normal.a1b5c90d.woff2",revision:"a1b5c90d"},{url:"/_next/static/media/roboto-cyrillic-ext-700-normal.46ca43b3.woff",revision:"46ca43b3"},{url:"/_next/static/media/roboto-cyrillic-ext-700-normal.dd3651fb.woff2",revision:"dd3651fb"},{url:"/_next/static/media/roboto-greek-300-normal.122e04f2.woff",revision:"122e04f2"},{url:"/_next/static/media/roboto-greek-300-normal.25dc89b0.woff2",revision:"25dc89b0"},{url:"/_next/static/media/roboto-greek-400-normal.63e6dc18.woff2",revision:"63e6dc18"},{url:"/_next/static/media/roboto-greek-400-normal.e3b5876b.woff",revision:"e3b5876b"},{url:"/_next/static/media/roboto-greek-500-normal.533b03d2.woff2",revision:"533b03d2"},{url:"/_next/static/media/roboto-greek-500-normal.55bbf615.woff",revision:"55bbf615"},{url:"/_next/static/media/roboto-greek-700-normal.432b858b.woff2",revision:"432b858b"},{url:"/_next/static/media/roboto-greek-700-normal.b3d9786c.woff",revision:"b3d9786c"},{url:"/_next/static/media/roboto-greek-ext-300-normal.69dd9b06.woff",revision:"69dd9b06"},{url:"/_next/static/media/roboto-greek-ext-300-normal.bc5ce703.woff2",revision:"bc5ce703"},{url:"/_next/static/media/roboto-greek-ext-400-normal.2b547ded.woff2",revision:"2b547ded"},{url:"/_next/static/media/roboto-greek-ext-400-normal.d17f5f2b.woff",revision:"d17f5f2b"},{url:"/_next/static/media/roboto-greek-ext-500-normal.7ea6cffa.woff2",revision:"7ea6cffa"},{url:"/_next/static/media/roboto-greek-ext-500-normal.fcc37f63.woff",revision:"fcc37f63"},{url:"/_next/static/media/roboto-greek-ext-700-normal.950178dd.woff",revision:"950178dd"},{url:"/_next/static/media/roboto-greek-ext-700-normal.a8d16efd.woff2",revision:"a8d16efd"},{url:"/_next/static/media/roboto-latin-300-normal.73b81266.woff",revision:"73b81266"},{url:"/_next/static/media/roboto-latin-300-normal.a4eae32d.woff2",revision:"a4eae32d"},{url:"/_next/static/media/roboto-latin-400-normal.d6d4cf7b.woff",revision:"d6d4cf7b"},{url:"/_next/static/media/roboto-latin-400-normal.f2894edc.woff2",revision:"f2894edc"},{url:"/_next/static/media/roboto-latin-500-normal.3170fd9a.woff2",revision:"3170fd9a"},{url:"/_next/static/media/roboto-latin-500-normal.cdad2023.woff",revision:"cdad2023"},{url:"/_next/static/media/roboto-latin-700-normal.71b2beb8.woff2",revision:"71b2beb8"},{url:"/_next/static/media/roboto-latin-700-normal.f3ddaf9d.woff",revision:"f3ddaf9d"},{url:"/_next/static/media/roboto-latin-ext-300-normal.37d4965d.woff2",revision:"37d4965d"},{url:"/_next/static/media/roboto-latin-ext-300-normal.b9b4688a.woff",revision:"b9b4688a"},{url:"/_next/static/media/roboto-latin-ext-400-normal.21abc8c8.woff2",revision:"21abc8c8"},{url:"/_next/static/media/roboto-latin-ext-400-normal.9600b4a6.woff",revision:"9600b4a6"},{url:"/_next/static/media/roboto-latin-ext-500-normal.41845160.woff",revision:"41845160"},{url:"/_next/static/media/roboto-latin-ext-500-normal.85ebfb55.woff2",revision:"85ebfb55"},{url:"/_next/static/media/roboto-latin-ext-700-normal.6af98c24.woff2",revision:"6af98c24"},{url:"/_next/static/media/roboto-latin-ext-700-normal.b6be88e2.woff",revision:"b6be88e2"},{url:"/_next/static/media/roboto-vietnamese-300-normal.44e9a722.woff",revision:"44e9a722"},{url:"/_next/static/media/roboto-vietnamese-300-normal.b3d3e960.woff2",revision:"b3d3e960"},{url:"/_next/static/media/roboto-vietnamese-400-normal.b339d926.woff",revision:"b339d926"},{url:"/_next/static/media/roboto-vietnamese-400-normal.c95fc061.woff2",revision:"c95fc061"},{url:"/_next/static/media/roboto-vietnamese-500-normal.65b57a7f.woff",revision:"65b57a7f"},{url:"/_next/static/media/roboto-vietnamese-500-normal.7f8c0554.woff2",revision:"7f8c0554"},{url:"/_next/static/media/roboto-vietnamese-700-normal.72bf832f.woff2",revision:"72bf832f"},{url:"/_next/static/media/roboto-vietnamese-700-normal.82ca662a.woff",revision:"82ca662a"},{url:"/dark1.svg",revision:"883b396db4a3da332c95bf298ebd6a2c"},{url:"/light1.svg",revision:"2f8dae02d89295f9c4591379cb5559d3"},{url:"/logos/_logo-192x192.png",revision:"6f2accfa9eb4bbe5b6a01afe476b7733"},{url:"/logos/_logo-384x384.png",revision:"b1b838b58be5f947c9fbb82358302dc6"},{url:"/logos/_logo-512x512.png",revision:"5838f0b2af261e9d35c8dfd7b99ab809"},{url:"/logos/icon-152x152.png",revision:"1a1e694414050dcb891081aa2e4afd04"},{url:"/logos/logo-192x192.png",revision:"6c8afddfd13fd78f1fd73ad3484f18ac"},{url:"/logos/logo-384x384.png",revision:"bbb5e77232d0c52e76b3cb239ad95aac"},{url:"/logos/logo-512x512.png",revision:"664da539f4b6b7d28b53317f248f0136"},{url:"/logos/logo_circle_black.png",revision:"7b47a4f7cc2f35b9d2ee567796e05b36"},{url:"/logos/logo_name_black.png",revision:"6a1a1c6e79c39cb68ea78e310729e7ad"},{url:"/logos/logo_name_white.png",revision:"56a7e361c25e2728081f732205995224"},{url:"/manifest.json",revision:"30870dc610870f663ad64ed1b06ce941"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:a,state:t})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
