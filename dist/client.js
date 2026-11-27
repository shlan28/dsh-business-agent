window.__ModuleLoader__.load({id:"dsh-business-cards",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var Se=Object.create;var G=Object.defineProperty;var Ce=Object.getOwnPropertyDescriptor;var Ee=Object.getOwnPropertyNames;var De=Object.getPrototypeOf,ze=Object.prototype.hasOwnProperty;var Te=(e,o)=>{for(var s in o)G(e,s,{get:o[s],enumerable:!0})},oe=(e,o,s,m)=>{if(o&&typeof o=="object"||typeof o=="function")for(let d of Ee(o))!ze.call(e,d)&&d!==s&&G(e,d,{get:()=>o[d],enumerable:!(m=Ce(o,d))||m.enumerable});return e};var M=(e,o,s)=>(s=e!=null?Se(De(e)):{},oe(o||!e||!e.__esModule?G(s,"default",{value:e,enumerable:!0}):s,e)),Ae=e=>oe(G({},"__esModule",{value:!0}),e);var Ve={};Te(Ve,{apply:()=>Ue,inject:()=>We});module.exports=Ae(Ve);var ee=M(require("react"),1);var te=`/* \u4EBA\u8109\u540D\u7247\u5899\uFF1A\u628A docs/mockups \u7684\u8BBE\u8BA1\u8BED\u8A00\u642C\u8FDB\u63D2\u4EF6\uFF0C\u6240\u6709\u9009\u62E9\u5668\u90FD\u6536\u5728 .bc-root \u4E0B\u3002 */
.bc-root {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: var(--paper);
  background-image: var(--bg);
  background-size: 100% 100%;
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.bc-root *, .bc-root *::before, .bc-root *::after { box-sizing: border-box; }
.bc-root :is(button, input, textarea, select) { font: inherit; color: inherit; }
.bc-root button { background: none; border: 0; padding: 0; cursor: pointer; }
.bc-root :is(h1, h2, h3, p) { margin: 0; }
.bc-root ::selection { background: var(--lav); color: #fff; }
.bc-wallview { height: 100%; overflow: auto; scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
.bc-wallview::-webkit-scrollbar { width: 7px; }
.bc-wallview::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
.bc-wallview::-webkit-scrollbar-track { background: transparent; }
.bc-root{
    --paper:#F7F7F6;
    --paper-hi:#FFFFFF;
    --paper-lo:#E4E4E3;
    --card:#FDFDFD;
    --ink:#1A1A1A;
    --ink-2:#4B4B4B;
    --muted:#787878;
    --faint:#A5A5A5;
    --line:#DEDEDE;
    --line-soft:#ECECEC;
    --lav:#8F86C9;
    --lav-soft:#EDE8FB;
    --wire:#C9C9C9;
    --wire-strong:#B4B4B4;
    --bg:linear-gradient(180deg,#FEFEFE 0%,#FDFDFD 55%,#F2F2F1 78%,#E4E4E3 100%);
    --green:#5C8D63;
    --shadow-card:0 26px 50px -34px rgba(20,20,20,.55), 0 1px 0 rgba(255,255,255,.7) inset;
    --shadow-card-hover:0 34px 64px -30px rgba(20,20,20,.5), 0 1px 0 rgba(255,255,255,.7) inset;
    --grain-opacity:.05;
    --sans:"Inter","SF Pro Display",-apple-system,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    --mono:"SF Mono","JetBrains Mono",ui-monospace,"Roboto Mono",Menlo,monospace;
    --r-card:14px;
    --r-plate:8px;
  }
.bc-root[data-theme="dark"]{
    --paper:#141414;
    --paper-hi:#1C1C1C;
    --paper-lo:#0B0B0B;
    --card:#1C1C1C;
    --ink:#F1F1F1;
    --ink-2:#C9C9C9;
    --muted:#9A9A9A;
    --faint:#6F6F6F;
    --line:#303030;
    --line-soft:#262626;
    --lav:#B7A9F2;
    --lav-soft:#262239;
    --wire:#3B3B3B;
    --wire-strong:#4D4D4D;
    --bg:linear-gradient(180deg,#181818 0%,#161616 55%,#101010 100%);
    --green:#7FB389;
    --shadow-card:0 26px 50px -30px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.04) inset;
    --shadow-card-hover:0 34px 64px -28px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.05) inset;
    --grain-opacity:.07;
  }
.bc-root *{box-sizing:border-box}
.bc-root, .bc-root{height:100%}
.bc-root{
    margin:0;background-color:var(--paper);color:var(--ink);font-family:var(--sans);
    -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
    background-image:var(--bg);background-attachment:fixed;background-size:100% 100%;
  }
.bc-root ::selection{background:var(--lav);color:#fff}
.bc-root button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.bc-root input{font:inherit;color:inherit}
.bc-root a{color:inherit}
.bc-root .grain{position:absolute;inset:0;pointer-events:none;z-index:60;opacity:var(--grain-opacity);mix-blend-mode:multiply;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E")}
.bc-root[data-theme="dark"] .grain{mix-blend-mode:screen}
.bc-root .mono{font-family:var(--mono);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.bc-root .dim{color:var(--faint)}
.bc-root .edge{position:absolute;top:0;bottom:0;width:1px;background:var(--line);opacity:.55;z-index:0}
.bc-root .edge.l{left:22px}
.bc-root .edge.r{right:22px}
.bc-root .page{position:relative;z-index:1;max-width:1380px;margin:0 auto;padding:34px 54px 30px;min-height:100%}
.bc-root .topline{display:flex;justify-content:space-between;align-items:center;gap:20px}
.bc-root .topline .left{display:flex;align-items:center;gap:9px}
.bc-root .dot{width:6px;height:6px;border-radius:1px;background:var(--ink);display:inline-block}
.bc-root .breadcrumb{opacity:.5;margin-left:2px}
.bc-root .theme-btn{width:26px;height:26px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;color:var(--muted);transition:.2s}
.bc-root .theme-btn:hover{color:var(--ink);border-color:var(--wire-strong);transform:rotate(18deg)}
.bc-root .brand{display:flex;align-items:center;gap:8px;margin-top:2px}
.bc-root .brand-mark{display:grid;place-items:center;color:var(--lav);line-height:0}
.bc-root .brand-name{font-size:13px;font-weight:500;letter-spacing:-.015em;color:var(--ink)}
.bc-root .brand-sep{font-family:var(--mono);font-size:8px;color:var(--faint);margin:0 1px}
.bc-root .brand-sub{font-family:var(--mono);font-size:7.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.bc-root .masthead{display:grid;grid-template-columns:minmax(0,1fr) 290px;align-items:end;gap:48px;margin-top:38px}
.bc-root h1{font-size:clamp(40px,4.3vw,60px);line-height:.98;letter-spacing:-.042em;font-weight:500;margin:0;color:var(--ink)}
.bc-root h1 .lav{color:var(--lav);font-weight:400;letter-spacing:-.03em;display:block}
.bc-root .masthead-aside{padding-bottom:8px}
.bc-root .masthead-aside p{margin:0 0 18px;font-size:12px;line-height:1.8;color:var(--ink-2);max-width:30em}
.bc-root .count{display:flex;flex-direction:column;gap:7px}
.bc-root .count .big{color:var(--ink);letter-spacing:.12em}
.bc-root .count .sub{color:var(--faint);letter-spacing:.1em;font-size:8px}
.bc-root .toolbar{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:38px;padding-top:14px;border-top:1px solid var(--line)}
.bc-root .tabs{display:flex;align-items:center;gap:2px;flex-wrap:wrap}
.bc-root .tab{position:relative;padding:7px 11px;border-radius:999px;font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);transition:.18s}
.bc-root .tab b{font-weight:400;color:var(--faint);margin-left:5px;letter-spacing:.04em}
.bc-root .tab:hover{color:var(--ink)}
.bc-root .tab[aria-selected="true"]{color:var(--ink);background:var(--card);border:1px solid var(--line);padding:6px 10px}
.bc-root .tab[aria-selected="true"] b{color:var(--lav)}
.bc-root .tools{display:flex;align-items:center;gap:18px;flex:1;justify-content:flex-end}
.bc-root .search{display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--line);padding:4px 2px;min-width:0;width:min(280px,34vw);transition:.2s}
.bc-root .search:focus-within{border-color:var(--ink)}
.bc-root .search svg{flex:none;color:var(--faint)}
.bc-root .search input{border:0;outline:0;background:none;width:100%;font-size:11.5px;letter-spacing:.01em}
.bc-root .search input::placeholder{color:var(--faint)}
.bc-root .new{display:flex;align-items:center;gap:8px;background:var(--ink);color:var(--paper);border-radius:999px;padding:9px 15px 9px 12px;font-family:var(--mono);font-size:9px;letter-spacing:.13em;text-transform:uppercase;transition:.2s}
.bc-root .new:hover{transform:translateY(-1px);box-shadow:0 10px 22px -14px rgba(0,0,0,.7)}
.bc-root .new .plus{font-family:var(--sans);font-size:15px;line-height:1}
.bc-root .wall{margin-top:10px}
.bc-root .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(198px,1fr));gap:28px 20px;align-items:stretch}
.bc-root .cell{position:relative;padding-top:36px;display:flex}
.bc-root .cell::before{content:"";position:absolute;left:50%;top:4px;width:1px;height:30px;
    background:linear-gradient(to bottom,transparent 0%,var(--wire) 25%,var(--wire) 100%);opacity:.9}
.bc-root .cell::after{content:"";position:absolute;left:50%;top:33px;width:10px;height:12px;transform:translate(-50%,-50%);
    background:var(--card);border:1px solid var(--wire-strong);border-radius:2px;
    background-image:radial-gradient(circle at 50% 26%, var(--wire-strong) 0 1.4px, transparent 2px);
    box-shadow:0 1px 2px rgba(0,0,0,.07)}
.bc-root .cell.quiet::before, .bc-root .cell.quiet::after{display:none}
.bc-root .card{position:relative;width:100%;display:flex;flex-direction:column;background:var(--card);
    border:1px solid var(--line);border-radius:var(--r-card);box-shadow:var(--shadow-card);
    padding:0 0 0;text-align:left;transition:transform .28s cubic-bezier(.2,.7,.3,1),box-shadow .28s,border-color .2s;
    animation:bc-rise .5s both cubic-bezier(.2,.7,.3,1)}
@keyframes bc-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.bc-root .card:hover{transform:translateY(-6px);box-shadow:var(--shadow-card-hover);border-color:var(--wire-strong)}
.bc-root .card:focus-visible{outline:1px solid var(--ink);outline-offset:3px}
.bc-root .card-top{display:flex;justify-content:space-between;align-items:center;padding:11px 13px 9px}
.bc-root .card-top .cat{font-family:var(--mono);font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.bc-root .card-top .no{font-family:var(--mono);font-size:8px;letter-spacing:.1em;color:var(--faint)}
.bc-root .plate{position:relative;margin:0 9px;border-radius:var(--r-plate);overflow:hidden;aspect-ratio:1/.96;
    display:grid;place-items:center;isolation:isolate}
.bc-root .plate::before{content:"";position:absolute;inset:0;z-index:1;opacity:.5;mix-blend-mode:soft-light;
    background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,.85) 1px, transparent 0);background-size:7px 7px}
.bc-root .plate::after{content:"";position:absolute;inset:0;z-index:0;background:radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,.55), transparent 55%)}
.bc-root .plate .seal{position:relative;z-index:2;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;
    border:1px solid rgba(25,25,23,.22);color:rgba(25,25,23,.82)}
.bc-root .plate .seal span{font-size:46px;font-weight:500;letter-spacing:.02em;line-height:1}
.bc-root .plate .seal em{position:absolute;bottom:-16px;font-family:var(--mono);font-style:normal;font-size:7px;letter-spacing:.2em;color:rgba(25,25,23,.55)}
.bc-root .plate .where{position:absolute;z-index:2;left:10px;bottom:8px;font-family:var(--mono);font-size:7px;letter-spacing:.14em;color:rgba(25,25,23,.6);text-transform:uppercase}
.bc-root[data-theme="dark"] .plate::after{background:radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,.18), transparent 55%)}
.bc-root .card-body{padding:12px 13px 0}
.bc-root .card-name{font-size:18px;font-weight:500;letter-spacing:-.02em;line-height:1.2}
.bc-root .card-role{margin-top:4px;font-size:10.5px;color:var(--muted);letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bc-root .chips{display:flex;gap:5px;flex-wrap:wrap;margin-top:11px;min-height:19px}
.bc-root .chip{font-family:var(--mono);font-size:7.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);
    border:1px solid var(--line);border-radius:999px;padding:3px 7px;line-height:1}
.bc-root .card-foot{margin-top:auto;padding:10px 13px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--line-soft)}
.bc-root .card-foot .last{font-family:var(--mono);font-size:7.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--faint)}
.bc-root .go{width:26px;height:26px;border-radius:50%;background:var(--ink);color:var(--paper);display:grid;place-items:center;transition:.22s}
.bc-root .go svg{transition:transform .22s}
.bc-root .card:hover .go{transform:scale(1.08)}
.bc-root .card:hover .go svg{transform:rotate(-45deg)}
.bc-root .empty{grid-column:1/-1;border:1px dashed var(--line);border-radius:var(--r-card);padding:60px 30px;text-align:center;color:var(--muted)}
.bc-root .empty p{margin:0;font-size:13px}
.bc-root .empty .mono{margin-top:8px}
.bc-detail{position:absolute;inset:0;z-index:40;background-color:var(--paper);display:none;flex-direction:column;
    background-image:var(--bg);background-attachment:fixed;background-size:100% 100%}
.bc-detail.open{display:flex}
.bc-root .dtop{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 54px 14px}
.bc-root .back{display:inline-flex;align-items:center;gap:9px;font-family:var(--mono);font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);transition:.18s}
.bc-root .back:hover{color:var(--ink);gap:12px}
.bc-root .dcenter{position:absolute;left:50%;transform:translateX(-50%)}
.bc-root .dactions{display:flex;gap:10px;align-items:center}
.bc-root .ghost{border:1px solid var(--line);border-radius:999px;padding:7px 13px;font-family:var(--mono);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);transition:.18s;background:var(--card)}
.bc-root .ghost:hover{color:var(--ink);border-color:var(--ink)}
.bc-root .ghost.solid{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.bc-root .ghost.solid:hover{opacity:.85}
.bc-root .dbody{flex:1;min-height:0;display:grid;grid-template-columns:330px minmax(0,1fr);gap:46px;padding:12px 54px 0;max-width:1440px;width:100%;margin:0 auto}
.bc-root .rail{overflow:auto;padding-bottom:40px;scrollbar-width:thin}
.bc-root .rail::-webkit-scrollbar{width:5px}
.bc-root .rail::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px}
.bc-root .flip{perspective:1200px;width:100%;height:352px;cursor:pointer}
.bc-root .flip-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .75s cubic-bezier(.2,.75,.25,1)}
.bc-root .flip.flipped .flip-inner{transform:rotateY(180deg)}
.bc-root .face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:var(--r-card);
    border:1px solid var(--line);background:var(--card);box-shadow:var(--shadow-card);overflow:hidden;display:flex;flex-direction:column}
.bc-root .face.back{transform:rotateY(180deg);background:linear-gradient(150deg,#DAD0F4 0%,#CDE6DF 58%,#E4EDD2 100%);
    border-color:rgba(255,255,255,.4)}
.bc-root .face-top{display:flex;justify-content:space-between;align-items:center;padding:11px 13px 8px}
.bc-root .face-top .mono{font-size:8px}
.bc-root .face .plate{margin:0 9px;aspect-ratio:1/.62;flex:none}
.bc-root .face .plate .seal{width:82px;height:82px}
.bc-root .face .plate .seal span{font-size:36px}
.bc-root .face-info{padding:10px 14px 11px;display:flex;flex-direction:column;flex:1;min-height:0}
.bc-root .face-name{font-size:21px;font-weight:500;letter-spacing:-.02em}
.bc-root .face-role{font-size:10.5px;color:var(--muted);margin-top:3px}
.bc-root .face .chips{margin-top:9px}
.bc-root .flip-hint{margin-top:auto;padding-top:6px;display:flex;justify-content:space-between;align-items:center}
.bc-root .back-body{padding:16px 18px 14px;display:flex;flex-direction:column;flex:1;color:#23241F;position:relative;overflow:hidden}
.bc-root .back-mark{position:absolute;right:-26px;bottom:-44px;font-size:190px;line-height:1;font-weight:600;color:rgba(35,36,31,.055);pointer-events:none;letter-spacing:-.04em}
.bc-root .back-body .mono{color:rgba(35,36,31,.55);font-size:8px}
.bc-root .back-name{font-size:20px;font-weight:600;letter-spacing:-.01em;margin-top:10px}
.bc-root .back-role{font-size:10px;color:rgba(35,36,31,.6);margin-top:3px}
.bc-root .facts{display:flex;flex-direction:column;gap:9px;margin-top:14px;flex:1}
.bc-root .fact{border-top:1px solid rgba(35,36,31,.16);padding-top:8px}
.bc-root .fact .k{font-family:var(--mono);font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(35,36,31,.55)}
.bc-root .fact .v{font-size:10.5px;line-height:1.55;margin-top:2px}
.bc-root .back-foot{display:flex;justify-content:space-between;align-items:center}
.bc-root .back-foot .mono{font-size:7px;color:rgba(35,36,31,.5)}
.bc-root .section{margin-top:30px}
.bc-root .sec-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.bc-root .sec-head .mono{white-space:nowrap}
.bc-root .sec-head .rule{height:1px;background:var(--line);flex:1}
.bc-root .rows{display:flex;flex-direction:column}
.bc-root .row{display:flex;justify-content:space-between;align-items:baseline;gap:14px;padding:7px 0;border-bottom:1px solid var(--line-soft)}
.bc-root .row:last-child{border-bottom:0}
.bc-root .row .k{font-family:var(--mono);font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
.bc-root .row .v{font-size:11.5px;color:var(--ink);text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bc-root .row .v.wide{white-space:normal;line-height:1.6}
.bc-root .next-box{border:1px solid var(--line);background:var(--card);border-left:2px solid var(--lav);border-radius:0 8px 8px 0;padding:12px 14px}
.bc-root .next-box .mono{font-size:7.5px;color:var(--lav)}
.bc-root .next-box p{margin:6px 0 0;font-size:11.5px;line-height:1.65;color:var(--ink-2)}
.bc-root .timeline{display:flex;flex-direction:column;gap:14px}
.bc-root .titem{position:relative;padding-left:14px}
.bc-root .titem::before{content:"";position:absolute;left:0;top:4px;width:4px;height:4px;border-radius:50%;background:var(--wire-strong)}
.bc-root .titem .when{font-family:var(--mono);font-size:7.5px;letter-spacing:.1em;color:var(--faint)}
.bc-root .titem .what{font-size:11px;line-height:1.6;margin-top:2px;color:var(--ink-2)}
.bc-root .research p{margin:0;font-size:11px;line-height:1.75;color:var(--ink-2)}
.bc-root .srcs{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
.bc-root .src{font-family:var(--mono);font-size:7.5px;letter-spacing:.05em;color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:3px 6px;background:var(--card)}
.bc-root .research .stamp{margin-top:10px;font-family:var(--mono);font-size:7px;letter-spacing:.1em;color:var(--faint)}
.bc-root .chat{display:flex;flex-direction:column;min-height:0;border-left:1px solid var(--line);padding-left:46px}
.bc-root .chat-head{display:flex;align-items:center;justify-content:space-between;padding:6px 0 14px;border-bottom:1px solid var(--line)}
.bc-root .chat-head .l{display:flex;align-items:center;gap:10px}
.bc-root .live{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.bc-root .live i{width:5px;height:5px;border-radius:50%;background:var(--green);box-shadow:0 0 0 3px color-mix(in srgb,var(--green) 18%,transparent)}
.bc-root .chat-title{font-size:13px;font-weight:500;letter-spacing:-.01em}
.bc-root .msgs{flex:1;overflow:auto;padding:26px 4px 10px;display:flex;flex-direction:column;gap:20px;scrollbar-width:thin}
.bc-root .msgs::-webkit-scrollbar{width:5px}
.bc-root .msgs::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px}
.bc-root .msg{max-width:660px;animation:bc-rise .35s both}
.bc-root .msg.me{align-self:flex-end;background:var(--card);border:1px solid var(--line);border-radius:12px 12px 2px 12px;padding:10px 14px;font-size:12px;line-height:1.7;color:var(--ink)}
.bc-root .msg .who{display:flex;align-items:center;gap:7px;margin-bottom:8px}
.bc-root .msg .who b{font-family:var(--mono);font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:400}
.bc-root .msg .who time{font-family:var(--mono);font-size:7px;letter-spacing:.08em;color:var(--faint)}
.bc-root .mark{width:16px;height:16px;border-radius:4px;background:var(--ink);color:var(--paper);display:grid;place-items:center;font-family:var(--mono);font-size:6.5px;letter-spacing:0;flex:none}
.bc-root .msg .body{font-size:12.5px;line-height:1.8;color:var(--ink)}
.bc-root .msg .body p{margin:0 0 10px}
.bc-root .msg .body p:last-child{margin-bottom:0}
.bc-root .msg .body strong{font-weight:600;background:linear-gradient(transparent 62%, var(--lav-soft) 62%)}
.bc-root .msg .body ol{margin:8px 0 10px;padding:0;list-style:none;display:flex;flex-direction:column;gap:7px}
.bc-root .msg .body ol li{display:flex;gap:9px;font-size:12px;line-height:1.7}
.bc-root .msg .body ol li i{font-family:var(--mono);font-style:normal;font-size:8px;color:var(--lav);padding-top:4px;flex:none;letter-spacing:.06em}
.bc-root .tool{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:7.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);padding:2px 0}
.bc-root .tool svg{color:var(--lav)}
.bc-root .srclist{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
.bc-root .srccard{border:1px solid var(--line);border-radius:7px;background:var(--card);padding:8px 9px;text-align:left;transition:.18s}
.bc-root .srccard:hover{border-color:var(--wire-strong)}
.bc-root .srccard .dom{font-family:var(--mono);font-size:6.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--lav)}
.bc-root .srccard .tt{font-size:9.5px;line-height:1.45;color:var(--ink-2);margin-top:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.bc-root .composer{padding:10px 0 22px;border-top:1px solid var(--line-soft)}
.bc-root .sugg{display:flex;gap:6px;flex-wrap:wrap;padding:12px 0 10px}
.bc-root .sugg button{font-size:9.5px;border:1px solid var(--line);border-radius:999px;padding:5px 10px;color:var(--muted);background:var(--card);transition:.18s}
.bc-root .sugg button:hover{color:var(--ink);border-color:var(--ink)}
.bc-root .box{border:1px solid var(--line);border-radius:12px;background:var(--card);padding:12px 14px 10px;transition:border-color .2s;box-shadow:0 10px 30px -26px rgba(0,0,0,.5)}
.bc-root .box:focus-within{border-color:var(--wire-strong)}
.bc-root .box textarea{width:100%;border:0;outline:0;background:none;resize:none;font-size:12.5px;line-height:1.6;min-height:46px;color:var(--ink);font-family:var(--sans)}
.bc-root .box textarea::placeholder{color:var(--faint)}
.bc-root .box-foot{display:flex;align-items:center;justify-content:space-between;margin-top:4px}
.bc-root .box-foot .hint{font-family:var(--mono);font-size:7px;letter-spacing:.1em;color:var(--faint);text-transform:uppercase}
.bc-root .send{width:30px;height:30px;border-radius:50%;background:var(--ink);color:var(--paper);display:grid;place-items:center;transition:.2s}
.bc-root .send:hover{transform:translateY(-1px)}
.bc-root .empty-chat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;color:var(--muted);padding-bottom:40px}
.bc-root .empty-chat .big{font-size:22px;font-weight:400;letter-spacing:-.02em;color:var(--ink)}
.bc-root .empty-chat .big em{font-style:normal;color:var(--lav)}
.bc-root .empty-chat p{margin:0;font-size:11px;line-height:1.7;max-width:320px}
.bc-root .foot{display:flex;justify-content:space-between;align-items:center;margin-top:34px;padding-top:12px;border-top:1px solid var(--line);gap:20px}
.bc-root .foot .mono{font-size:7.5px;letter-spacing:.14em}
@media (max-width:1080px){.bc-root .page{padding:28px 40px 24px}
.bc-root .masthead{grid-template-columns:1fr;gap:22px}
.bc-root .masthead-aside{display:flex;gap:24px;align-items:flex-end;justify-content:space-between}
.bc-root .masthead-aside p{margin:0;max-width:44em}
.bc-root .dtop, .bc-root .dbody{padding-left:40px;padding-right:40px}
.bc-root .dbody{grid-template-columns:290px minmax(0,1fr);gap:32px}
.bc-root .chat{padding-left:32px}
.bc-root .srclist{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:820px){.bc-root .page{padding:24px 20px 18px}
.bc-root .edge{display:none}
.bc-root .toolbar{align-items:flex-start;flex-direction:column;gap:12px}
.bc-root .tools{width:100%;justify-content:space-between}
.bc-root .search{width:100%;max-width:320px}
.bc-root .masthead-aside{display:block}
.bc-root .masthead-aside p{margin-bottom:14px}
.bc-root .count{flex-direction:row;gap:12px;flex-wrap:wrap}
.bc-root .count .sub{display:none}
.bc-root .dtop{padding:16px 20px 10px;flex-wrap:wrap}
.bc-root .dcenter{display:none}
.bc-root .dbody{display:block;padding:6px 20px 0;overflow:auto}
.bc-root .rail{overflow:visible}
.bc-root .chat{border-left:0;padding:24px 0 0;border-top:1px solid var(--line);margin-top:26px;min-height:70vh}
.bc-root .flip{height:330px;max-width:340px;margin:0 auto}
.bc-root .face .plate{aspect-ratio:1/.5}
.bc-root .face .plate .seal{width:70px;height:70px}
.bc-root .face .plate .seal span{font-size:30px}
.bc-root .grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:26px 16px}
.bc-root .card-name{font-size:17px}
.bc-root .srclist{grid-template-columns:1fr}
.bc-root .msg{max-width:100%}}
@media (prefers-reduced-motion:reduce){.bc-root *, .bc-root *::before, .bc-root *::after{animation:none!important;transition:none!important}}

/* ---------- \u9762\u677F\u5185\u7684\u8865\u5145\u72B6\u6001 / \u8868\u5355 ---------- */
.bc-root .page { min-height: 100%; }
.bc-root .chat { min-width: 0; }
.bc-root .msg.system { align-self: center; font-family: var(--mono); font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); padding: 2px 0; }
.bc-root .msg.error { border-left: 2px solid #c86a5e; padding-left: 10px; color: #9a4a41; }
.bc-root .msg .body .tool { margin: 0 0 10px; }
.bc-root .msg .tool + .tool { margin-top: -4px; }
.bc-root .live i.pulse { animation: bcPulse 1.4s ease-in-out infinite; }
@keyframes bcPulse { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
.bc-root .bc-empty-research { font-size: 11px; color: var(--muted); line-height: 1.7; }
.bc-root .bc-mini { font-family: var(--mono); font-size: 8px; letter-spacing: .1em; text-transform: uppercase; color: var(--lav); }
.bc-root .bc-toast { position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 80; max-width: 70%;
  background: var(--ink); color: var(--paper); border-radius: 999px; padding: 8px 16px; font-size: 11px; box-shadow: 0 18px 40px -18px rgba(0,0,0,.55); }
.bc-root .bc-toast.error { background: #9a4a41; color: #fff; }

.bc-root .bc-loading { display: grid; gap: 10px; padding: 30px 0; }
.bc-root .bc-skel { height: 14px; border-radius: 6px; background: linear-gradient(90deg, var(--line-soft), var(--paper-hi), var(--line-soft)); background-size: 200% 100%; animation: bcShimmer 1.4s linear infinite; }
@keyframes bcShimmer { to { background-position: -200% 0; } }

.bc-root .note-add { margin-top: 10px; display: inline-flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.bc-root .note-add:hover { color: var(--ink); }
.bc-root .note-form { margin-top: 10px; border: 1px solid var(--line); background: var(--card); border-radius: 10px; padding: 9px 10px; }
.bc-root .note-form textarea { width: 100%; min-height: 54px; resize: vertical; border: 0; outline: 0; background: none; font-size: 11.5px; line-height: 1.6; }
.bc-root .note-form .row-actions { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 6px; }
.bc-root .note-form select { border: 1px solid var(--line); background: var(--card); border-radius: 6px; padding: 3px 5px; font-size: 9.5px; color: var(--muted); outline: none; }

.bc-root .bc-editor-backdrop { position: absolute; inset: 0; z-index: 70; display: grid; place-items: center; padding: 24px;
  background: rgba(20,20,20,.2); backdrop-filter: blur(3px); }
.bc-root .bc-editor { width: min(640px, 100%); max-height: 100%; overflow: auto; background: var(--card); border: 1px solid var(--line);
  border-radius: 16px; box-shadow: 0 40px 90px -40px rgba(0,0,0,.6); padding: 20px 22px 18px; }
.bc-root .bc-editor-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.bc-root .bc-editor-title { font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
.bc-root .bc-editor-close { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; color: var(--muted); }
.bc-root .bc-editor-close:hover { color: var(--ink); border-color: var(--ink); }
.bc-root .bc-form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; margin-top: 18px; }
.bc-root .bc-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.bc-root .bc-field.wide { grid-column: 1 / -1; }
.bc-root .bc-field > span { font-family: var(--mono); font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); }
.bc-root .bc-field input, .bc-root .bc-field select, .bc-root .bc-field textarea {
  width: 100%; border: 1px solid var(--line); border-radius: 8px; background: var(--paper-hi); padding: 8px 10px;
  font-size: 12px; outline: 0; transition: border-color .16s; color: var(--ink); }
.bc-root .bc-field textarea { min-height: 64px; resize: vertical; line-height: 1.6; }
.bc-root .bc-field input:focus, .bc-root .bc-field select:focus, .bc-root .bc-field textarea:focus { border-color: var(--wire-strong); }
.bc-root .bc-field-half { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.bc-root .bc-accent-row { display: flex; gap: 8px; flex-wrap: wrap; padding-top: 2px; }
.bc-root .bc-accent { width: 26px; height: 26px; border-radius: 50%; border: 2px solid transparent; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
.bc-root .bc-accent[aria-pressed="true"] { border-color: var(--ink); }
.bc-root .bc-editor-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line-soft); }
.bc-root .bc-btn { border: 1px solid var(--line); border-radius: 999px; padding: 8px 14px; font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
.bc-root .bc-btn:hover { color: var(--ink); border-color: var(--ink); }
.bc-root .bc-btn.primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.bc-root .bc-btn.primary:hover { opacity: .86; color: var(--paper); }
.bc-root .bc-btn.danger { color: #9a4a41; border-color: color-mix(in srgb, #9a4a41 35%, var(--line)); }
.bc-root .bc-btn:disabled { opacity: .5; cursor: default; }
.bc-root .bc-editor-hint { font-size: 10px; color: var(--faint); }
.bc-root .bc-editor-error { color: #9a4a41; font-size: 11px; margin-top: 8px; }

.bc-root .bc-body-text { white-space: pre-wrap; }
.bc-root .bc-body-text a { color: var(--lav); text-decoration: none; border-bottom: 1px solid color-mix(in srgb, var(--lav) 35%, transparent); }
.bc-root .bc-body-text strong { font-weight: 600; background: linear-gradient(transparent 62%, var(--lav-soft) 62%); }
.bc-root .bc-typing { display: inline-flex; gap: 3px; align-items: center; margin-right: 2px; }
.bc-root .bc-typing i { width: 4px; height: 4px; border-radius: 50%; background: var(--lav); animation: bcBlink 1.1s infinite; }
.bc-root .bc-typing i:nth-child(2) { animation-delay: .18s; }
.bc-root .bc-typing i:nth-child(3) { animation-delay: .36s; }
@keyframes bcBlink { 0%, 100% { opacity: .25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
.bc-root .send.bc-stop { background: var(--ink); }
.bc-root .bc-square { width: 9px; height: 9px; border-radius: 2px; background: var(--paper); display: block; }
.bc-root .bc-copy { display: inline-flex; margin-left: 7px; color: var(--faint); opacity: 0; transition: opacity .16s; vertical-align: -1px; }
.bc-root .row:hover .bc-copy { opacity: 1; }
.bc-root a.src { text-decoration: none; }
.bc-root .msg .body { white-space: normal; }
.bc-root .msg.me + .msg { margin-top: -6px; }
.bc-root .empty .new { margin-left: auto; margin-right: auto; }
.bc-root .bc-editor-backdrop { position: absolute; }
@media (max-width: 820px) {
  .bc-root .bc-form { grid-template-columns: 1fr; }
  .bc-root .bc-field.wide { grid-column: auto; }
  .bc-root .bc-editor { padding: 16px; }
}

.bc-root .bc-compose { max-width: 600px; }
.bc-root .bc-compose-lead { margin: 12px 0 0; font-size: 12px; line-height: 1.7; color: var(--muted); }
.bc-root .bc-compose-input { width: 100%; margin-top: 12px; min-height: 92px; resize: vertical; border: 1px solid var(--line);
  border-radius: 10px; background: var(--paper-hi); padding: 11px 12px; font-size: 13px; line-height: 1.7; outline: 0; color: var(--ink); }
.bc-root .bc-compose-input:focus { border-color: var(--wire-strong); }
.bc-root .bc-compose-input::placeholder { color: var(--faint); }
.bc-root .bc-compose-examples { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
.bc-root .bc-compose-examples button { font-size: 10px; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 4px 9px; background: var(--card); }
.bc-root .bc-compose-examples button:hover { color: var(--ink); border-color: var(--ink); }
.bc-root .bc-compose-status { margin-top: 14px; min-height: 20px; font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); display: flex; gap: 8px; align-items: flex-start; line-height: 1.6; }
.bc-root .bc-compose-status.error { color: #9a4a41; }
.bc-root .bc-compose-reply { display: block; font-family: var(--sans); font-size: 12px; letter-spacing: 0; text-transform: none; color: var(--ink-2); border-left: 2px solid var(--lav); padding-left: 10px; }
.bc-root .bc-compose-reply b { display: block; font-family: var(--mono); font-size: 7.5px; letter-spacing: .12em; color: var(--lav); margin-bottom: 3px; font-weight: 400; }
.bc-root .bc-spinner { display: inline-flex; gap: 3px; padding-top: 4px; }
.bc-root .bc-spinner i { width: 4px; height: 4px; border-radius: 50%; background: var(--lav); animation: bcBlink 1.1s infinite; }
.bc-root .bc-spinner i:nth-child(2) { animation-delay: .18s; }
.bc-root .bc-spinner i:nth-child(3) { animation-delay: .36s; }
.bc-root .bc-link { background: none; border: 0; padding: 0; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.bc-root .bc-link:hover { color: var(--ink); }
@media (max-width: 820px) {
  .bc-root .bc-compose { padding: 16px; }
}
`;var y=M(require("react"),1);async function H(e,{method:o="GET",body:s}={}){let m=await fetch(`/business-cards${e}`,{method:o,cache:"no-store",headers:s===void 0?{}:{"content-type":"application/json"},body:s===void 0?void 0:JSON.stringify(s)}),d=await m.json().catch(()=>({}));if(!m.ok||d?.ok===!1)throw new Error(d?.error||`HTTP ${m.status}`);return d}var p=M(require("react"),1);var A=M(require("react"),1);function K({size:e=11,rotate:o=0}){return A.default.createElement("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",style:{transform:`rotate(${o}deg)`},"aria-hidden":"true"},A.default.createElement("path",{d:"M5 12h13M13 6l6 6-6 6"}))}function X({size:e=13}){return A.default.createElement("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.7","aria-hidden":"true"},A.default.createElement("circle",{cx:"11",cy:"11",r:"7"}),A.default.createElement("path",{d:"m20 20-3.2-3.2"}))}function re({size:e=12}){return A.default.createElement("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8","aria-hidden":"true"},A.default.createElement("path",{d:"M15 6l-6 6 6 6"}))}function ae({size:e=11}){return A.default.createElement("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6","aria-hidden":"true"},A.default.createElement("rect",{x:"9",y:"9",width:"11",height:"11",rx:"2"}),A.default.createElement("path",{d:"M5 15V5a2 2 0 0 1 2-2h8"}))}function ie({size:e=22}){return A.default.createElement("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5","aria-hidden":"true"},A.default.createElement("path",{d:"M4 3.5h16",opacity:".55"}),A.default.createElement("path",{d:"M12 3.5v4",opacity:".55"}),A.default.createElement("rect",{x:"6.5",y:"7.5",width:"11",height:"13",rx:"2",fill:"none"}),A.default.createElement("circle",{cx:"12",cy:"12.4",r:"2.1",fill:"currentColor",stroke:"none",opacity:".8"}),A.default.createElement("path",{d:"M8.6 18.2c.5-2 1.7-3 3.4-3s2.9 1 3.4 3",opacity:".7"}))}var Y=M(require("react"),1);var ne=["investor","partner","client","advisor","other"],q={investor:"INVESTOR",partner:"PARTNER",client:"CLIENT",advisor:"ADVISOR",other:"OTHER"},se={investor:"\u6295\u8D44\u4EBA",partner:"\u5408\u4F5C\u4F19\u4F34",client:"\u5BA2\u6237",advisor:"\u987E\u95EE",other:"\u5176\u4ED6"},W={orchid:"linear-gradient(150deg,#EFC9F6 0%,#D9B0F0 48%,#C6A0E9 100%)",peach:"linear-gradient(150deg,#FAD9B4 0%,#F3C193 55%,#EBA875 100%)",butter:"linear-gradient(150deg,#F8E7A9 0%,#EFD483 55%,#E4C266 100%)",rose:"linear-gradient(150deg,#F8D2CE 0%,#EDB6B1 55%,#E3A09B 100%)",sage:"linear-gradient(150deg,#DCE9CC 0%,#C4D9AE 55%,#AEC994 100%)",sky:"linear-gradient(150deg,#D6E5F4 0%,#B9D1E9 55%,#A2C0DE 100%)",blue:"linear-gradient(150deg,#DCD8F5 0%,#BFBAEA 55%,#A9A2DE 100%)"},le=Object.keys(W);function Ie(e){return W[e?.accent]||W.orchid}function U(e){let o=Number.isFinite(e)&&e>0?e:1;return String(o).padStart(3,"0")}function Be(e){let o=typeof e=="string"?e.trim():"";return o?/^[\x00-\x7F\s]+$/.test(o)?o.split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||"").join(""):[...o][0]:"?"}var Le=[[60,"\u79D2\u524D",1],[3600,"\u5206\u949F\u524D",60],[86400,"\u5C0F\u65F6\u524D",3600],[604800,"\u5929\u524D",86400],[2592e3,"\u5468\u524D",604800],[31536e3,"\u4E2A\u6708\u524D",2592e3]];function V(e){if(!e)return"\u2014";let o=Date.parse(e);if(!Number.isFinite(o))return"\u2014";let s=Math.max(0,Date.now()-o)/1e3;if(s<60)return"\u521A\u521A";for(let[m,d,c]of Le)if(s<m)return`${Math.max(1,Math.floor(s/c))} ${d}`;return _(e)}function _(e){if(!e)return"";let o=Date.parse(e);if(!Number.isFinite(o))return"";let s=new Date(o);return`${s.getFullYear()}.${String(s.getMonth()+1).padStart(2,"0")}.${String(s.getDate()).padStart(2,"0")}`}function Z(e){if(!e)return"";let o=Date.parse(e);return Number.isFinite(o)?new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit"}).format(new Date(o)):""}function pe(e){if(!e)return null;let o=Date.parse(e);return Number.isFinite(o)?new Date(o).toISOString():null}function ce(e){if(!e)return"";let o=Date.parse(e);if(!Number.isFinite(o))return"";let s=new Date(o),m=d=>String(d).padStart(2,"0");return`${s.getFullYear()}-${m(s.getMonth()+1)}-${m(s.getDate())}T${m(s.getHours())}:${m(s.getMinutes())}`}function de(e){try{return new URL(e).hostname.replace(/^www\./,"")}catch{return""}}function J({contact:e,className:o="",seal:s=!1}){return Y.default.createElement("div",{className:`plate ${o}`.trim(),style:{background:Ie(e)}},Y.default.createElement("span",{className:"seal",style:{borderColor:"rgba(20,20,20,.22)"}},Y.default.createElement("span",null,Be(e?.name)),Y.default.createElement("em",null,e?.nameEn?e.nameEn.toUpperCase():"")),Y.default.createElement("span",{className:"where"},[e?.city,q[e?.type]].filter(Boolean).join(" \xB7 ")))}var He=[["all","ALL"],["investor","INVESTORS"],["partner","PARTNERS"],["client","CLIENTS"],["advisor","ADVISORS"]];function Oe(e){let o={all:e.length};for(let s of e)o[s.type]=(o[s.type]||0)+1;return o}function me({contacts:e,loaded:o,error:s,t:m,onOpen:d,onNew:c,onRetry:z}){let[w,S]=p.default.useState("all"),[E,N]=p.default.useState(""),x=Oe(e),v=p.default.useMemo(()=>{let b=E.trim().toLowerCase();return e.filter(a=>w!=="all"&&a.type!==w?!1:b?[a.name,a.nameEn,a.company,a.role,a.city,...a.tags||[]].filter(Boolean).join(" ").toLowerCase().includes(b):!0)},[e,w,E]);return p.default.createElement("div",{className:"bc-wallview"},p.default.createElement("div",{className:"page"},p.default.createElement("div",{className:"brand","aria-label":"Achoverse Business Agent"},p.default.createElement("span",{className:"brand-mark","aria-hidden":"true"},p.default.createElement("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"currentColor"},p.default.createElement("path",{d:"M12 2.6l2.3 7.1 7.1 2.3-7.1 2.3L12 21.4l-2.3-7.1L2.6 12l7.1-2.3z"}))),p.default.createElement("span",{className:"brand-name"},"Achoverse"),p.default.createElement("span",{className:"brand-sep"},"/"),p.default.createElement("span",{className:"brand-sub"},"Business Agent")),p.default.createElement("header",{className:"masthead"},p.default.createElement("h1",null,"The people",p.default.createElement("span",{className:"lav"},"behind the deal.")),p.default.createElement("div",{className:"masthead-aside"},p.default.createElement("p",null,"\u6295\u8D44\u4EBA\u3001\u5408\u4F19\u4EBA\u3001\u5BA2\u6237\u3001\u987E\u95EE\u2014\u2014\u628A\u6BCF\u4E00\u6BB5\u5173\u7CFB\u6536\u8FDB\u4E00\u5F20\u540D\u7247\u3002\u70B9\u5F00\u4EFB\u4F55\u4E00\u5F20\uFF0C\u5DE6\u8FB9\u662F\u6863\u6848\uFF0C\u53F3\u8FB9\u662F DSH\uFF1B\u5B83\u4F1A\u66FF\u4F60\u67E5\u3001\u66FF\u4F60\u8BB0\u3001\u66FF\u4F60\u60F3\u4E0B\u4E00\u6B65\u3002"))),p.default.createElement("div",{className:"toolbar"},p.default.createElement("div",{className:"tabs",role:"tablist"},He.map(([b,a])=>p.default.createElement("button",{key:b,role:"tab","aria-selected":w===b,className:"tab",onClick:()=>S(b)},a,p.default.createElement("b",null,x[b]||0)))),p.default.createElement("div",{className:"tools"},p.default.createElement("label",{className:"search"},p.default.createElement(X,null),p.default.createElement("input",{type:"search",value:E,onChange:b=>N(b.target.value),placeholder:m("\u641C\u7D22\u59D3\u540D\u3001\u516C\u53F8\u6216\u6807\u7B7E\u2026"),autoComplete:"off"})),p.default.createElement("button",{className:"new",onClick:c},p.default.createElement("span",{className:"plus"},"+"),m("\u65B0\u589E\u4EBA\u8109")))),p.default.createElement("main",{className:"wall"},o?s?p.default.createElement("div",{className:"empty"},p.default.createElement("p",null,m("\u52A0\u8F7D\u5931\u8D25"),"\uFF1A",s),p.default.createElement("button",{className:"mono",style:{marginTop:10,color:"var(--lav)"},onClick:z},m("\u91CD\u8BD5"))):e.length?v.length?p.default.createElement("div",{className:"grid"},v.map((b,a)=>p.default.createElement("div",{className:"cell",key:b.id,style:{animationDelay:`${Math.min(a*35,350)}ms`}},p.default.createElement("button",{className:"card",style:{animationDelay:`${Math.min(a*35,350)}ms`},onClick:()=>d(b.id),"aria-label":`${b.name} ${b.role} ${b.company}`},p.default.createElement("div",{className:"card-top"},p.default.createElement("span",{className:"cat"},q[b.type]||"OTHER"),p.default.createElement("span",{className:"no"},U(b.no))),p.default.createElement(J,{contact:b}),p.default.createElement("div",{className:"card-body"},p.default.createElement("div",{className:"card-name"},b.name),p.default.createElement("div",{className:"card-role"},[b.role,b.company&&b.company!=="\u2014"?b.company:""].filter(Boolean).join(" \xB7 ")||" "),p.default.createElement("div",{className:"chips"},(b.tags||[]).map(h=>p.default.createElement("span",{className:"chip",key:h},h)))),p.default.createElement("div",{className:"card-foot"},p.default.createElement("span",{className:"last"},"LAST \xB7 ",V(b.lastContactAt)),p.default.createElement("span",{className:"go"},p.default.createElement(K,{size:11}))))))):p.default.createElement("div",{className:"empty"},p.default.createElement("p",null,m("\u6CA1\u6709\u5339\u914D\u7684\u4EBA"),"\u3002"),p.default.createElement("div",{className:"mono",style:{marginTop:8}},m("\u6362\u4E2A\u540D\u5B57\u6216\u6807\u7B7E"))):p.default.createElement("div",{className:"empty"},p.default.createElement("p",null,m("\u8FD8\u6CA1\u6709\u4EBA"),"\u3002"),p.default.createElement("button",{className:"new",style:{margin:"16px auto 0"},onClick:c},p.default.createElement("span",{className:"plus"},"+"),m("\u52A0\u7B2C\u4E00\u4E2A"))):p.default.createElement("div",{className:"bc-loading","aria-label":m("\u52A0\u8F7D\u4E2D")},p.default.createElement("div",{className:"bc-skel",style:{width:"38%"}}),p.default.createElement("div",{className:"bc-skel",style:{width:"62%"}}),p.default.createElement("div",{className:"bc-skel",style:{width:"24%"}})))))}var t=M(require("react"),1);var i=M(require("react"),1);var Pe=["\u5199\u4E00\u6761\u8DDF\u8FDB\u5FAE\u4FE1","\u67E5\u4E00\u4E0B\u6700\u8FD1\u7684\u52A8\u6001","\u6574\u7406\u6210\u4F1A\u524D brief"];function $e({text:e}){let o=[],s=/\*\*([^*]+)\*\*|(https?:\/\/[^\s)）]+)/g,m=0,d,c=0;for(;d=s.exec(e);)d.index>m&&o.push(e.slice(m,d.index)),d[1]?o.push(i.default.createElement("strong",{key:`b${c}`},d[1])):d[2]&&o.push(i.default.createElement("a",{key:`a${c}`,href:d[2],target:"_blank",rel:"noreferrer"},d[2])),m=d.index+d[0].length,c+=1;return m<e.length&&o.push(e.slice(m)),o}function Me({text:e}){return i.default.createElement("div",{className:"bc-body-text"},e.split(`
`).map((o,s)=>i.default.createElement(i.default.Fragment,{key:s},s?i.default.createElement("br",null):null,i.default.createElement($e,{text:o}))))}function je({running:e,hasSession:o,t:s}){return i.default.createElement("span",{className:"live"},i.default.createElement("i",{className:e?"pulse":""}),s(e?"\u6B63\u5728\u56DE\u590D":o?"\u5DF2\u8FDE\u63A5":"\u5C31\u7EEA"))}function be({contact:e,t:o,capabilities:s,onToast:m,onContactChanged:d}){let[c,z]=i.default.useState([]),[w,S]=i.default.useState(!1),[E,N]=i.default.useState(e.sessionId||null),[x,v]=i.default.useState(""),[b,a]=i.default.useState(""),[h,F]=i.default.useState(!1),C=i.default.useRef(0),D=i.default.useRef(null),I=i.default.useRef(!0),L=i.default.useRef(!1),P=i.default.useRef(null),g=i.default.useCallback(async(l=C.current)=>{if(!L.current){L.current=!0;try{let r=await H(`/chat/state?id=${encodeURIComponent(e.id)}&after=${l}`);if(!I.current)return;Array.isArray(r.entries)&&r.entries.length&&z(u=>{let $=new Set(u.map(j=>j.seq));return[...u,...r.entries.filter(j=>!$.has(j.seq))]}),C.current=Math.max(l,r.lastSeq||0),S(!!r.running),N(r.sessionId||null),v(r.error||""),P.current!==null&&r.revision!==void 0&&r.revision!==P.current&&d?.(),r.revision!==void 0&&(P.current=r.revision)}catch(r){I.current&&v(r?.message||String(r))}finally{L.current=!1}}},[e.id,d]);i.default.useEffect(()=>(I.current=!0,C.current=0,P.current=null,z([]),S(!1),v(""),a(""),F(!1),N(e.sessionId||null),g(0),()=>{I.current=!1}),[e.id]),i.default.useEffect(()=>{let r=setInterval(()=>{document.visibilityState==="visible"&&g()},w?700:1500);return()=>clearInterval(r)},[g,w]),i.default.useEffect(()=>{let l=D.current;if(!l)return;l.scrollHeight-l.scrollTop-l.clientHeight<220&&(l.scrollTop=l.scrollHeight)},[c.length,w]);let k=async()=>{let l=b.trim();if(!(!l||h)){if(w){m?.(o("DSH \u6B63\u5728\u56DE\u590D\uFF0C\u5148\u7B49\u4E00\u4E0B\u6216\u70B9\u505C\u6B62"));return}F(!0),v("");try{await H("/chat/send",{method:"POST",body:{id:e.id,text:l}}),a(""),await g()}catch(r){v(r?.message||String(r))}finally{F(!1)}}},T=async()=>{try{await H("/chat/stop",{method:"POST",body:{id:e.id}}),S(!1),await g()}catch(l){v(l?.message||String(l))}},B=l=>{a(l),D.current?.querySelector("textarea")?.focus()},O=!s.chat;return i.default.createElement("section",{className:"chat"},i.default.createElement("div",{className:"chat-head"},i.default.createElement("div",{className:"l"},i.default.createElement("span",{className:"chat-title"},"\u4E0E ",e.name," \u7684\u4F1A\u8BDD"),i.default.createElement(je,{running:w,hasSession:!!E,t:o})),i.default.createElement("span",{className:"mono dim"},"DSH")),i.default.createElement("div",{className:"msgs",ref:D},!c.length&&!w&&!x?i.default.createElement("div",{className:"empty-chat"},i.default.createElement("div",{className:"big"},"Ask DSH about ",i.default.createElement("em",null,e.name),"."),i.default.createElement("p",null,"\u5B83\u4F1A\u53BB\u67E5\u516C\u5F00\u4FE1\u606F\u3001\u8BB0\u4F4F\u4F60\u4EEC\u7684\u6BCF\u4E00\u6B21\u4E92\u52A8\uFF0C\u518D\u628A\u7ED3\u8BBA\u5199\u56DE\u5DE6\u8FB9\u7684\u6863\u6848\u3002")):null,c.map((l,r)=>{if(l.role==="user")return i.default.createElement("div",{className:"msg me",key:l.seq},l.text);if(l.role==="assistant"){let u=r===0||c[r-1]?.role!=="assistant";return i.default.createElement("div",{className:"msg",key:l.seq},u?i.default.createElement("div",{className:"who"},i.default.createElement("span",{className:"mark"},"DSH"),i.default.createElement("b",null,"DEEPSEEK HARNESS"),i.default.createElement("time",null,Z(l.at))):null,i.default.createElement("div",{className:"body"},i.default.createElement(Me,{text:l.text})))}return l.role==="tool"?i.default.createElement("div",{className:"msg",key:l.seq,style:{maxWidth:660}},i.default.createElement("div",{className:"tool"},i.default.createElement(X,{size:10}),l.text,l.name?i.default.createElement("span",{className:"dim"}," \xB7 ",l.name):null)):l.role==="error"?i.default.createElement("div",{className:"msg error",key:l.seq},l.text):i.default.createElement("div",{className:"msg system",key:l.seq},l.text)}),w?i.default.createElement("div",{className:"msg"},i.default.createElement("div",{className:"tool"},i.default.createElement("span",{className:"bc-typing","aria-hidden":"true"},i.default.createElement("i",null),i.default.createElement("i",null),i.default.createElement("i",null)),o("\u6B63\u5728\u56DE\u590D"),"\u2026")):null,x?i.default.createElement("div",{className:"msg error"},x):null),i.default.createElement("div",{className:"composer"},i.default.createElement("div",{className:"sugg"},Pe.map(l=>i.default.createElement("button",{key:l,onClick:()=>B(l)},o(l)))),O?i.default.createElement("div",{className:"box"},i.default.createElement("p",{className:"bc-empty-research"},o("\u5F53\u524D\u73AF\u5883\u6CA1\u6709\u4F1A\u8BDD\u670D\u52A1\uFF0C\u6682\u65F6\u53EA\u80FD\u67E5\u770B\u6863\u6848"))):i.default.createElement("div",{className:"box"},i.default.createElement("textarea",{rows:2,value:b,onChange:l=>a(l.target.value),placeholder:`${o("\u95EE DSH \u5173\u4E8E")} ${e.name} ${o("\u7684\u4E8B\u2014\u2014\u5B83\u4F1A\u53BB\u67E5\uFF0C\u7136\u540E\u628A\u7ED3\u679C\u5199\u56DE\u8FD9\u5F20\u5361\u2026")}`,onKeyDown:l=>{l.key==="Enter"&&!l.shiftKey&&!l.nativeEvent?.isComposing&&(l.preventDefault(),k())}}),i.default.createElement("div",{className:"box-foot"},i.default.createElement("span",{className:"hint"},"ENTER \u53D1\u9001 \xB7 SHIFT + ENTER \u6362\u884C"),w?i.default.createElement("button",{className:"send bc-stop",onClick:T,"aria-label":o("\u505C\u6B62")},i.default.createElement("span",{className:"bc-square"})):i.default.createElement("button",{className:"send",onClick:k,disabled:h||!b.trim(),"aria-label":o("\u53D1\u9001")},i.default.createElement(K,{size:13}))))))}var fe={wechat:"\u5FAE\u4FE1",meeting:"\u7EBF\u4E0B",call:"\u7535\u8BDD",email:"\u90AE\u4EF6",note:"\u5907\u6CE8"};function Q({title:e,children:o,aside:s}){return t.default.createElement("div",{className:"section"},t.default.createElement("div",{className:"sec-head"},t.default.createElement("span",{className:"mono"},e),t.default.createElement("span",{className:"rule"}),s),o)}function ue({contact:e,t:o,capabilities:s,onBack:m,onEdit:d,onToast:c,onNote:z,onResearch:w,onContactChanged:S}){let[E,N]=t.default.useState(!1),[x,v]=t.default.useState(!1),[b,a]=t.default.useState(""),[h,F]=t.default.useState("note"),[C,D]=t.default.useState(!1),[I,L]=t.default.useState(!1);t.default.useEffect(()=>{N(!1),v(!1),a(""),F("note"),D(!1)},[e.id]);let P=async r=>{if(r)try{await navigator.clipboard.writeText(r),c?.(o("\u5DF2\u590D\u5236"))}catch{c?.(o("\u590D\u5236\u5931\u8D25"))}},g=async()=>{if(!C){D(!0);try{await w(e.id)}finally{D(!1)}}},k=async()=>{let r=b.trim();if(!r){c?.(o("\u8BF4\u70B9\u4EC0\u4E48\u518D\u4FDD\u5B58"));return}L(!0);try{await z({id:e.id,text:r,kind:h}),a(""),v(!1),c?.(o("\u5DF2\u4FDD\u5B58"))}finally{L(!1)}},T=e.research||{summary:"",sources:[],updatedAt:null},B=!!(T.updatedAt&&Date.now()-Date.parse(T.updatedAt)>720*60*60*1e3),O=e.timeline||[],l=e.nextStep;return t.default.createElement("div",{className:"bc-detail open","aria-hidden":"false"},t.default.createElement("div",{className:"dtop"},t.default.createElement("button",{className:"back",onClick:m},t.default.createElement(re,null),o("\u8FD4\u56DE\u5168\u90E8")),t.default.createElement("span",{className:"mono dim dcenter"},q[e.type]||"OTHER"," \xB7 ",U(e.no)," \xB7 ",e.city||"\u2014"),t.default.createElement("div",{className:"dactions"},t.default.createElement("button",{className:"ghost",onClick:d},o("\u7F16\u8F91")),t.default.createElement("button",{className:"ghost solid",onClick:g,disabled:C},C?o("\u6B63\u5728\u7814\u7A76"):`${o("\u7814\u7A76\u6B64\u4EBA")} \u2197`))),t.default.createElement("div",{className:"dbody"},t.default.createElement("aside",{className:"rail"},t.default.createElement("div",{className:`flip ${E?"flipped":""}`,role:"button",tabIndex:0,title:E?"FLIP BACK":"FLIP TO DOSSIER",onClick:()=>N(r=>!r),onKeyDown:r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),N(u=>!u))}},t.default.createElement("div",{className:"flip-inner"},t.default.createElement("div",{className:"face front"},t.default.createElement("div",{className:"face-top"},t.default.createElement("span",{className:"mono dim"},"BUSINESS CARD"),t.default.createElement("span",{className:"mono dim"},U(e.no))),t.default.createElement(J,{contact:e}),t.default.createElement("div",{className:"face-info"},t.default.createElement("div",{className:"face-name"},e.name),t.default.createElement("div",{className:"face-role"},[e.role,e.company&&e.company!=="\u2014"?e.company:""].filter(Boolean).join(" \xB7 ")||"\u2014"),t.default.createElement("div",{className:"chips"},(e.tags||[]).map(r=>t.default.createElement("span",{className:"chip",key:r},r))),t.default.createElement("div",{className:"flip-hint"},t.default.createElement("span",{className:"mono dim"},"FLIP TO DOSSIER"),t.default.createElement("span",{className:"mono",style:{color:"var(--lav)"}},"\u21BB")))),t.default.createElement("div",{className:"face back"},t.default.createElement("div",{className:"back-body"},t.default.createElement("div",{style:{display:"flex",justifyContent:"space-between"}},t.default.createElement("span",{className:"mono"},"DOSSIER \xB7 ",new Date().getFullYear()),t.default.createElement("span",{className:"mono"},"\u2197")),t.default.createElement("div",{className:"back-name"},e.name),t.default.createElement("div",{className:"back-role"},[e.role,e.company].filter(Boolean).join(" \xB7 ")||"\u2014"),t.default.createElement("div",{className:"facts"},t.default.createElement("div",{className:"fact"},t.default.createElement("div",{className:"k"},"LABELS"),t.default.createElement("div",{className:"v"},(e.tags||[]).join(" / ")||"\u2014")),t.default.createElement("div",{className:"fact"},t.default.createElement("div",{className:"k"},"LAST TOUCH"),t.default.createElement("div",{className:"v"},O[0]?`${_(O[0].at)} \xB7 ${fe[O[0].kind]||"\u5907\u6CE8"} \u2014\u2014 ${O[0].text}`:"\u2014")),t.default.createElement("div",{className:"fact"},t.default.createElement("div",{className:"k"},"NEXT STEP"),t.default.createElement("div",{className:"v"},l?.text?`${l.at?_(l.at):"\u5F85\u5B9A"} \u2014\u2014 ${l.text}`:"\u2014"))),t.default.createElement("div",{className:"back-foot"},t.default.createElement("span",{className:"mono"},"DSH RESEARCHED \xB7 ",T.updatedAt?V(T.updatedAt):"\u2014"),t.default.createElement("span",{className:"mono"},"\u21BB FRONT")),t.default.createElement("div",{className:"back-mark"},e.name?.[0]||""))))),t.default.createElement(Q,{title:"CONTACT"},t.default.createElement("div",{className:"rows"},[["EMAIL",e.contact?.email],["WECHAT",e.contact?.wechat],["PHONE",e.contact?.phone],["CITY",e.city]].map(([r,u])=>t.default.createElement("div",{className:"row",key:r,onClick:()=>P(u),style:{cursor:u?"pointer":"default"}},t.default.createElement("span",{className:"k"},r),t.default.createElement("span",{className:"v",title:u||""},u||"\u2014",u?t.default.createElement("span",{className:"bc-copy"},t.default.createElement(ae,null)):null))))),t.default.createElement(Q,{title:"NEXT STEP"},l?.text?t.default.createElement("div",{className:"next-box"},t.default.createElement("span",{className:"mono"},l.at?`${_(l.at)} \xB7 ${Z(l.at)}`:o("\u5F85\u5B9A")),t.default.createElement("p",null,l.text)):t.default.createElement("div",{className:"next-box",style:{borderLeftColor:"var(--line)"}},t.default.createElement("span",{className:"mono dim"},o("\u6682\u65E0\u4E0B\u4E00\u6B65")),t.default.createElement("p",{style:{color:"var(--muted)"}},"\u5728\u7F16\u8F91\u91CC\u8865\u4E00\u6761\uFF0C\u6216\u8005\u8BA9 DSH \u6839\u636E\u6700\u8FD1\u4E92\u52A8\u7ED9\u4E00\u4E2A\u3002"))),t.default.createElement(Q,{title:"RESEARCH",aside:t.default.createElement("button",{className:"mono bc-mini",onClick:g,disabled:C,style:{background:"none"}},o(C?"\u6B63\u5728\u7814\u7A76":"\u91CD\u65B0\u7814\u7A76"))},T.summary?t.default.createElement(t.default.Fragment,null,t.default.createElement("p",null,T.summary),(T.sources||[]).length?t.default.createElement("div",{className:"srcs"},T.sources.map(r=>t.default.createElement("a",{className:"src",key:r.url,href:r.url,target:"_blank",rel:"noreferrer",title:r.title},de(r.url).toUpperCase()||r.site))):null,t.default.createElement("div",{className:"stamp"},"UPDATED ",T.updatedAt?V(T.updatedAt):"\u2014"," \xB7 ",(T.sources||[]).length," SOURCES"),B?t.default.createElement("div",{className:"stamp",style:{color:"#9a4a41"}},"\u8D44\u6599\u53EF\u80FD\u5DF2\u8FC7\u671F\uFF0C\u5EFA\u8BAE\u70B9\u300C\u91CD\u65B0\u7814\u7A76\u300D\u3002"):null):t.default.createElement("p",{className:"bc-empty-research"},o("\u8FD8\u6CA1\u6709\u7814\u7A76"),"\u3002\u70B9\u53F3\u4E0A\u89D2 RESEARCH\uFF0C\u8BA9 DSH \u67E5\u4E00\u8F6E\u516C\u5F00\u4FE1\u606F\uFF0C\u5E76\u628A\u7ED3\u8BBA\u4E0E\u6765\u6E90\u5199\u56DE\u8FD9\u5F20\u5361\u3002")),t.default.createElement(Q,{title:"TIMELINE",aside:t.default.createElement("button",{className:"mono bc-mini",onClick:()=>v(r=>!r)},x?o("\u6536\u8D77"):`+ ${o("\u8BB0\u4E00\u6761")}`)},t.default.createElement("div",{className:"timeline"},O.length?O.map(r=>t.default.createElement("div",{className:"titem",key:r.id||r.at},t.default.createElement("div",{className:"when"},_(r.at)," \xB7 ",fe[r.kind]||"\u5907\u6CE8"),t.default.createElement("div",{className:"what"},r.text))):t.default.createElement("div",{className:"what",style:{color:"var(--muted)",fontSize:11}},"\u8FD8\u6CA1\u6709\u8BB0\u5F55\u3002\u7B2C\u4E00\u6B21\u804A\u5929\u4E4B\u540E\uFF0C\u4ECE\u8FD9\u91CC\u5F00\u59CB\u79EF\u7D2F\u3002")),x?t.default.createElement("div",{className:"note-form"},t.default.createElement("textarea",{value:b,onChange:r=>a(r.target.value),placeholder:"\u4ECA\u5929\u804A\u4E86\u4EC0\u4E48\uFF1F\u4E0B\u4E00\u6B65\u662F\u4EC0\u4E48\uFF1F",autoFocus:!0}),t.default.createElement("div",{className:"row-actions"},t.default.createElement("select",{value:h,onChange:r=>F(r.target.value)},t.default.createElement("option",{value:"note"},"\u5907\u6CE8"),t.default.createElement("option",{value:"wechat"},"\u5FAE\u4FE1"),t.default.createElement("option",{value:"meeting"},"\u7EBF\u4E0B"),t.default.createElement("option",{value:"call"},"\u7535\u8BDD"),t.default.createElement("option",{value:"email"},"\u90AE\u4EF6")),t.default.createElement("span",{style:{display:"flex",gap:8}},t.default.createElement("button",{className:"mono",onClick:()=>v(!1)},o("\u53D6\u6D88")),t.default.createElement("button",{className:"mono",style:{color:"var(--lav)"},onClick:k,disabled:I},o("\u4FDD\u5B58"))))):null)),t.default.createElement(be,{contact:e,t:o,capabilities:s,onToast:c,onContactChanged:S})))}var n=M(require("react"),1);function Ye(){return{name:"",nameEn:"",type:"other",role:"",company:"",city:"",tags:"",email:"",wechat:"",phone:"",notes:"",nextText:"",nextAt:"",accent:"orchid"}}function _e(e){return e?{name:e.name||"",nameEn:e.nameEn||"",type:e.type||"other",role:e.role||"",company:e.company||"",city:e.city||"",tags:(e.tags||[]).join(", "),email:e.contact?.email||"",wechat:e.contact?.wechat||"",phone:e.contact?.phone||"",notes:e.notes||"",nextText:e.nextStep?.text||"",nextAt:ce(e.nextStep?.at),accent:e.accent||"orchid"}:Ye()}function ge({contact:e,t:o,onSave:s,onDelete:m,onClose:d}){let[c,z]=n.default.useState(()=>_e(e)),[w,S]=n.default.useState(""),[E,N]=n.default.useState(!1),x=a=>z(h=>({...h,...a})),v=async()=>{if(!E){if(!c.name.trim()){S(`${o("\u59D3\u540D")}${o("\u4E0D\u80FD\u4E3A\u7A7A")}`);return}N(!0),S("");try{await s({id:e?.id,name:c.name,nameEn:c.nameEn,type:c.type,role:c.role,company:c.company,city:c.city,accent:c.accent,tags:c.tags.split(/[,，、]/).map(a=>a.trim()).filter(Boolean),contact:{email:c.email,wechat:c.wechat,phone:c.phone},notes:c.notes,nextStep:c.nextText.trim()?{text:c.nextText,at:pe(c.nextAt)}:null})}catch(a){S(a?.message||String(a))}finally{N(!1)}}};n.default.useEffect(()=>{let a=h=>{h.key==="Escape"&&(h.preventDefault(),d()),h.key==="Enter"&&(h.metaKey||h.ctrlKey)&&(h.preventDefault(),v())};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)});let b=async()=>{if(!(!e||E)&&window.confirm(o("\u5220\u9664\u786E\u8BA4"))){N(!0);try{await m(e.id)}catch(a){S(a?.message||String(a)),N(!1)}}};return n.default.createElement("div",{className:"bc-editor-backdrop",onMouseDown:a=>{a.target===a.currentTarget&&d()}},n.default.createElement("div",{className:"bc-editor",role:"dialog","aria-modal":"true","aria-label":o(e?"\u7F16\u8F91":"\u65B0\u589E\u4EBA\u8109")},n.default.createElement("div",{className:"bc-editor-head"},n.default.createElement("div",null,n.default.createElement("div",{className:"mono dim"},"BUSINESS CARD"),n.default.createElement("div",{className:"bc-editor-title"},o(e?"\u7F16\u8F91":"\u65B0\u589E\u4EBA\u8109"))),n.default.createElement("button",{className:"bc-editor-close",onClick:d,"aria-label":o("\u6536\u8D77")},"\xD7")),n.default.createElement("div",{className:"bc-form"},n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u59D3\u540D")," *"),n.default.createElement("input",{value:c.name,onChange:a=>x({name:a.target.value}),autoFocus:!0})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u82F1\u6587\u540D")),n.default.createElement("input",{value:c.nameEn,onChange:a=>x({nameEn:a.target.value})})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u89D2\u8272")),n.default.createElement("input",{value:c.role,onChange:a=>x({role:a.target.value})})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u516C\u53F8")),n.default.createElement("input",{value:c.company,onChange:a=>x({company:a.target.value})})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u7C7B\u578B")),n.default.createElement("select",{value:c.type,onChange:a=>x({type:a.target.value})},ne.map(a=>n.default.createElement("option",{key:a,value:a},se[a])))),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u57CE\u5E02")),n.default.createElement("input",{value:c.city,onChange:a=>x({city:a.target.value})})),n.default.createElement("label",{className:"bc-field wide"},n.default.createElement("span",null,o("\u6807\u7B7E")," \xB7 ",o("\u6700\u591A 4 \u4E2A")),n.default.createElement("input",{value:c.tags,onChange:a=>x({tags:a.target.value}),placeholder:"AI \u5E94\u7528, B \u8F6E"})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u90AE\u7BB1")),n.default.createElement("input",{value:c.email,onChange:a=>x({email:a.target.value})})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u5FAE\u4FE1")),n.default.createElement("input",{value:c.wechat,onChange:a=>x({wechat:a.target.value})})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u7535\u8BDD")),n.default.createElement("input",{value:c.phone,onChange:a=>x({phone:a.target.value})})),n.default.createElement("label",{className:"bc-field"},n.default.createElement("span",null,o("\u4E0B\u4E00\u6B65\u65F6\u95F4")),n.default.createElement("input",{type:"datetime-local",value:c.nextAt,onChange:a=>x({nextAt:a.target.value})})),n.default.createElement("label",{className:"bc-field wide"},n.default.createElement("span",null,o("\u4E0B\u4E00\u6B65")),n.default.createElement("input",{value:c.nextText,onChange:a=>x({nextText:a.target.value}),placeholder:"\u7EA6 45 \u5206\u949F\u7535\u8BDD\uFF0C\u5BF9\u9F50 B \u8F6E\u8282\u594F"})),n.default.createElement("label",{className:"bc-field wide"},n.default.createElement("span",null,o("\u5907\u6CE8")),n.default.createElement("textarea",{value:c.notes,onChange:a=>x({notes:a.target.value})})),n.default.createElement("div",{className:"bc-field wide"},n.default.createElement("span",null,o("\u5361\u7247\u989C\u8272")),n.default.createElement("div",{className:"bc-accent-row"},le.map(a=>n.default.createElement("button",{key:a,type:"button",className:"bc-accent","aria-pressed":c.accent===a,style:{background:W[a]},title:a,onClick:()=>x({accent:a})}))))),w?n.default.createElement("div",{className:"bc-editor-error"},w):null,n.default.createElement("div",{className:"bc-editor-foot"},n.default.createElement("div",null,e?n.default.createElement("button",{className:"bc-btn danger",onClick:b,disabled:E},o("\u5220\u9664")):n.default.createElement("span",{className:"bc-editor-hint"},o("\u53EA\u4FDD\u5B58\u5728\u672C\u673A"))),n.default.createElement("div",{style:{display:"flex",alignItems:"center",gap:10}},n.default.createElement("span",{className:"bc-editor-hint"},"\u2318 / Ctrl + Enter"),n.default.createElement("button",{className:"bc-btn",onClick:d},o("\u53D6\u6D88")),n.default.createElement("button",{className:"bc-btn primary",onClick:v,disabled:E},E?"\u2026":o("\u4FDD\u5B58"))))))}var f=M(require("react"),1);var Ke=[{label:"\u5468\u7267 \xB7 \u89C2\u590F",text:"\u5468\u7267\uFF0C\u89C2\u590F\u521B\u59CB\u4EBA\uFF0C\u5BA2\u6237\uFF0C\u6807\u7B7E \u54C1\u724C / DTC"},{label:"\u6797\u665A \xB7 \u9AD8\u74F4",text:"\u6797\u665A\uFF0C\u9AD8\u74F4\u521B\u6295\u6295\u8D44\u603B\u76D1\uFF0C\u6295\u8D44\u4EBA\uFF0C\u5173\u6CE8\u6D88\u8D39\u548C\u51FA\u6D77"},{label:"\u9648\u53EF\u4E3A \xB7 Notion",text:"\u9648\u53EF\u4E3A\uFF0CNotion \u4E2D\u56FD\u589E\u957F VP\uFF0C\u5408\u4F5C\u4F19\u4F34\uFF0C\u5FAE\u4FE1 chenkw"}];function xe({t:e,onClose:o,onCreated:s,onFallback:m}){let[d,c]=f.default.useState(""),[z,w]=f.default.useState(""),[S,E]=f.default.useState("idle"),[N,x]=f.default.useState(""),[v,b]=f.default.useState(""),[a,h]=f.default.useState(!1),F=f.default.useRef(null),C=f.default.useRef(!1);f.default.useEffect(()=>{F.current?.focus();let g=k=>{k.key==="Escape"&&(k.preventDefault(),o()),k.key==="Enter"&&(k.metaKey||k.ctrlKey)&&(k.preventDefault(),I())};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)});let D=f.default.useCallback(g=>{!g||C.current||(C.current=!0,s(g))},[s]);f.default.useEffect(()=>{if(!z||C.current)return;let g=!0,k=async()=>{try{let B=await H(`/compose/state?id=${encodeURIComponent(z)}`);if(!g)return;E(B.status||"pending"),x(B.reply||""),B.error&&b(B.error),B.status==="done"&&D(B.contactId)}catch(B){g&&b(B?.message||String(B))}};k();let T=setInterval(k,700);return()=>{g=!1,clearInterval(T)}},[z,D]);let I=async()=>{let g=d.trim();if(!(!g||a)){h(!0),b("");try{let k=await H("/compose",{method:"POST",body:{id:z||void 0,text:g}});w(k.id),E(k.status||"pending"),x(k.reply||""),c(""),k.status==="done"&&D(k.contactId),F.current?.focus()}catch(k){b(k?.message||String(k))}finally{h(!1)}}},L=S==="pending",P=S==="done";return f.default.createElement("div",{className:"bc-editor-backdrop",onMouseDown:g=>{g.target===g.currentTarget&&o()}},f.default.createElement("div",{className:"bc-editor bc-compose",role:"dialog","aria-modal":"true","aria-label":e("\u65B0\u589E\u4EBA\u8109")},f.default.createElement("div",{className:"bc-editor-head"},f.default.createElement("div",null,f.default.createElement("div",{className:"mono dim"},"NEW PERSON"),f.default.createElement("div",{className:"bc-editor-title"},e("\u4E00\u53E5\u8BDD\u65B0\u5EFA\u4EBA\u8109"))),f.default.createElement("button",{className:"bc-editor-close",onClick:o,"aria-label":e("\u6536\u8D77")},"\xD7")),f.default.createElement("p",{className:"bc-compose-lead"},e("\u7528\u4E00\u53E5\u8BDD\u8BF4\u6E05\u8FD9\u4E2A\u4EBA\u662F\u8C01\uFF0CDSH \u4F1A\u628A\u5B83\u6574\u7406\u6210\u4E00\u5F20\u540D\u7247\u3002")),f.default.createElement("textarea",{ref:F,className:"bc-compose-input",rows:3,value:d,onChange:g=>c(g.target.value),placeholder:e("\u4F8B\u5982\uFF1A\u5468\u7267\uFF0C\u89C2\u590F\u521B\u59CB\u4EBA\uFF0C\u5BA2\u6237\uFF0C\u6807\u7B7E \u54C1\u724C / DTC"),onKeyDown:g=>{g.key==="Enter"&&!g.shiftKey&&!g.nativeEvent?.isComposing&&(g.preventDefault(),I())}}),f.default.createElement("div",{className:"bc-compose-examples"},Ke.map(g=>f.default.createElement("button",{key:g.label,onClick:()=>c(g.text)},g.label))),N||L||v?f.default.createElement("div",{className:`bc-compose-status ${v?"error":""}`},L&&!N&&!v?f.default.createElement("span",{className:"bc-spinner","aria-hidden":"true"},f.default.createElement("i",null),f.default.createElement("i",null),f.default.createElement("i",null)):null,v?f.default.createElement("span",null,v):N?f.default.createElement("span",{className:"bc-compose-reply"},f.default.createElement("b",null,"DSH"),N):f.default.createElement("span",null,e("DSH \u6B63\u5728\u5EFA\u6863\u2026"))):null,P?f.default.createElement("div",{className:"bc-compose-status"},"\u2713 ",e("\u5EFA\u597D\u4E86\uFF0C\u6B63\u5728\u6253\u5F00\u2026")):null,f.default.createElement("div",{className:"bc-editor-foot"},f.default.createElement("div",null,f.default.createElement("button",{className:"bc-editor-hint bc-link",type:"button",onClick:m},e("\u6539\u7528\u8868\u5355"))),f.default.createElement("div",{style:{display:"flex",alignItems:"center",gap:10}},f.default.createElement("span",{className:"bc-editor-hint"},"Enter \u53D1\u9001 \xB7 Esc \u5173\u95ED"),f.default.createElement("button",{className:"bc-btn",onClick:o},e("\u53D6\u6D88")),f.default.createElement("button",{className:"bc-btn primary",onClick:I,disabled:a||!d.trim()},e(L?"\u7EE7\u7EED\u8865\u5145":"\u4EA4\u7ED9 DSH"))))))}var R="dsh:business-cards:open";function ve(e){try{let s=(e.get?.("theme")||e.theme)?.getTheme?.();if(s?.active?.colorScheme)return s.active.colorScheme}catch{}try{if(document.body?.hasAttribute("data-ds-dark-theme")||document.body?.dataset?.theme==="dark")return"dark"}catch{}try{return window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light"}catch{return"light"}}function he({ctx:e,t:o,css:s}){let[m,d]=y.default.useState({loaded:!1,error:"",contacts:[],revision:0,capabilities:{chat:!1}}),[c,z]=y.default.useState(()=>{try{return sessionStorage.getItem(R)||""}catch{return""}}),[w,S]=y.default.useState(null),[E,N]=y.default.useState(!1),[x,v]=y.default.useState(null),[b,a]=y.default.useState(()=>ve(e)),h=y.default.useRef(null),F=y.default.useRef(!0),C=y.default.useCallback((r,{error:u=!1}={})=>{v({text:r,error:u,key:Date.now()}),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>v(null),2600)},[]),D=y.default.useCallback(async()=>{try{let r=await H("/state");if(!F.current)return;d({loaded:!0,error:"",contacts:Array.isArray(r.contacts)?r.contacts:[],revision:r.revision||0,capabilities:r.capabilities||{chat:!1}})}catch(r){if(!F.current)return;d(u=>({...u,loaded:!0,error:r?.message||String(r)}))}},[]);y.default.useEffect(()=>{F.current=!0,D();let r=setInterval(()=>{document.visibilityState==="visible"&&D()},4e3);return()=>{F.current=!1,clearInterval(r),h.current&&clearTimeout(h.current)}},[D]),y.default.useEffect(()=>{let r;try{r=new MutationObserver(()=>a(ve(e))),r.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","data-theme"]})}catch{}let u;try{let $=e.get?.("theme")||e.theme;if(u=e.on?.("theme/change",j=>{j?.active?.colorScheme&&a(j.active.colorScheme)}),!$)return u}catch{}return()=>{u?.(),r?.disconnect()}},[e]);let I=y.default.useCallback(r=>{z(r);try{sessionStorage.setItem(R,r)}catch{}},[]),L=y.default.useCallback(()=>{z("");try{sessionStorage.removeItem(R)}catch{}},[]),P=async r=>{let u=await H("/op",{method:"POST",body:{action:"save",contact:r}});u.state&&d($=>({...$,contacts:u.state.contacts,revision:u.state.revision,loaded:!0,error:""})),S(null),u.contact?.id&&I(u.contact.id),C(o("\u5DF2\u4FDD\u5B58"))},g=async r=>{let u=await H("/op",{method:"POST",body:{action:"delete",id:r}});u.state&&d($=>({...$,contacts:u.state.contacts,revision:u.state.revision})),S(null),L(),C(o("\u5DF2\u5220\u9664"))},k=async r=>{let u=await H("/op",{method:"POST",body:{action:"note",...r}});u.state&&d($=>({...$,contacts:u.state.contacts,revision:u.state.revision}))},T=y.default.useCallback(async r=>{N(!1),await D(),I(r),C(o("\u5DF2\u4FDD\u5B58"))},[D,I,C,o]),B=async r=>{try{await H("/research",{method:"POST",body:{id:r}}),C(o("\u5DF2\u5F00\u59CB\u7814\u7A76\uFF0C\u7ED3\u679C\u4F1A\u5199\u56DE\u8FD9\u5F20\u5361"))}catch(u){throw C(u?.message||String(u),{error:!0}),u}},O=c?m.contacts.find(r=>r.id===c):null,l=w?w==="new"?null:m.contacts.find(r=>r.id===w.id)||null:void 0;return y.default.createElement("div",{className:"bc-root","data-theme":b},y.default.createElement("style",null,s),y.default.createElement("div",{className:"grain"}),y.default.createElement("div",{className:"edge l"}),y.default.createElement("div",{className:"edge r"}),O?y.default.createElement(ue,{contact:O,t:o,capabilities:m.capabilities,onBack:L,onEdit:()=>S({id:O.id}),onToast:C,onNote:k,onResearch:B,onContactChanged:D}):y.default.createElement(me,{contacts:m.contacts,loaded:m.loaded,error:m.error,t:o,onOpen:I,onNew:()=>m.capabilities.chat?N(!0):S("new"),onRetry:D}),E?y.default.createElement(xe,{t:o,onClose:()=>N(!1),onCreated:T,onFallback:()=>{N(!1),S("new")}}):null,w!==null?y.default.createElement(ge,{contact:l||null,t:o,onSave:P,onDelete:g,onClose:()=>S(null)}):null,x?y.default.createElement("div",{className:`bc-toast ${x.error?"error":""}`},x.text):null)}var we="business-cards",ye={\u4EBA\u8109\u52A9\u624B:"People assistant",\u65B0\u589E\u4EBA\u8109:"New person",\u4E00\u53E5\u8BDD\u65B0\u5EFA\u4EBA\u8109:"One line, one card","\u7528\u4E00\u53E5\u8BDD\u8BF4\u6E05\u8FD9\u4E2A\u4EBA\u662F\u8C01\uFF0CDSH \u4F1A\u628A\u5B83\u6574\u7406\u6210\u4E00\u5F20\u540D\u7247\u3002":"Describe the person in one sentence; DSH will turn it into a card.","\u4F8B\u5982\uFF1A\u5468\u7267\uFF0C\u89C2\u590F\u521B\u59CB\u4EBA\uFF0C\u5BA2\u6237\uFF0C\u6807\u7B7E \u54C1\u724C / DTC":"e.g. Zhou Mu, founder of To Summer, client, tags brand / DTC","DSH \u6B63\u5728\u5EFA\u6863\u2026":"DSH is building the card\u2026",\u7EE7\u7EED\u8865\u5145:"Add more","\u4EA4\u7ED9 DSH":"Hand to DSH",\u6539\u7528\u8868\u5355:"Use the form instead","\u5EFA\u597D\u4E86\uFF0C\u6B63\u5728\u6253\u5F00\u2026":"Done, opening\u2026",\u8BF4\u8BF4\u8FD9\u4E2A\u4EBA\u662F\u8C01:"Tell me who this is",\u7F16\u8F91:"Edit",\u5220\u9664:"Delete",\u4FDD\u5B58:"Save",\u53D6\u6D88:"Cancel",\u7814\u7A76\u6B64\u4EBA:"Research",\u8FD4\u56DE\u5168\u90E8:"All people",\u8054\u7CFB\u65B9\u5F0F:"Contact",\u4E0B\u4E00\u6B65:"Next step",\u65F6\u95F4\u7EBF:"Timeline",\u7814\u7A76:"Research",\u91CD\u65B0\u7814\u7A76:"Refresh",\u8FD8\u6CA1\u6709\u7814\u7A76:"No research yet",\u6682\u65E0\u4E0B\u4E00\u6B65:"No next step yet",\u5F85\u5B9A:"TBD",\u8BB0\u4E00\u6761:"Add note",\u8BF4\u70B9\u4EC0\u4E48\u518D\u4FDD\u5B58:"Write something first",\u6B63\u5728\u56DE\u590D:"Replying",\u5DF2\u8FDE\u63A5:"Connected",\u5C31\u7EEA:"Ready",\u53D1\u9001:"Send",\u505C\u6B62:"Stop",\u6E05\u7A7A:"Clear",\u6CA1\u6709\u66F4\u591A\u4E86:"No more",\u8FD8\u6CA1\u6709\u4EBA:"No one yet",\u52A0\u7B2C\u4E00\u4E2A:"Add the first person",\u6CA1\u6709\u5339\u914D\u7684\u4EBA:"No matches",\u6362\u4E2A\u540D\u5B57\u6216\u6807\u7B7E:"Try another name or tag",\u52A0\u8F7D\u4E2D:"Loading",\u91CD\u8BD5:"Retry",\u59D3\u540D:"Name",\u82F1\u6587\u540D:"English name",\u89D2\u8272:"Role",\u516C\u53F8:"Company",\u7C7B\u578B:"Type",\u57CE\u5E02:"City",\u6807\u7B7E:"Tags",\u90AE\u7BB1:"Email",\u5FAE\u4FE1:"WeChat",\u7535\u8BDD:"Phone",\u4E0B\u4E00\u6B65\u65F6\u95F4:"Next step at",\u5907\u6CE8:"Notes",\u6536\u8D77:"Close",\u6B63\u5728\u7814\u7A76:"Researching",\u5176\u4ED6:"Other",\u6295\u8D44\u4EBA:"Investor",\u5408\u4F5C\u4F19\u4F34:"Partner",\u5BA2\u6237:"Client",\u987E\u95EE:"Advisor",\u5199\u4E00\u6761\u8DDF\u8FDB\u5FAE\u4FE1:"Draft a follow-up message",\u67E5\u4E00\u4E0B\u6700\u8FD1\u7684\u52A8\u6001:"Recent public updates","\u6574\u7406\u6210\u4F1A\u524D brief":"Pre-meeting brief",\u4FDD\u5B58\u5931\u8D25:"Could not save",\u5220\u9664\u786E\u8BA4:"Delete this card? The DSH conversation history stays.","\u5F53\u524D\u73AF\u5883\u6CA1\u6709\u4F1A\u8BDD\u670D\u52A1\uFF0C\u6682\u65F6\u53EA\u80FD\u67E5\u770B\u6863\u6848":"No conversation service in this environment; the dossier is still available.","DSH \u6B63\u5728\u56DE\u590D\uFF0C\u5148\u7B49\u4E00\u4E0B\u6216\u70B9\u505C\u6B62":"DSH is replying. Wait or stop it first.","\u8BF4\u70B9\u4EC0\u4E48\u2026":"Ask DSH about this person\u2026","\u95EE DSH \u8981\u4E00\u4E2A\u4E0B\u4E00\u6B65":"Ask DSH for a next step",\u5DF2\u590D\u5236:"Copied",\u590D\u5236\u5931\u8D25:"Could not copy",\u4E0D\u80FD\u4E3A\u7A7A:"Required","\u6700\u591A 4 \u4E2A":"up to 4",\u5361\u7247\u989C\u8272:"Card color",\u53EA\u4FDD\u5B58\u5728\u672C\u673A:"Stored locally",\u52A0\u8F7D\u5931\u8D25:"Could not load","\u641C\u7D22\u59D3\u540D\u3001\u516C\u53F8\u6216\u6807\u7B7E\u2026":"Search name, company or tag\u2026","\u95EE DSH \u5173\u4E8E":"Ask DSH about","\u7684\u4E8B\u2014\u2014\u5B83\u4F1A\u53BB\u67E5\uFF0C\u7136\u540E\u628A\u7ED3\u679C\u5199\u56DE\u8FD9\u5F20\u5361\u2026":"\u2014 it will search and write the result back to this card\u2026","\u5DF2\u5F00\u59CB\u7814\u7A76\uFF0C\u7ED3\u679C\u4F1A\u5199\u56DE\u8FD9\u5F20\u5361":"Research started; the result will be written back to this card",\u5DF2\u4FDD\u5B58:"Saved",\u5DF2\u5220\u9664:"Deleted",\u672A\u547D\u540D:"Untitled",\u4EBA:"people"};function ke(e){let o=Object.fromEntries(Object.keys(ye).map(s=>[s,s]));return e.locale.register(we,{zh:o,en:ye})}function Ne(e){return e.locale.bind(we)}var We=["slots","locale"];function qe({size:e=22}){return ee.default.createElement(ie,{size:e})}function Ue(e){e.effect(()=>ke(e),"business-cards: locale");let o=Ne(e);e.slots.inject("sidebar.panellist",()=>e.slots.register({name:"sidebar.panellist",id:"business-cards",order:11,label:()=>o("\u4EBA\u8109\u52A9\u624B")},qe)),e.slots.inject("main",()=>e.slots.register({name:"main",key:"business-cards"},function(){return ee.default.createElement(he,{ctx:e,t:o,css:te})}))}
return module.exports}})
