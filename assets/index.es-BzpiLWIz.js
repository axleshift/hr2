import{r as gn,p as A,R as Jn}from"./index-Do00Xf1q.js";var T="top",B="bottom",$="right",I="left",$e="auto",Yt=[T,B,$,I],Ct="start",Wt="end",Ka="clippingParents",ta="viewport",Tt="popper",Qa="reference",hn=Yt.reduce(function(t,e){return t.concat([e+"-"+Ct,e+"-"+Wt])},[]),ea=[].concat(Yt,[$e]).reduce(function(t,e){return t.concat([e,e+"-"+Ct,e+"-"+Wt])},[]),Za="beforeRead",Ja="read",tr="afterRead",er="beforeMain",nr="main",ar="afterMain",rr="beforeWrite",ir="write",or="afterWrite",sr=[Za,Ja,tr,er,nr,ar,rr,ir,or];function q(t){return t?(t.nodeName||"").toLowerCase():null}function j(t){if(t==null)return window;if(t.toString()!=="[object Window]"){var e=t.ownerDocument;return e&&e.defaultView||window}return t}function ht(t){var e=j(t).Element;return t instanceof e||t instanceof Element}function W(t){var e=j(t).HTMLElement;return t instanceof e||t instanceof HTMLElement}function Ue(t){if(typeof ShadowRoot>"u")return!1;var e=j(t).ShadowRoot;return t instanceof e||t instanceof ShadowRoot}function cr(t){var e=t.state;Object.keys(e.elements).forEach(function(n){var a=e.styles[n]||{},r=e.attributes[n]||{},i=e.elements[n];!W(i)||!q(i)||(Object.assign(i.style,a),Object.keys(r).forEach(function(s){var o=r[s];o===!1?i.removeAttribute(s):i.setAttribute(s,o===!0?"":o)}))})}function lr(t){var e=t.state,n={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(e.elements.popper.style,n.popper),e.styles=n,e.elements.arrow&&Object.assign(e.elements.arrow.style,n.arrow),function(){Object.keys(e.elements).forEach(function(a){var r=e.elements[a],i=e.attributes[a]||{},s=Object.keys(e.styles.hasOwnProperty(a)?e.styles[a]:n[a]),o=s.reduce(function(c,l){return c[l]="",c},{});!W(r)||!q(r)||(Object.assign(r.style,o),Object.keys(i).forEach(function(c){r.removeAttribute(c)}))})}}const fr={name:"applyStyles",enabled:!0,phase:"write",fn:cr,effect:lr,requires:["computeStyles"]};function G(t){return t.split("-")[0]}var dt=Math.max,re=Math.min,Lt=Math.round;function Ae(){var t=navigator.userAgentData;return t!=null&&t.brands&&Array.isArray(t.brands)?t.brands.map(function(e){return e.brand+"/"+e.version}).join(" "):navigator.userAgent}function na(){return!/^((?!chrome|android).)*safari/i.test(Ae())}function kt(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!1);var a=t.getBoundingClientRect(),r=1,i=1;e&&W(t)&&(r=t.offsetWidth>0&&Lt(a.width)/t.offsetWidth||1,i=t.offsetHeight>0&&Lt(a.height)/t.offsetHeight||1);var s=ht(t)?j(t):window,o=s.visualViewport,c=!na()&&n,l=(a.left+(c&&o?o.offsetLeft:0))/r,f=(a.top+(c&&o?o.offsetTop:0))/i,m=a.width/r,p=a.height/i;return{width:m,height:p,top:f,right:l+m,bottom:f+p,left:l,x:l,y:f}}function Ye(t){var e=kt(t),n=t.offsetWidth,a=t.offsetHeight;return Math.abs(e.width-n)<=1&&(n=e.width),Math.abs(e.height-a)<=1&&(a=e.height),{x:t.offsetLeft,y:t.offsetTop,width:n,height:a}}function aa(t,e){var n=e.getRootNode&&e.getRootNode();if(t.contains(e))return!0;if(n&&Ue(n)){var a=e;do{if(a&&t.isSameNode(a))return!0;a=a.parentNode||a.host}while(a)}return!1}function Q(t){return j(t).getComputedStyle(t)}function ur(t){return["table","td","th"].indexOf(q(t))>=0}function st(t){return((ht(t)?t.ownerDocument:t.document)||window.document).documentElement}function ce(t){return q(t)==="html"?t:t.assignedSlot||t.parentNode||(Ue(t)?t.host:null)||st(t)}function bn(t){return!W(t)||Q(t).position==="fixed"?null:t.offsetParent}function pr(t){var e=/firefox/i.test(Ae()),n=/Trident/i.test(Ae());if(n&&W(t)){var a=Q(t);if(a.position==="fixed")return null}var r=ce(t);for(Ue(r)&&(r=r.host);W(r)&&["html","body"].indexOf(q(r))<0;){var i=Q(r);if(i.transform!=="none"||i.perspective!=="none"||i.contain==="paint"||["transform","perspective"].indexOf(i.willChange)!==-1||e&&i.willChange==="filter"||e&&i.filter&&i.filter!=="none")return r;r=r.parentNode}return null}function Ht(t){for(var e=j(t),n=bn(t);n&&ur(n)&&Q(n).position==="static";)n=bn(n);return n&&(q(n)==="html"||q(n)==="body"&&Q(n).position==="static")?e:n||pr(t)||e}function He(t){return["top","bottom"].indexOf(t)>=0?"x":"y"}function Rt(t,e,n){return dt(t,re(e,n))}function mr(t,e,n){var a=Rt(t,e,n);return a>n?n:a}function ra(){return{top:0,right:0,bottom:0,left:0}}function ia(t){return Object.assign({},ra(),t)}function oa(t,e){return e.reduce(function(n,a){return n[a]=t,n},{})}var dr=function(e,n){return e=typeof e=="function"?e(Object.assign({},n.rects,{placement:n.placement})):e,ia(typeof e!="number"?e:oa(e,Yt))};function vr(t){var e,n=t.state,a=t.name,r=t.options,i=n.elements.arrow,s=n.modifiersData.popperOffsets,o=G(n.placement),c=He(o),l=[I,$].indexOf(o)>=0,f=l?"height":"width";if(!(!i||!s)){var m=dr(r.padding,n),p=Ye(i),d=c==="y"?T:I,w=c==="y"?B:$,h=n.rects.reference[f]+n.rects.reference[c]-s[c]-n.rects.popper[f],v=s[c]-n.rects.reference[c],b=Ht(i),y=b?c==="y"?b.clientHeight||0:b.clientWidth||0:0,O=h/2-v/2,g=m[d],x=y-p[f]-m[w],C=y/2-p[f]/2+O,L=Rt(g,C,x),P=c;n.modifiersData[a]=(e={},e[P]=L,e.centerOffset=L-C,e)}}function gr(t){var e=t.state,n=t.options,a=n.element,r=a===void 0?"[data-popper-arrow]":a;r!=null&&(typeof r=="string"&&(r=e.elements.popper.querySelector(r),!r)||aa(e.elements.popper,r)&&(e.elements.arrow=r))}const hr={name:"arrow",enabled:!0,phase:"main",fn:vr,effect:gr,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function Mt(t){return t.split("-")[1]}var br={top:"auto",right:"auto",bottom:"auto",left:"auto"};function yr(t,e){var n=t.x,a=t.y,r=e.devicePixelRatio||1;return{x:Lt(n*r)/r||0,y:Lt(a*r)/r||0}}function yn(t){var e,n=t.popper,a=t.popperRect,r=t.placement,i=t.variation,s=t.offsets,o=t.position,c=t.gpuAcceleration,l=t.adaptive,f=t.roundOffsets,m=t.isFixed,p=s.x,d=p===void 0?0:p,w=s.y,h=w===void 0?0:w,v=typeof f=="function"?f({x:d,y:h}):{x:d,y:h};d=v.x,h=v.y;var b=s.hasOwnProperty("x"),y=s.hasOwnProperty("y"),O=I,g=T,x=window;if(l){var C=Ht(n),L="clientHeight",P="clientWidth";if(C===j(n)&&(C=st(n),Q(C).position!=="static"&&o==="absolute"&&(L="scrollHeight",P="scrollWidth")),C=C,r===T||(r===I||r===$)&&i===Wt){g=B;var z=m&&C===x&&x.visualViewport?x.visualViewport.height:C[L];h-=z-a.height,h*=c?1:-1}if(r===I||(r===T||r===B)&&i===Wt){O=$;var E=m&&C===x&&x.visualViewport?x.visualViewport.width:C[P];d-=E-a.width,d*=c?1:-1}}var N=Object.assign({position:o},l&&br),U=f===!0?yr({x:d,y:h},j(n)):{x:d,y:h};if(d=U.x,h=U.y,c){var S;return Object.assign({},N,(S={},S[g]=y?"0":"",S[O]=b?"0":"",S.transform=(x.devicePixelRatio||1)<=1?"translate("+d+"px, "+h+"px)":"translate3d("+d+"px, "+h+"px, 0)",S))}return Object.assign({},N,(e={},e[g]=y?h+"px":"",e[O]=b?d+"px":"",e.transform="",e))}function xr(t){var e=t.state,n=t.options,a=n.gpuAcceleration,r=a===void 0?!0:a,i=n.adaptive,s=i===void 0?!0:i,o=n.roundOffsets,c=o===void 0?!0:o,l={placement:G(e.placement),variation:Mt(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:r,isFixed:e.options.strategy==="fixed"};e.modifiersData.popperOffsets!=null&&(e.styles.popper=Object.assign({},e.styles.popper,yn(Object.assign({},l,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:s,roundOffsets:c})))),e.modifiersData.arrow!=null&&(e.styles.arrow=Object.assign({},e.styles.arrow,yn(Object.assign({},l,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:c})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement})}const wr={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:xr,data:{}};var Jt={passive:!0};function Or(t){var e=t.state,n=t.instance,a=t.options,r=a.scroll,i=r===void 0?!0:r,s=a.resize,o=s===void 0?!0:s,c=j(e.elements.popper),l=[].concat(e.scrollParents.reference,e.scrollParents.popper);return i&&l.forEach(function(f){f.addEventListener("scroll",n.update,Jt)}),o&&c.addEventListener("resize",n.update,Jt),function(){i&&l.forEach(function(f){f.removeEventListener("scroll",n.update,Jt)}),o&&c.removeEventListener("resize",n.update,Jt)}}const Ar={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:Or,data:{}};var Cr={left:"right",right:"left",bottom:"top",top:"bottom"};function ee(t){return t.replace(/left|right|bottom|top/g,function(e){return Cr[e]})}var Lr={start:"end",end:"start"};function xn(t){return t.replace(/start|end/g,function(e){return Lr[e]})}function Xe(t){var e=j(t),n=e.pageXOffset,a=e.pageYOffset;return{scrollLeft:n,scrollTop:a}}function Ve(t){return kt(st(t)).left+Xe(t).scrollLeft}function kr(t,e){var n=j(t),a=st(t),r=n.visualViewport,i=a.clientWidth,s=a.clientHeight,o=0,c=0;if(r){i=r.width,s=r.height;var l=na();(l||!l&&e==="fixed")&&(o=r.offsetLeft,c=r.offsetTop)}return{width:i,height:s,x:o+Ve(t),y:c}}function Mr(t){var e,n=st(t),a=Xe(t),r=(e=t.ownerDocument)==null?void 0:e.body,i=dt(n.scrollWidth,n.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),s=dt(n.scrollHeight,n.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0),o=-a.scrollLeft+Ve(t),c=-a.scrollTop;return Q(r||n).direction==="rtl"&&(o+=dt(n.clientWidth,r?r.clientWidth:0)-i),{width:i,height:s,x:o,y:c}}function Ge(t){var e=Q(t),n=e.overflow,a=e.overflowX,r=e.overflowY;return/auto|scroll|overlay|hidden/.test(n+r+a)}function sa(t){return["html","body","#document"].indexOf(q(t))>=0?t.ownerDocument.body:W(t)&&Ge(t)?t:sa(ce(t))}function Dt(t,e){var n;e===void 0&&(e=[]);var a=sa(t),r=a===((n=t.ownerDocument)==null?void 0:n.body),i=j(a),s=r?[i].concat(i.visualViewport||[],Ge(a)?a:[]):a,o=e.concat(s);return r?o:o.concat(Dt(ce(s)))}function Ce(t){return Object.assign({},t,{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}function Pr(t,e){var n=kt(t,!1,e==="fixed");return n.top=n.top+t.clientTop,n.left=n.left+t.clientLeft,n.bottom=n.top+t.clientHeight,n.right=n.left+t.clientWidth,n.width=t.clientWidth,n.height=t.clientHeight,n.x=n.left,n.y=n.top,n}function wn(t,e,n){return e===ta?Ce(kr(t,n)):ht(e)?Pr(e,n):Ce(Mr(st(t)))}function Er(t){var e=Dt(ce(t)),n=["absolute","fixed"].indexOf(Q(t).position)>=0,a=n&&W(t)?Ht(t):t;return ht(a)?e.filter(function(r){return ht(r)&&aa(r,a)&&q(r)!=="body"}):[]}function zr(t,e,n,a){var r=e==="clippingParents"?Er(t):[].concat(e),i=[].concat(r,[n]),s=i[0],o=i.reduce(function(c,l){var f=wn(t,l,a);return c.top=dt(f.top,c.top),c.right=re(f.right,c.right),c.bottom=re(f.bottom,c.bottom),c.left=dt(f.left,c.left),c},wn(t,s,a));return o.width=o.right-o.left,o.height=o.bottom-o.top,o.x=o.left,o.y=o.top,o}function ca(t){var e=t.reference,n=t.element,a=t.placement,r=a?G(a):null,i=a?Mt(a):null,s=e.x+e.width/2-n.width/2,o=e.y+e.height/2-n.height/2,c;switch(r){case T:c={x:s,y:e.y-n.height};break;case B:c={x:s,y:e.y+e.height};break;case $:c={x:e.x+e.width,y:o};break;case I:c={x:e.x-n.width,y:o};break;default:c={x:e.x,y:e.y}}var l=r?He(r):null;if(l!=null){var f=l==="y"?"height":"width";switch(i){case Ct:c[l]=c[l]-(e[f]/2-n[f]/2);break;case Wt:c[l]=c[l]+(e[f]/2-n[f]/2);break}}return c}function Bt(t,e){e===void 0&&(e={});var n=e,a=n.placement,r=a===void 0?t.placement:a,i=n.strategy,s=i===void 0?t.strategy:i,o=n.boundary,c=o===void 0?Ka:o,l=n.rootBoundary,f=l===void 0?ta:l,m=n.elementContext,p=m===void 0?Tt:m,d=n.altBoundary,w=d===void 0?!1:d,h=n.padding,v=h===void 0?0:h,b=ia(typeof v!="number"?v:oa(v,Yt)),y=p===Tt?Qa:Tt,O=t.rects.popper,g=t.elements[w?y:p],x=zr(ht(g)?g:g.contextElement||st(t.elements.popper),c,f,s),C=kt(t.elements.reference),L=ca({reference:C,element:O,strategy:"absolute",placement:r}),P=Ce(Object.assign({},O,L)),z=p===Tt?P:C,E={top:x.top-z.top+b.top,bottom:z.bottom-x.bottom+b.bottom,left:x.left-z.left+b.left,right:z.right-x.right+b.right},N=t.modifiersData.offset;if(p===Tt&&N){var U=N[r];Object.keys(E).forEach(function(S){var ct=[$,B].indexOf(S)>=0?1:-1,lt=[T,B].indexOf(S)>=0?"y":"x";E[S]+=U[lt]*ct})}return E}function Nr(t,e){e===void 0&&(e={});var n=e,a=n.placement,r=n.boundary,i=n.rootBoundary,s=n.padding,o=n.flipVariations,c=n.allowedAutoPlacements,l=c===void 0?ea:c,f=Mt(a),m=f?o?hn:hn.filter(function(w){return Mt(w)===f}):Yt,p=m.filter(function(w){return l.indexOf(w)>=0});p.length===0&&(p=m);var d=p.reduce(function(w,h){return w[h]=Bt(t,{placement:h,boundary:r,rootBoundary:i,padding:s})[G(h)],w},{});return Object.keys(d).sort(function(w,h){return d[w]-d[h]})}function Sr(t){if(G(t)===$e)return[];var e=ee(t);return[xn(t),e,xn(e)]}function Tr(t){var e=t.state,n=t.options,a=t.name;if(!e.modifiersData[a]._skip){for(var r=n.mainAxis,i=r===void 0?!0:r,s=n.altAxis,o=s===void 0?!0:s,c=n.fallbackPlacements,l=n.padding,f=n.boundary,m=n.rootBoundary,p=n.altBoundary,d=n.flipVariations,w=d===void 0?!0:d,h=n.allowedAutoPlacements,v=e.options.placement,b=G(v),y=b===v,O=c||(y||!w?[ee(v)]:Sr(v)),g=[v].concat(O).reduce(function(xt,et){return xt.concat(G(et)===$e?Nr(e,{placement:et,boundary:f,rootBoundary:m,padding:l,flipVariations:w,allowedAutoPlacements:h}):et)},[]),x=e.rects.reference,C=e.rects.popper,L=new Map,P=!0,z=g[0],E=0;E<g.length;E++){var N=g[E],U=G(N),S=Mt(N)===Ct,ct=[T,B].indexOf(U)>=0,lt=ct?"width":"height",F=Bt(e,{placement:N,boundary:f,rootBoundary:m,altBoundary:p,padding:l}),Y=ct?S?$:I:S?B:T;x[lt]>C[lt]&&(Y=ee(Y));var Gt=ee(Y),ft=[];if(i&&ft.push(F[U]<=0),o&&ft.push(F[Y]<=0,F[Gt]<=0),ft.every(function(xt){return xt})){z=N,P=!1;break}L.set(N,ft)}if(P)for(var qt=w?3:1,me=function(et){var St=g.find(function(Qt){var ut=L.get(Qt);if(ut)return ut.slice(0,et).every(function(de){return de})});if(St)return z=St,"break"},Nt=qt;Nt>0;Nt--){var Kt=me(Nt);if(Kt==="break")break}e.placement!==z&&(e.modifiersData[a]._skip=!0,e.placement=z,e.reset=!0)}}const Ir={name:"flip",enabled:!0,phase:"main",fn:Tr,requiresIfExists:["offset"],data:{_skip:!1}};function On(t,e,n){return n===void 0&&(n={x:0,y:0}),{top:t.top-e.height-n.y,right:t.right-e.width+n.x,bottom:t.bottom-e.height+n.y,left:t.left-e.width-n.x}}function An(t){return[T,$,B,I].some(function(e){return t[e]>=0})}function Fr(t){var e=t.state,n=t.name,a=e.rects.reference,r=e.rects.popper,i=e.modifiersData.preventOverflow,s=Bt(e,{elementContext:"reference"}),o=Bt(e,{altBoundary:!0}),c=On(s,a),l=On(o,r,i),f=An(c),m=An(l);e.modifiersData[n]={referenceClippingOffsets:c,popperEscapeOffsets:l,isReferenceHidden:f,hasPopperEscaped:m},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":f,"data-popper-escaped":m})}const Rr={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:Fr};function Dr(t,e,n){var a=G(t),r=[I,T].indexOf(a)>=0?-1:1,i=typeof n=="function"?n(Object.assign({},e,{placement:t})):n,s=i[0],o=i[1];return s=s||0,o=(o||0)*r,[I,$].indexOf(a)>=0?{x:o,y:s}:{x:s,y:o}}function jr(t){var e=t.state,n=t.options,a=t.name,r=n.offset,i=r===void 0?[0,0]:r,s=ea.reduce(function(f,m){return f[m]=Dr(m,e.rects,i),f},{}),o=s[e.placement],c=o.x,l=o.y;e.modifiersData.popperOffsets!=null&&(e.modifiersData.popperOffsets.x+=c,e.modifiersData.popperOffsets.y+=l),e.modifiersData[a]=s}const _r={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:jr};function Wr(t){var e=t.state,n=t.name;e.modifiersData[n]=ca({reference:e.rects.reference,element:e.rects.popper,strategy:"absolute",placement:e.placement})}const Br={name:"popperOffsets",enabled:!0,phase:"read",fn:Wr,data:{}};function $r(t){return t==="x"?"y":"x"}function Ur(t){var e=t.state,n=t.options,a=t.name,r=n.mainAxis,i=r===void 0?!0:r,s=n.altAxis,o=s===void 0?!1:s,c=n.boundary,l=n.rootBoundary,f=n.altBoundary,m=n.padding,p=n.tether,d=p===void 0?!0:p,w=n.tetherOffset,h=w===void 0?0:w,v=Bt(e,{boundary:c,rootBoundary:l,padding:m,altBoundary:f}),b=G(e.placement),y=Mt(e.placement),O=!y,g=He(b),x=$r(g),C=e.modifiersData.popperOffsets,L=e.rects.reference,P=e.rects.popper,z=typeof h=="function"?h(Object.assign({},e.rects,{placement:e.placement})):h,E=typeof z=="number"?{mainAxis:z,altAxis:z}:Object.assign({mainAxis:0,altAxis:0},z),N=e.modifiersData.offset?e.modifiersData.offset[e.placement]:null,U={x:0,y:0};if(C){if(i){var S,ct=g==="y"?T:I,lt=g==="y"?B:$,F=g==="y"?"height":"width",Y=C[g],Gt=Y+v[ct],ft=Y-v[lt],qt=d?-P[F]/2:0,me=y===Ct?L[F]:P[F],Nt=y===Ct?-P[F]:-L[F],Kt=e.elements.arrow,xt=d&&Kt?Ye(Kt):{width:0,height:0},et=e.modifiersData["arrow#persistent"]?e.modifiersData["arrow#persistent"].padding:ra(),St=et[ct],Qt=et[lt],ut=Rt(0,L[F],xt[F]),de=O?L[F]/2-qt-ut-St-E.mainAxis:me-ut-St-E.mainAxis,Ya=O?-L[F]/2+qt+ut+Qt+E.mainAxis:Nt+ut+Qt+E.mainAxis,ve=e.elements.arrow&&Ht(e.elements.arrow),Ha=ve?g==="y"?ve.clientTop||0:ve.clientLeft||0:0,sn=(S=N==null?void 0:N[g])!=null?S:0,Xa=Y+de-sn-Ha,Va=Y+Ya-sn,cn=Rt(d?re(Gt,Xa):Gt,Y,d?dt(ft,Va):ft);C[g]=cn,U[g]=cn-Y}if(o){var ln,Ga=g==="x"?T:I,qa=g==="x"?B:$,pt=C[x],Zt=x==="y"?"height":"width",fn=pt+v[Ga],un=pt-v[qa],ge=[T,I].indexOf(b)!==-1,pn=(ln=N==null?void 0:N[x])!=null?ln:0,mn=ge?fn:pt-L[Zt]-P[Zt]-pn+E.altAxis,dn=ge?pt+L[Zt]+P[Zt]-pn-E.altAxis:un,vn=d&&ge?mr(mn,pt,dn):Rt(d?mn:fn,pt,d?dn:un);C[x]=vn,U[x]=vn-pt}e.modifiersData[a]=U}}const Yr={name:"preventOverflow",enabled:!0,phase:"main",fn:Ur,requiresIfExists:["offset"]};function Hr(t){return{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}}function Xr(t){return t===j(t)||!W(t)?Xe(t):Hr(t)}function Vr(t){var e=t.getBoundingClientRect(),n=Lt(e.width)/t.offsetWidth||1,a=Lt(e.height)/t.offsetHeight||1;return n!==1||a!==1}function Gr(t,e,n){n===void 0&&(n=!1);var a=W(e),r=W(e)&&Vr(e),i=st(e),s=kt(t,r,n),o={scrollLeft:0,scrollTop:0},c={x:0,y:0};return(a||!a&&!n)&&((q(e)!=="body"||Ge(i))&&(o=Xr(e)),W(e)?(c=kt(e,!0),c.x+=e.clientLeft,c.y+=e.clientTop):i&&(c.x=Ve(i))),{x:s.left+o.scrollLeft-c.x,y:s.top+o.scrollTop-c.y,width:s.width,height:s.height}}function qr(t){var e=new Map,n=new Set,a=[];t.forEach(function(i){e.set(i.name,i)});function r(i){n.add(i.name);var s=[].concat(i.requires||[],i.requiresIfExists||[]);s.forEach(function(o){if(!n.has(o)){var c=e.get(o);c&&r(c)}}),a.push(i)}return t.forEach(function(i){n.has(i.name)||r(i)}),a}function Kr(t){var e=qr(t);return sr.reduce(function(n,a){return n.concat(e.filter(function(r){return r.phase===a}))},[])}function Qr(t){var e;return function(){return e||(e=new Promise(function(n){Promise.resolve().then(function(){e=void 0,n(t())})})),e}}function Zr(t){var e=t.reduce(function(n,a){var r=n[a.name];return n[a.name]=r?Object.assign({},r,a,{options:Object.assign({},r.options,a.options),data:Object.assign({},r.data,a.data)}):a,n},{});return Object.keys(e).map(function(n){return e[n]})}var Cn={placement:"bottom",modifiers:[],strategy:"absolute"};function Ln(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return!e.some(function(a){return!(a&&typeof a.getBoundingClientRect=="function")})}function Jr(t){t===void 0&&(t={});var e=t,n=e.defaultModifiers,a=n===void 0?[]:n,r=e.defaultOptions,i=r===void 0?Cn:r;return function(o,c,l){l===void 0&&(l=i);var f={placement:"bottom",orderedModifiers:[],options:Object.assign({},Cn,i),modifiersData:{},elements:{reference:o,popper:c},attributes:{},styles:{}},m=[],p=!1,d={state:f,setOptions:function(b){var y=typeof b=="function"?b(f.options):b;h(),f.options=Object.assign({},i,f.options,y),f.scrollParents={reference:ht(o)?Dt(o):o.contextElement?Dt(o.contextElement):[],popper:Dt(c)};var O=Kr(Zr([].concat(a,f.options.modifiers)));return f.orderedModifiers=O.filter(function(g){return g.enabled}),w(),d.update()},forceUpdate:function(){if(!p){var b=f.elements,y=b.reference,O=b.popper;if(Ln(y,O)){f.rects={reference:Gr(y,Ht(O),f.options.strategy==="fixed"),popper:Ye(O)},f.reset=!1,f.placement=f.options.placement,f.orderedModifiers.forEach(function(E){return f.modifiersData[E.name]=Object.assign({},E.data)});for(var g=0;g<f.orderedModifiers.length;g++){if(f.reset===!0){f.reset=!1,g=-1;continue}var x=f.orderedModifiers[g],C=x.fn,L=x.options,P=L===void 0?{}:L,z=x.name;typeof C=="function"&&(f=C({state:f,options:P,name:z,instance:d})||f)}}}},update:Qr(function(){return new Promise(function(v){d.forceUpdate(),v(f)})}),destroy:function(){h(),p=!0}};if(!Ln(o,c))return d;d.setOptions(l).then(function(v){!p&&l.onFirstUpdate&&l.onFirstUpdate(v)});function w(){f.orderedModifiers.forEach(function(v){var b=v.name,y=v.options,O=y===void 0?{}:y,g=v.effect;if(typeof g=="function"){var x=g({state:f,name:b,instance:d,options:O}),C=function(){};m.push(x||C)}})}function h(){m.forEach(function(v){return v()}),m=[]}return d}}var ti=[Ar,Br,wr,fr,_r,Ir,Yr,hr,Rr],ei=Jr({defaultModifiers:ti}),ps=function(){var t=gn.useRef(),e=gn.useRef(),n=function(i,s,o){t.current=ei(i,s,o),e.current=s},a=function(){var i=t.current;i&&e.current&&i.destroy(),t.current=void 0},r=function(i){var s=t.current;s&&i&&s.setOptions(i),s&&s.update()};return{popper:t.current,initPopper:n,destroyPopper:a,updatePopper:r}},ms=function(t){return typeof document<"u"&&document.documentElement.dir==="rtl"?!0:t?t.closest('[dir="rtl"]')!==null:!1};const ds={prefix:"fas",iconName:"at",icon:[512,512,[61946],"40","M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256l0 32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32l0 80 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"]},ni={prefix:"fas",iconName:"file-lines",icon:[384,512,[128441,128462,61686,"file-alt","file-text"],"f15c","M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"]},vs=ni,gs={prefix:"fas",iconName:"pencil",icon:[512,512,[9999,61504,"pencil-alt"],"f303","M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"]},hs={prefix:"fas",iconName:"clipboard-list",icon:[384,512,[],"f46d","M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z"]},bs={prefix:"fas",iconName:"file-circle-question",icon:[576,512,[],"e4ef","M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm0 240a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM368 321.6l0 6.4c0 8.8 7.2 16 16 16s16-7.2 16-16l0-6.4c0-5.3 4.3-9.6 9.6-9.6l40.5 0c7.7 0 13.9 6.2 13.9 13.9c0 5.2-2.9 9.9-7.4 12.3l-32 16.8c-5.3 2.8-8.6 8.2-8.6 14.2l0 14.8c0 8.8 7.2 16 16 16s16-7.2 16-16l0-5.1 23.5-12.3c15.1-7.9 24.5-23.6 24.5-40.6c0-25.4-20.6-45.9-45.9-45.9l-40.5 0c-23 0-41.6 18.6-41.6 41.6z"]},ys={prefix:"fas",iconName:"bars",icon:[448,512,["navicon"],"f0c9","M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"]},ai={prefix:"fas",iconName:"arrow-right-from-bracket",icon:[512,512,["sign-out"],"f08b","M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"]},xs=ai,ws={prefix:"fas",iconName:"lock",icon:[448,512,[128274],"f023","M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"]},Os={prefix:"fas",iconName:"eye-slash",icon:[640,512,[],"f070","M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"]},As={prefix:"fas",iconName:"chevron-up",icon:[512,512,[],"f077","M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"]},Cs={prefix:"fas",iconName:"money-bill",icon:[576,512,[],"f0d6","M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"]},ri={prefix:"fas",iconName:"gauge",icon:[512,512,["dashboard","gauge-med","tachometer-alt-average"],"f624","M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-26.9-16.5-49.9-40-59.3L280 88c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 204.7c-23.5 9.5-40 32.5-40 59.3c0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},Ls=ri,ks={prefix:"fas",iconName:"pen-clip",icon:[512,512,["pen-alt"],"f305","M453.3 19.3l39.4 39.4c25 25 25 65.5 0 90.5l-52.1 52.1s0 0 0 0l-1-1s0 0 0 0l-16-16-96-96-17-17 52.1-52.1c25-25 65.5-25 90.5 0zM241 114.9c-9.4-9.4-24.6-9.4-33.9 0L105 217c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L173.1 81c28.1-28.1 73.7-28.1 101.8 0L288 94.1l17 17 96 96 16 16 1 1-17 17L229.5 412.5c-48 48-109.2 80.8-175.8 94.1l-25 5c-7.9 1.6-16-.9-21.7-6.6s-8.1-13.8-6.6-21.7l5-25c13.3-66.6 46.1-127.8 94.1-175.8L254.1 128 241 114.9z"]},Ms={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"]},Ps={prefix:"fas",iconName:"star",icon:[576,512,[11088,61446],"f005","M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"]},Es={prefix:"fas",iconName:"unlock",icon:[448,512,[128275],"f09c","M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48-16 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-240 0 0-48z"]},zs={prefix:"fas",iconName:"clipboard",icon:[384,512,[128203],"f328","M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"]},ii={prefix:"fas",iconName:"compass-drafting",icon:[512,512,["drafting-compass"],"f568","M352 96c0 14.3-3.1 27.9-8.8 40.2L396 227.4c-23.7 25.3-54.2 44.1-88.5 53.6L256 192c0 0 0 0 0 0s0 0 0 0l-68 117.5c21.5 6.8 44.3 10.5 68.1 10.5c70.7 0 133.8-32.7 174.9-84c11.1-13.8 31.2-16 45-5s16 31.2 5 45C428.1 341.8 347 384 256 384c-35.4 0-69.4-6.4-100.7-18.1L98.7 463.7C94 471.8 87 478.4 78.6 482.6L23.2 510.3c-5 2.5-10.9 2.2-15.6-.7S0 501.5 0 496l0-55.4c0-8.4 2.2-16.7 6.5-24.1l60-103.7C53.7 301.6 41.8 289.3 31.2 276c-11.1-13.8-8.8-33.9 5-45s33.9-8.8 45 5c5.7 7.1 11.8 13.8 18.2 20.1l69.4-119.9c-5.6-12.2-8.8-25.8-8.8-40.2c0-53 43-96 96-96s96 43 96 96zm21 297.9c32.6-12.8 62.5-30.8 88.9-52.9l43.7 75.5c4.2 7.3 6.5 15.6 6.5 24.1l0 55.4c0 5.5-2.9 10.7-7.6 13.6s-10.6 3.2-15.6 .7l-55.4-27.7c-8.4-4.2-15.4-10.8-20.1-18.9L373 393.9zM256 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]},Ns=ii,oi={prefix:"fas",iconName:"arrows-rotate",icon:[512,512,[128472,"refresh","sync"],"f021","M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"]},Ss=oi,si={prefix:"fas",iconName:"file-zipper",icon:[384,512,["file-archive"],"f1c6","M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM96 48c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8l14.8 0c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4c0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5 .7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0z"]},Ts=si,Is={prefix:"fas",iconName:"code",icon:[640,512,[],"f121","M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"]},Fs={prefix:"fas",iconName:"location-pin",icon:[384,512,["map-marker"],"f041","M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"]},Rs={prefix:"fas",iconName:"clipboard-check",icon:[384,512,[],"f46c","M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM305 273L177 401c-9.4 9.4-24.6 9.4-33.9 0L79 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L271 239c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"]},Ds={prefix:"fas",iconName:"clipboard-question",icon:[384,512,[],"e4e3","M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM105.8 229.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L216 328.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM160 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]},js={prefix:"fas",iconName:"eye",icon:[576,512,[128065],"f06e","M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"]},_s={prefix:"fas",iconName:"user-gear",icon:[640,512,["user-cog"],"f4fe","M224 0a128 128 0 1 1 0 256A128 128 0 1 1 224 0zM178.3 304l91.4 0c11.8 0 23.4 1.2 34.5 3.3c-2.1 18.5 7.4 35.6 21.8 44.8c-16.6 10.6-26.7 31.6-20 53.3c4 12.9 9.4 25.5 16.4 37.6s15.2 23.1 24.4 33c15.7 16.9 39.6 18.4 57.2 8.7l0 .9c0 9.2 2.7 18.5 7.9 26.3L29.7 512C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304zM436 218.2c0-7 4.5-13.3 11.3-14.8c10.5-2.4 21.5-3.7 32.7-3.7s22.2 1.3 32.7 3.7c6.8 1.5 11.3 7.8 11.3 14.8l0 30.6c7.9 3.4 15.4 7.7 22.3 12.8l24.9-14.3c6.1-3.5 13.7-2.7 18.5 2.4c7.6 8.1 14.3 17.2 20.1 27.2s10.3 20.4 13.5 31c2.1 6.7-1.1 13.7-7.2 17.2l-25 14.4c.4 4 .7 8.1 .7 12.3s-.2 8.2-.7 12.3l25 14.4c6.1 3.5 9.2 10.5 7.2 17.2c-3.3 10.6-7.8 21-13.5 31s-12.5 19.1-20.1 27.2c-4.8 5.1-12.5 5.9-18.5 2.4l-24.9-14.3c-6.9 5.1-14.3 9.4-22.3 12.8l0 30.6c0 7-4.5 13.3-11.3 14.8c-10.5 2.4-21.5 3.7-32.7 3.7s-22.2-1.3-32.7-3.7c-6.8-1.5-11.3-7.8-11.3-14.8l0-30.5c-8-3.4-15.6-7.7-22.5-12.9l-24.7 14.3c-6.1 3.5-13.7 2.7-18.5-2.4c-7.6-8.1-14.3-17.2-20.1-27.2s-10.3-20.4-13.5-31c-2.1-6.7 1.1-13.7 7.2-17.2l24.8-14.3c-.4-4.1-.7-8.2-.7-12.4s.2-8.3 .7-12.4L343.8 325c-6.1-3.5-9.2-10.5-7.2-17.2c3.3-10.6 7.7-21 13.5-31s12.5-19.1 20.1-27.2c4.8-5.1 12.4-5.9 18.5-2.4l24.8 14.3c6.9-5.1 14.5-9.4 22.5-12.9l0-30.5zm92.1 133.5a48.1 48.1 0 1 0 -96.1 0 48.1 48.1 0 1 0 96.1 0z"]},Ws={prefix:"fas",iconName:"trash",icon:[448,512,[],"f1f8","M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"]},Bs={prefix:"fas",iconName:"calendar-plus",icon:[448,512,[],"f271","M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272zM224 248c13.3 0 24 10.7 24 24l0 56 56 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-56 0 0 56c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-56-56 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l56 0 0-56c0-13.3 10.7-24 24-24z"]},$s={prefix:"fas",iconName:"minus",icon:[448,512,[8211,8722,10134,"subtract"],"f068","M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"]},Us={prefix:"fas",iconName:"gear",icon:[512,512,[9881,"cog"],"f013","M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"]},ci={prefix:"fas",iconName:"clock",icon:[512,512,[128339,"clock-four"],"f017","M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"]},Ys=ci,Hs={prefix:"fas",iconName:"file-circle-check",icon:[576,512,[],"e5a0","M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM288 368a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm211.3-43.3c-6.2-6.2-16.4-6.2-22.6 0L416 385.4l-28.7-28.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0l72-72c6.2-6.2 6.2-16.4 0-22.6z"]},Xs={prefix:"fas",iconName:"sun",icon:[512,512,[9728],"f185","M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"]},Vs={prefix:"fas",iconName:"bell",icon:[448,512,[128276,61602],"f0f3","M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"]},Gs={prefix:"fas",iconName:"inbox",icon:[512,512,[],"f01c","M121 32C91.6 32 66 52 58.9 80.5L1.9 308.4C.6 313.5 0 318.7 0 323.9L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-92.1c0-5.2-.6-10.4-1.9-15.5l-57-227.9C446 52 420.4 32 391 32L121 32zm0 64l270 0 48 192-51.2 0c-12.1 0-23.2 6.8-28.6 17.7l-14.3 28.6c-5.4 10.8-16.5 17.7-28.6 17.7l-120.4 0c-12.1 0-23.2-6.8-28.6-17.7l-14.3-28.6c-5.4-10.8-16.5-17.7-28.6-17.7L73 288 121 96z"]},li={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},qs=li,Ks={prefix:"fas",iconName:"chevron-down",icon:[512,512,[],"f078","M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]},Qs={prefix:"fas",iconName:"circle-half-stroke",icon:[512,512,[9680,"adjust"],"f042","M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"]},Zs={prefix:"fas",iconName:"plus",icon:[448,512,[10133,61543,"add"],"2b","M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"]},Js={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"]},t1={prefix:"fas",iconName:"chevron-left",icon:[320,512,[9001],"f053","M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"]},e1={prefix:"fas",iconName:"chevron-right",icon:[320,512,[9002],"f054","M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"]},fi={prefix:"fas",iconName:"gears",icon:[640,512,["cogs"],"f085","M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"]},n1=fi,a1={prefix:"fas",iconName:"moon",icon:[384,512,[127769,9214],"f186","M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"]},r1={prefix:"fas",iconName:"calendar",icon:[448,512,[128197,128198],"f133","M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272z"]},i1={prefix:"fas",iconName:"file-circle-plus",icon:[576,512,[58606],"e494","M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z"]},o1={prefix:"fas",iconName:"check",icon:[448,512,[10003,10004],"f00c","M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"]},s1={prefix:"fas",iconName:"paper-plane",icon:[512,512,[61913],"f1d8","M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"]},c1={prefix:"fas",iconName:"user-clock",icon:[640,512,[],"f4fd","M224 0a128 128 0 1 1 0 256A128 128 0 1 1 224 0zM178.3 304l91.4 0c20.6 0 40.4 3.5 58.8 9.9C323 331 320 349.1 320 368c0 59.5 29.5 112.1 74.8 144L29.7 512C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304zM352 368a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-80c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0 0-48c0-8.8-7.2-16-16-16z"]},l1={prefix:"fas",iconName:"print",icon:[512,512,[128424,128438,9113],"f02f","M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"]},f1={prefix:"fas",iconName:"x",icon:[384,512,[120],"58","M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"]},kn=()=>{};let qe={},la={},fa=null,ua={mark:kn,measure:kn};try{typeof window<"u"&&(qe=window),typeof document<"u"&&(la=document),typeof MutationObserver<"u"&&(fa=MutationObserver),typeof performance<"u"&&(ua=performance)}catch{}const{userAgent:Mn=""}=qe.navigator||{},rt=qe,k=la,Pn=fa,te=ua;rt.document;const tt=!!k.documentElement&&!!k.head&&typeof k.addEventListener=="function"&&typeof k.createElement=="function",pa=~Mn.indexOf("MSIE")||~Mn.indexOf("Trident/");var M="classic",ma="duotone",R="sharp",D="sharp-duotone",ui=[M,ma,R,D],pi={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},En={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},mi=["kit"],di=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,vi=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,gi={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},hi={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},bi={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},yi={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},xi={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},wi={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},da={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},Oi=["solid","regular","light","thin","duotone","brands"],va=[1,2,3,4,5,6,7,8,9,10],Ai=va.concat([11,12,13,14,15,16,17,18,19,20]),It={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Ci=[...Object.keys(yi),...Oi,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",It.GROUP,It.SWAP_OPACITY,It.PRIMARY,It.SECONDARY].concat(va.map(t=>"".concat(t,"x"))).concat(Ai.map(t=>"w-".concat(t))),Li={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},ki={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},Mi={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},zn={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}};const Z="___FONT_AWESOME___",Le=16,ga="fa",ha="svg-inline--fa",bt="data-fa-i2svg",ke="data-fa-pseudo-element",Pi="data-fa-pseudo-element-pending",Ke="data-prefix",Qe="data-icon",Nn="fontawesome-i2svg",Ei="async",zi=["HTML","HEAD","STYLE","SCRIPT"],ba=(()=>{try{return!0}catch{return!1}})(),ya=[M,R,D];function Xt(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[M]}})}const xa={...da};xa[M]={...da[M],...En.kit,...En["kit-duotone"]};const vt=Xt(xa),Me={...wi};Me[M]={...Me[M],...zn.kit,...zn["kit-duotone"]};const $t=Xt(Me),Pe={...xi};Pe[M]={...Pe[M],...Mi.kit};const gt=Xt(Pe),Ee={...bi};Ee[M]={...Ee[M],...ki.kit};const Ni=Xt(Ee),Si=di,wa="fa-layers-text",Ti=vi,Ii={...pi};Xt(Ii);const Fi=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],he=It,Pt=new Set;Object.keys($t[M]).map(Pt.add.bind(Pt));Object.keys($t[R]).map(Pt.add.bind(Pt));Object.keys($t[D]).map(Pt.add.bind(Pt));const Ri=[...mi,...Ci],jt=rt.FontAwesomeConfig||{};function Di(t){var e=k.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function ji(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}k&&typeof k.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,a]=e;const r=ji(Di(n));r!=null&&(jt[a]=r)});const Oa={styleDefault:"solid",familyDefault:"classic",cssPrefix:ga,replacementClass:ha,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};jt.familyPrefix&&(jt.cssPrefix=jt.familyPrefix);const Et={...Oa,...jt};Et.autoReplaceSvg||(Et.observeMutations=!1);const u={};Object.keys(Oa).forEach(t=>{Object.defineProperty(u,t,{enumerable:!0,set:function(e){Et[t]=e,_t.forEach(n=>n(u))},get:function(){return Et[t]}})});Object.defineProperty(u,"familyPrefix",{enumerable:!0,set:function(t){Et.cssPrefix=t,_t.forEach(e=>e(u))},get:function(){return Et.cssPrefix}});rt.FontAwesomeConfig=u;const _t=[];function _i(t){return _t.push(t),()=>{_t.splice(_t.indexOf(t),1)}}const nt=Le,X={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Wi(t){if(!t||!tt)return;const e=k.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=k.head.childNodes;let a=null;for(let r=n.length-1;r>-1;r--){const i=n[r],s=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(s)>-1&&(a=i)}return k.head.insertBefore(e,a),t}const Bi="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Ut(){let t=12,e="";for(;t-- >0;)e+=Bi[Math.random()*62|0];return e}function zt(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function Ze(t){return t.classList?zt(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function Aa(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $i(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(Aa(t[n]),'" '),"").trim()}function le(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function Je(t){return t.size!==X.size||t.x!==X.x||t.y!==X.y||t.rotate!==X.rotate||t.flipX||t.flipY}function Ui(t){let{transform:e,containerWidth:n,iconWidth:a}=t;const r={transform:"translate(".concat(n/2," 256)")},i="translate(".concat(e.x*32,", ").concat(e.y*32,") "),s="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),o="rotate(".concat(e.rotate," 0 0)"),c={transform:"".concat(i," ").concat(s," ").concat(o)},l={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:c,path:l}}function Yi(t){let{transform:e,width:n=Le,height:a=Le,startCentered:r=!1}=t,i="";return r&&pa?i+="translate(".concat(e.x/nt-n/2,"em, ").concat(e.y/nt-a/2,"em) "):r?i+="translate(calc(-50% + ".concat(e.x/nt,"em), calc(-50% + ").concat(e.y/nt,"em)) "):i+="translate(".concat(e.x/nt,"em, ").concat(e.y/nt,"em) "),i+="scale(".concat(e.size/nt*(e.flipX?-1:1),", ").concat(e.size/nt*(e.flipY?-1:1),") "),i+="rotate(".concat(e.rotate,"deg) "),i}var Hi=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;function Ca(){const t=ga,e=ha,n=u.cssPrefix,a=u.replacementClass;let r=Hi;if(n!==t||a!==e){const i=new RegExp("\\.".concat(t,"\\-"),"g"),s=new RegExp("\\--".concat(t,"\\-"),"g"),o=new RegExp("\\.".concat(e),"g");r=r.replace(i,".".concat(n,"-")).replace(s,"--".concat(n,"-")).replace(o,".".concat(a))}return r}let Sn=!1;function be(){u.autoAddCss&&!Sn&&(Wi(Ca()),Sn=!0)}var Xi={mixout(){return{dom:{css:Ca,insertCss:be}}},hooks(){return{beforeDOMElementCreation(){be()},beforeI2svg(){be()}}}};const J=rt||{};J[Z]||(J[Z]={});J[Z].styles||(J[Z].styles={});J[Z].hooks||(J[Z].hooks={});J[Z].shims||(J[Z].shims=[]);var V=J[Z];const La=[],ka=function(){k.removeEventListener("DOMContentLoaded",ka),ie=1,La.map(t=>t())};let ie=!1;tt&&(ie=(k.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(k.readyState),ie||k.addEventListener("DOMContentLoaded",ka));function Vi(t){tt&&(ie?setTimeout(t,0):La.push(t))}function Vt(t){const{tag:e,attributes:n={},children:a=[]}=t;return typeof t=="string"?Aa(t):"<".concat(e," ").concat($i(n),">").concat(a.map(Vt).join(""),"</").concat(e,">")}function Tn(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var ye=function(e,n,a,r){var i=Object.keys(e),s=i.length,o=n,c,l,f;for(a===void 0?(c=1,f=e[i[0]]):(c=0,f=a);c<s;c++)l=i[c],f=o(f,e[l],l,e);return f};function Gi(t){const e=[];let n=0;const a=t.length;for(;n<a;){const r=t.charCodeAt(n++);if(r>=55296&&r<=56319&&n<a){const i=t.charCodeAt(n++);(i&64512)==56320?e.push(((r&1023)<<10)+(i&1023)+65536):(e.push(r),n--)}else e.push(r)}return e}function ze(t){const e=Gi(t);return e.length===1?e[0].toString(16):null}function qi(t,e){const n=t.length;let a=t.charCodeAt(e),r;return a>=55296&&a<=56319&&n>e+1&&(r=t.charCodeAt(e+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function In(t){return Object.keys(t).reduce((e,n)=>{const a=t[n];return!!a.icon?e[a.iconName]=a.icon:e[n]=a,e},{})}function Ne(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:a=!1}=n,r=In(e);typeof V.hooks.addPack=="function"&&!a?V.hooks.addPack(t,In(e)):V.styles[t]={...V.styles[t]||{},...r},t==="fas"&&Ne("fa",e)}const{styles:mt,shims:Ki}=V,Qi={[M]:Object.values(gt[M]),[R]:Object.values(gt[R]),[D]:Object.values(gt[D])};let tn=null,Ma={},Pa={},Ea={},za={},Na={};const Zi={[M]:Object.keys(vt[M]),[R]:Object.keys(vt[R]),[D]:Object.keys(vt[D])};function Ji(t){return~Ri.indexOf(t)}function to(t,e){const n=e.split("-"),a=n[0],r=n.slice(1).join("-");return a===t&&r!==""&&!Ji(r)?r:null}const Sa=()=>{const t=a=>ye(mt,(r,i,s)=>(r[s]=ye(i,a,{}),r),{});Ma=t((a,r,i)=>(r[3]&&(a[r[3]]=i),r[2]&&r[2].filter(o=>typeof o=="number").forEach(o=>{a[o.toString(16)]=i}),a)),Pa=t((a,r,i)=>(a[i]=i,r[2]&&r[2].filter(o=>typeof o=="string").forEach(o=>{a[o]=i}),a)),Na=t((a,r,i)=>{const s=r[2];return a[i]=i,s.forEach(o=>{a[o]=i}),a});const e="far"in mt||u.autoFetchSvg,n=ye(Ki,(a,r)=>{const i=r[0];let s=r[1];const o=r[2];return s==="far"&&!e&&(s="fas"),typeof i=="string"&&(a.names[i]={prefix:s,iconName:o}),typeof i=="number"&&(a.unicodes[i.toString(16)]={prefix:s,iconName:o}),a},{names:{},unicodes:{}});Ea=n.names,za=n.unicodes,tn=fe(u.styleDefault,{family:u.familyDefault})};_i(t=>{tn=fe(t.styleDefault,{family:u.familyDefault})});Sa();function en(t,e){return(Ma[t]||{})[e]}function eo(t,e){return(Pa[t]||{})[e]}function at(t,e){return(Na[t]||{})[e]}function Ta(t){return Ea[t]||{prefix:null,iconName:null}}function no(t){const e=za[t],n=en("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function it(){return tn}const nn=()=>({prefix:null,iconName:null,rest:[]});function fe(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=M}=e,a=vt[n][t],r=$t[n][t]||$t[n][a],i=t in V.styles?t:null;return r||i||null}const ao={[M]:Object.keys(gt[M]),[R]:Object.keys(gt[R]),[D]:Object.keys(gt[D])};function ue(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e,a={[M]:"".concat(u.cssPrefix,"-").concat(M),[R]:"".concat(u.cssPrefix,"-").concat(R),[D]:"".concat(u.cssPrefix,"-").concat(D)};let r=null,i=M;const s=ui.filter(c=>c!==ma);s.forEach(c=>{(t.includes(a[c])||t.some(l=>ao[c].includes(l)))&&(i=c)});const o=t.reduce((c,l)=>{const f=to(u.cssPrefix,l);if(mt[l]?(l=Qi[i].includes(l)?Ni[i][l]:l,r=l,c.prefix=l):Zi[i].indexOf(l)>-1?(r=l,c.prefix=fe(l,{family:i})):f?c.iconName=f:l!==u.replacementClass&&!s.some(m=>l===a[m])&&c.rest.push(l),!n&&c.prefix&&c.iconName){const m=r==="fa"?Ta(c.iconName):{},p=at(c.prefix,c.iconName);m.prefix&&(r=null),c.iconName=m.iconName||p||c.iconName,c.prefix=m.prefix||c.prefix,c.prefix==="far"&&!mt.far&&mt.fas&&!u.autoFetchSvg&&(c.prefix="fas")}return c},nn());return(t.includes("fa-brands")||t.includes("fab"))&&(o.prefix="fab"),(t.includes("fa-duotone")||t.includes("fad"))&&(o.prefix="fad"),!o.prefix&&i===R&&(mt.fass||u.autoFetchSvg)&&(o.prefix="fass",o.iconName=at(o.prefix,o.iconName)||o.iconName),!o.prefix&&i===D&&(mt.fasds||u.autoFetchSvg)&&(o.prefix="fasds",o.iconName=at(o.prefix,o.iconName)||o.iconName),(o.prefix==="fa"||r==="fa")&&(o.prefix=it()||"fas"),o}class ro{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const r=n.reduce(this._pullDefinitions,{});Object.keys(r).forEach(i=>{this.definitions[i]={...this.definitions[i]||{},...r[i]},Ne(i,r[i]);const s=gt[M][i];s&&Ne(s,r[i]),Sa()})}reset(){this.definitions={}}_pullDefinitions(e,n){const a=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(a).map(r=>{const{prefix:i,iconName:s,icon:o}=a[r],c=o[2];e[i]||(e[i]={}),c.length>0&&c.forEach(l=>{typeof l=="string"&&(e[i][l]=o)}),e[i][s]=o}),e}}let Fn=[],wt={};const At={},io=Object.keys(At);function oo(t,e){let{mixoutsTo:n}=e;return Fn=t,wt={},Object.keys(At).forEach(a=>{io.indexOf(a)===-1&&delete At[a]}),Fn.forEach(a=>{const r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(i=>{typeof r[i]=="function"&&(n[i]=r[i]),typeof r[i]=="object"&&Object.keys(r[i]).forEach(s=>{n[i]||(n[i]={}),n[i][s]=r[i][s]})}),a.hooks){const i=a.hooks();Object.keys(i).forEach(s=>{wt[s]||(wt[s]=[]),wt[s].push(i[s])})}a.provides&&a.provides(At)}),n}function Se(t,e){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return(wt[t]||[]).forEach(s=>{e=s.apply(null,[e,...a])}),e}function yt(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];(wt[t]||[]).forEach(i=>{i.apply(null,n)})}function ot(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return At[t]?At[t].apply(null,e):void 0}function Te(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||it();if(e)return e=at(n,e)||e,Tn(Ia.definitions,n,e)||Tn(V.styles,n,e)}const Ia=new ro,so=()=>{u.autoReplaceSvg=!1,u.observeMutations=!1,yt("noAuto")},co={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return tt?(yt("beforeI2svg",t),ot("pseudoElements2svg",t),ot("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;u.autoReplaceSvg===!1&&(u.autoReplaceSvg=!0),u.observeMutations=!0,Vi(()=>{fo({autoReplaceSvgRoot:e}),yt("watch",t)})}},lo={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:at(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=fe(t[0]);return{prefix:n,iconName:at(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(u.cssPrefix,"-"))>-1||t.match(Si))){const e=ue(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||it(),iconName:at(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=it();return{prefix:e,iconName:at(e,t)||t}}}},_={noAuto:so,config:u,dom:co,parse:lo,library:Ia,findIconDefinition:Te,toHtml:Vt},fo=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=k}=t;(Object.keys(V.styles).length>0||u.autoFetchSvg)&&tt&&u.autoReplaceSvg&&_.dom.i2svg({node:e})};function pe(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>Vt(n))}}),Object.defineProperty(t,"node",{get:function(){if(!tt)return;const n=k.createElement("div");return n.innerHTML=t.html,n.children}}),t}function uo(t){let{children:e,main:n,mask:a,attributes:r,styles:i,transform:s}=t;if(Je(s)&&n.found&&!a.found){const{width:o,height:c}=n,l={x:o/c/2,y:.5};r.style=le({...i,"transform-origin":"".concat(l.x+s.x/16,"em ").concat(l.y+s.y/16,"em")})}return[{tag:"svg",attributes:r,children:e}]}function po(t){let{prefix:e,iconName:n,children:a,attributes:r,symbol:i}=t;const s=i===!0?"".concat(e,"-").concat(u.cssPrefix,"-").concat(n):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:{...r,id:s},children:a}]}]}function an(t){const{icons:{main:e,mask:n},prefix:a,iconName:r,transform:i,symbol:s,title:o,maskId:c,titleId:l,extra:f,watchable:m=!1}=t,{width:p,height:d}=n.found?n:e,w=a==="fak",h=[u.replacementClass,r?"".concat(u.cssPrefix,"-").concat(r):""].filter(x=>f.classes.indexOf(x)===-1).filter(x=>x!==""||!!x).concat(f.classes).join(" ");let v={children:[],attributes:{...f.attributes,"data-prefix":a,"data-icon":r,class:h,role:f.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(p," ").concat(d)}};const b=w&&!~f.classes.indexOf("fa-fw")?{width:"".concat(p/d*16*.0625,"em")}:{};m&&(v.attributes[bt]=""),o&&(v.children.push({tag:"title",attributes:{id:v.attributes["aria-labelledby"]||"title-".concat(l||Ut())},children:[o]}),delete v.attributes.title);const y={...v,prefix:a,iconName:r,main:e,mask:n,maskId:c,transform:i,symbol:s,styles:{...b,...f.styles}},{children:O,attributes:g}=n.found&&e.found?ot("generateAbstractMask",y)||{children:[],attributes:{}}:ot("generateAbstractIcon",y)||{children:[],attributes:{}};return y.children=O,y.attributes=g,s?po(y):uo(y)}function Rn(t){const{content:e,width:n,height:a,transform:r,title:i,extra:s,watchable:o=!1}=t,c={...s.attributes,...i?{title:i}:{},class:s.classes.join(" ")};o&&(c[bt]="");const l={...s.styles};Je(r)&&(l.transform=Yi({transform:r,startCentered:!0,width:n,height:a}),l["-webkit-transform"]=l.transform);const f=le(l);f.length>0&&(c.style=f);const m=[];return m.push({tag:"span",attributes:c,children:[e]}),i&&m.push({tag:"span",attributes:{class:"sr-only"},children:[i]}),m}function mo(t){const{content:e,title:n,extra:a}=t,r={...a.attributes,...n?{title:n}:{},class:a.classes.join(" ")},i=le(a.styles);i.length>0&&(r.style=i);const s=[];return s.push({tag:"span",attributes:r,children:[e]}),n&&s.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),s}const{styles:xe}=V;function Ie(t){const e=t[0],n=t[1],[a]=t.slice(4);let r=null;return Array.isArray(a)?r={tag:"g",attributes:{class:"".concat(u.cssPrefix,"-").concat(he.GROUP)},children:[{tag:"path",attributes:{class:"".concat(u.cssPrefix,"-").concat(he.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(u.cssPrefix,"-").concat(he.PRIMARY),fill:"currentColor",d:a[1]}}]}:r={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:e,height:n,icon:r}}const vo={found:!1,width:512,height:512};function go(t,e){!ba&&!u.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function Fe(t,e){let n=e;return e==="fa"&&u.styleDefault!==null&&(e=it()),new Promise((a,r)=>{if(n==="fa"){const i=Ta(t)||{};t=i.iconName||t,e=i.prefix||e}if(t&&e&&xe[e]&&xe[e][t]){const i=xe[e][t];return a(Ie(i))}go(t,e),a({...vo,icon:u.showMissingIcons&&t?ot("missingIconAbstract")||{}:{}})})}const Dn=()=>{},Re=u.measurePerformance&&te&&te.mark&&te.measure?te:{mark:Dn,measure:Dn},Ft='FA "6.6.0"',ho=t=>(Re.mark("".concat(Ft," ").concat(t," begins")),()=>Fa(t)),Fa=t=>{Re.mark("".concat(Ft," ").concat(t," ends")),Re.measure("".concat(Ft," ").concat(t),"".concat(Ft," ").concat(t," begins"),"".concat(Ft," ").concat(t," ends"))};var rn={begin:ho,end:Fa};const ne=()=>{};function jn(t){return typeof(t.getAttribute?t.getAttribute(bt):null)=="string"}function bo(t){const e=t.getAttribute?t.getAttribute(Ke):null,n=t.getAttribute?t.getAttribute(Qe):null;return e&&n}function yo(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(u.replacementClass)}function xo(){return u.autoReplaceSvg===!0?ae.replace:ae[u.autoReplaceSvg]||ae.replace}function wo(t){return k.createElementNS("http://www.w3.org/2000/svg",t)}function Oo(t){return k.createElement(t)}function Ra(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?wo:Oo}=e;if(typeof t=="string")return k.createTextNode(t);const a=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(i){a.setAttribute(i,t.attributes[i])}),(t.children||[]).forEach(function(i){a.appendChild(Ra(i,{ceFn:n}))}),a}function Ao(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const ae={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(Ra(n),e)}),e.getAttribute(bt)===null&&u.keepOriginalSource){let n=k.createComment(Ao(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~Ze(e).indexOf(u.replacementClass))return ae.replace(t);const a=new RegExp("".concat(u.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const i=n[0].attributes.class.split(" ").reduce((s,o)=>(o===u.replacementClass||o.match(a)?s.toSvg.push(o):s.toNode.push(o),s),{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",i.toNode.join(" "))}const r=n.map(i=>Vt(i)).join(`
`);e.setAttribute(bt,""),e.innerHTML=r}};function _n(t){t()}function Da(t,e){const n=typeof e=="function"?e:ne;if(t.length===0)n();else{let a=_n;u.mutateApproach===Ei&&(a=rt.requestAnimationFrame||_n),a(()=>{const r=xo(),i=rn.begin("mutate");t.map(r),i(),n()})}}let on=!1;function ja(){on=!0}function De(){on=!1}let oe=null;function Wn(t){if(!Pn||!u.observeMutations)return;const{treeCallback:e=ne,nodeCallback:n=ne,pseudoElementsCallback:a=ne,observeMutationsRoot:r=k}=t;oe=new Pn(i=>{if(on)return;const s=it();zt(i).forEach(o=>{if(o.type==="childList"&&o.addedNodes.length>0&&!jn(o.addedNodes[0])&&(u.searchPseudoElements&&a(o.target),e(o.target)),o.type==="attributes"&&o.target.parentNode&&u.searchPseudoElements&&a(o.target.parentNode),o.type==="attributes"&&jn(o.target)&&~Fi.indexOf(o.attributeName))if(o.attributeName==="class"&&bo(o.target)){const{prefix:c,iconName:l}=ue(Ze(o.target));o.target.setAttribute(Ke,c||s),l&&o.target.setAttribute(Qe,l)}else yo(o.target)&&n(o.target)})}),tt&&oe.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Co(){oe&&oe.disconnect()}function Lo(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((a,r)=>{const i=r.split(":"),s=i[0],o=i.slice(1);return s&&o.length>0&&(a[s]=o.join(":").trim()),a},{})),n}function ko(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),a=t.innerText!==void 0?t.innerText.trim():"";let r=ue(Ze(t));return r.prefix||(r.prefix=it()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=eo(r.prefix,t.innerText)||en(r.prefix,ze(t.innerText))),!r.iconName&&u.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=t.firstChild.data)),r}function Mo(t){const e=zt(t.attributes).reduce((r,i)=>(r.name!=="class"&&r.name!=="style"&&(r[i.name]=i.value),r),{}),n=t.getAttribute("title"),a=t.getAttribute("data-fa-title-id");return u.autoA11y&&(n?e["aria-labelledby"]="".concat(u.replacementClass,"-title-").concat(a||Ut()):(e["aria-hidden"]="true",e.focusable="false")),e}function Po(){return{iconName:null,title:null,titleId:null,prefix:null,transform:X,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Bn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:a,rest:r}=ko(t),i=Mo(t),s=Se("parseNodeAttributes",{},t);let o=e.styleParser?Lo(t):[];return{iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:a,transform:X,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:o,attributes:i},...s}}const{styles:Eo}=V;function _a(t){const e=u.autoReplaceSvg==="nest"?Bn(t,{styleParser:!1}):Bn(t);return~e.extra.classes.indexOf(wa)?ot("generateLayersText",t,e):ot("generateSvgReplacementMutation",t,e)}let K=new Set;ya.map(t=>{K.add("fa-".concat(t))});Object.keys(vt[M]).map(K.add.bind(K));Object.keys(vt[R]).map(K.add.bind(K));Object.keys(vt[D]).map(K.add.bind(K));K=[...K];function $n(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!tt)return Promise.resolve();const n=k.documentElement.classList,a=f=>n.add("".concat(Nn,"-").concat(f)),r=f=>n.remove("".concat(Nn,"-").concat(f)),i=u.autoFetchSvg?K:ya.map(f=>"fa-".concat(f)).concat(Object.keys(Eo));i.includes("fa")||i.push("fa");const s=[".".concat(wa,":not([").concat(bt,"])")].concat(i.map(f=>".".concat(f,":not([").concat(bt,"])"))).join(", ");if(s.length===0)return Promise.resolve();let o=[];try{o=zt(t.querySelectorAll(s))}catch{}if(o.length>0)a("pending"),r("complete");else return Promise.resolve();const c=rn.begin("onTree"),l=o.reduce((f,m)=>{try{const p=_a(m);p&&f.push(p)}catch(p){ba||p.name==="MissingIcon"&&console.error(p)}return f},[]);return new Promise((f,m)=>{Promise.all(l).then(p=>{Da(p,()=>{a("active"),a("complete"),r("pending"),typeof e=="function"&&e(),c(),f()})}).catch(p=>{c(),m(p)})})}function zo(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;_a(t).then(n=>{n&&Da([n],e)})}function No(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const a=(e||{}).icon?e:Te(e||{});let{mask:r}=n;return r&&(r=(r||{}).icon?r:Te(r||{})),t(a,{...n,mask:r})}}const So=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=X,symbol:a=!1,mask:r=null,maskId:i=null,title:s=null,titleId:o=null,classes:c=[],attributes:l={},styles:f={}}=e;if(!t)return;const{prefix:m,iconName:p,icon:d}=t;return pe({type:"icon",...t},()=>(yt("beforeDOMElementCreation",{iconDefinition:t,params:e}),u.autoA11y&&(s?l["aria-labelledby"]="".concat(u.replacementClass,"-title-").concat(o||Ut()):(l["aria-hidden"]="true",l.focusable="false")),an({icons:{main:Ie(d),mask:r?Ie(r.icon):{found:!1,width:null,height:null,icon:{}}},prefix:m,iconName:p,transform:{...X,...n},symbol:a,title:s,maskId:i,titleId:o,extra:{attributes:l,styles:f,classes:c}})))};var To={mixout(){return{icon:No(So)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=$n,t.nodeCallback=zo,t}}},provides(t){t.i2svg=function(e){const{node:n=k,callback:a=()=>{}}=e;return $n(n,a)},t.generateSvgReplacementMutation=function(e,n){const{iconName:a,title:r,titleId:i,prefix:s,transform:o,symbol:c,mask:l,maskId:f,extra:m}=n;return new Promise((p,d)=>{Promise.all([Fe(a,s),l.iconName?Fe(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(w=>{let[h,v]=w;p([e,an({icons:{main:h,mask:v},prefix:s,iconName:a,transform:o,symbol:c,maskId:f,title:r,titleId:i,extra:m,watchable:!0})])}).catch(d)})},t.generateAbstractIcon=function(e){let{children:n,attributes:a,main:r,transform:i,styles:s}=e;const o=le(s);o.length>0&&(a.style=o);let c;return Je(i)&&(c=ot("generateAbstractTransformGrouping",{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),n.push(c||r.icon),{children:n,attributes:a}}}},Io={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return pe({type:"layer"},()=>{yt("beforeDOMElementCreation",{assembler:t,params:e});let a=[];return t(r=>{Array.isArray(r)?r.map(i=>{a=a.concat(i.abstract)}):a=a.concat(r.abstract)}),[{tag:"span",attributes:{class:["".concat(u.cssPrefix,"-layers"),...n].join(" ")},children:a}]})}}}},Fo={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:a=[],attributes:r={},styles:i={}}=e;return pe({type:"counter",content:t},()=>(yt("beforeDOMElementCreation",{content:t,params:e}),mo({content:t.toString(),title:n,extra:{attributes:r,styles:i,classes:["".concat(u.cssPrefix,"-layers-counter"),...a]}})))}}}},Ro={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=X,title:a=null,classes:r=[],attributes:i={},styles:s={}}=e;return pe({type:"text",content:t},()=>(yt("beforeDOMElementCreation",{content:t,params:e}),Rn({content:t,transform:{...X,...n},title:a,extra:{attributes:i,styles:s,classes:["".concat(u.cssPrefix,"-layers-text"),...r]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:a,transform:r,extra:i}=n;let s=null,o=null;if(pa){const c=parseInt(getComputedStyle(e).fontSize,10),l=e.getBoundingClientRect();s=l.width/c,o=l.height/c}return u.autoA11y&&!a&&(i.attributes["aria-hidden"]="true"),Promise.resolve([e,Rn({content:e.innerHTML,width:s,height:o,transform:r,title:a,extra:i,watchable:!0})])}}};const Do=new RegExp('"',"ug"),Un=[1105920,1112319],Yn={FontAwesome:{normal:"fas",400:"fas"},...hi,...gi,...Li},je=Object.keys(Yn).reduce((t,e)=>(t[e.toLowerCase()]=Yn[e],t),{}),jo=Object.keys(je).reduce((t,e)=>{const n=je[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function _o(t){const e=t.replace(Do,""),n=qi(e,0),a=n>=Un[0]&&n<=Un[1],r=e.length===2?e[0]===e[1]:!1;return{value:ze(r?e[0]:e),isSecondary:a||r}}function Wo(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(e),r=isNaN(a)?"normal":a;return(je[n]||{})[r]||jo[n]}function Hn(t,e){const n="".concat(Pi).concat(e.replace(":","-"));return new Promise((a,r)=>{if(t.getAttribute(n)!==null)return a();const s=zt(t.children).filter(p=>p.getAttribute(ke)===e)[0],o=rt.getComputedStyle(t,e),c=o.getPropertyValue("font-family"),l=c.match(Ti),f=o.getPropertyValue("font-weight"),m=o.getPropertyValue("content");if(s&&!l)return t.removeChild(s),a();if(l&&m!=="none"&&m!==""){const p=o.getPropertyValue("content");let d=Wo(c,f);const{value:w,isSecondary:h}=_o(p),v=l[0].startsWith("FontAwesome");let b=en(d,w),y=b;if(v){const O=no(w);O.iconName&&O.prefix&&(b=O.iconName,d=O.prefix)}if(b&&!h&&(!s||s.getAttribute(Ke)!==d||s.getAttribute(Qe)!==y)){t.setAttribute(n,y),s&&t.removeChild(s);const O=Po(),{extra:g}=O;g.attributes[ke]=e,Fe(b,d).then(x=>{const C=an({...O,icons:{main:x,mask:nn()},prefix:d,iconName:y,extra:g,watchable:!0}),L=k.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(L,t.firstChild):t.appendChild(L),L.outerHTML=C.map(P=>Vt(P)).join(`
`),t.removeAttribute(n),a()}).catch(r)}else a()}else a()})}function Bo(t){return Promise.all([Hn(t,"::before"),Hn(t,"::after")])}function $o(t){return t.parentNode!==document.head&&!~zi.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(ke)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function Xn(t){if(tt)return new Promise((e,n)=>{const a=zt(t.querySelectorAll("*")).filter($o).map(Bo),r=rn.begin("searchPseudoElements");ja(),Promise.all(a).then(()=>{r(),De(),e()}).catch(()=>{r(),De(),n()})})}var Uo={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=Xn,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=k}=e;u.searchPseudoElements&&Xn(n)}}};let Vn=!1;var Yo={mixout(){return{dom:{unwatch(){ja(),Vn=!0}}}},hooks(){return{bootstrap(){Wn(Se("mutationObserverCallbacks",{}))},noAuto(){Co()},watch(t){const{observeMutationsRoot:e}=t;Vn?De():Wn(Se("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Gn=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,a)=>{const r=a.toLowerCase().split("-"),i=r[0];let s=r.slice(1).join("-");if(i&&s==="h")return n.flipX=!0,n;if(i&&s==="v")return n.flipY=!0,n;if(s=parseFloat(s),isNaN(s))return n;switch(i){case"grow":n.size=n.size+s;break;case"shrink":n.size=n.size-s;break;case"left":n.x=n.x-s;break;case"right":n.x=n.x+s;break;case"up":n.y=n.y-s;break;case"down":n.y=n.y+s;break;case"rotate":n.rotate=n.rotate+s;break}return n},e)};var Ho={mixout(){return{parse:{transform:t=>Gn(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Gn(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:a,containerWidth:r,iconWidth:i}=e;const s={transform:"translate(".concat(r/2," 256)")},o="translate(".concat(a.x*32,", ").concat(a.y*32,") "),c="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),l="rotate(".concat(a.rotate," 0 0)"),f={transform:"".concat(o," ").concat(c," ").concat(l)},m={transform:"translate(".concat(i/2*-1," -256)")},p={outer:s,inner:f,path:m};return{tag:"g",attributes:{...p.outer},children:[{tag:"g",attributes:{...p.inner},children:[{tag:n.icon.tag,children:n.icon.children,attributes:{...n.icon.attributes,...p.path}}]}]}}}};const we={x:0,y:0,width:"100%",height:"100%"};function qn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Xo(t){return t.tag==="g"?t.children:[t]}var Vo={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),a=n?ue(n.split(" ").map(r=>r.trim())):nn();return a.prefix||(a.prefix=it()),t.mask=a,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:a,main:r,mask:i,maskId:s,transform:o}=e;const{width:c,icon:l}=r,{width:f,icon:m}=i,p=Ui({transform:o,containerWidth:f,iconWidth:c}),d={tag:"rect",attributes:{...we,fill:"white"}},w=l.children?{children:l.children.map(qn)}:{},h={tag:"g",attributes:{...p.inner},children:[qn({tag:l.tag,attributes:{...l.attributes,...p.path},...w})]},v={tag:"g",attributes:{...p.outer},children:[h]},b="mask-".concat(s||Ut()),y="clip-".concat(s||Ut()),O={tag:"mask",attributes:{...we,id:b,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"},children:[d,v]},g={tag:"defs",children:[{tag:"clipPath",attributes:{id:y},children:Xo(m)},O]};return n.push(g,{tag:"rect",attributes:{fill:"currentColor","clip-path":"url(#".concat(y,")"),mask:"url(#".concat(b,")"),...we}}),{children:n,attributes:a}}}},Go={provides(t){let e=!1;rt.matchMedia&&(e=rt.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],a={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:{...a,d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"}});const i={...r,attributeName:"opacity"},s={tag:"circle",attributes:{...a,cx:"256",cy:"364",r:"28"},children:[]};return e||s.children.push({tag:"animate",attributes:{...r,attributeName:"r",values:"28;14;28;28;14;28;"}},{tag:"animate",attributes:{...i,values:"1;0;1;1;0;1;"}}),n.push(s),n.push({tag:"path",attributes:{...a,opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"},children:e?[]:[{tag:"animate",attributes:{...i,values:"1;0;0;0;0;1;"}}]}),e||n.push({tag:"path",attributes:{...a,opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"},children:[{tag:"animate",attributes:{...i,values:"0;0;1;1;0;0;"}}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},qo={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),a=n===null?!1:n===""?!0:n;return t.symbol=a,t}}}},Ko=[Xi,To,Io,Fo,Ro,Uo,Yo,Ho,Vo,Go,qo];oo(Ko,{mixoutsTo:_});_.noAuto;_.config;_.library;_.dom;const _e=_.parse;_.findIconDefinition;_.toHtml;const Qo=_.icon;_.layer;_.text;_.counter;function Kn(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function H(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Kn(Object(n),!0).forEach(function(a){Ot(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Kn(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function se(t){"@babel/helpers - typeof";return se=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},se(t)}function Ot(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Zo(t,e){if(t==null)return{};var n={},a=Object.keys(t),r,i;for(i=0;i<a.length;i++)r=a[i],!(e.indexOf(r)>=0)&&(n[r]=t[r]);return n}function Jo(t,e){if(t==null)return{};var n=Zo(t,e),a,r;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)a=i[r],!(e.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}function We(t){return ts(t)||es(t)||ns(t)||as()}function ts(t){if(Array.isArray(t))return Be(t)}function es(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function ns(t,e){if(t){if(typeof t=="string")return Be(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Be(t,e)}}function Be(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function as(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function rs(t){var e,n=t.beat,a=t.fade,r=t.beatFade,i=t.bounce,s=t.shake,o=t.flash,c=t.spin,l=t.spinPulse,f=t.spinReverse,m=t.pulse,p=t.fixedWidth,d=t.inverse,w=t.border,h=t.listItem,v=t.flip,b=t.size,y=t.rotation,O=t.pull,g=(e={"fa-beat":n,"fa-fade":a,"fa-beat-fade":r,"fa-bounce":i,"fa-shake":s,"fa-flash":o,"fa-spin":c,"fa-spin-reverse":f,"fa-spin-pulse":l,"fa-pulse":m,"fa-fw":p,"fa-inverse":d,"fa-border":w,"fa-li":h,"fa-flip":v===!0,"fa-flip-horizontal":v==="horizontal"||v==="both","fa-flip-vertical":v==="vertical"||v==="both"},Ot(e,"fa-".concat(b),typeof b<"u"&&b!==null),Ot(e,"fa-rotate-".concat(y),typeof y<"u"&&y!==null&&y!==0),Ot(e,"fa-pull-".concat(O),typeof O<"u"&&O!==null),Ot(e,"fa-swap-opacity",t.swapOpacity),e);return Object.keys(g).map(function(x){return g[x]?x:null}).filter(function(x){return x})}function is(t){return t=t-0,t===t}function Wa(t){return is(t)?t:(t=t.replace(/[\-_\s]+(.)?/g,function(e,n){return n?n.toUpperCase():""}),t.substr(0,1).toLowerCase()+t.substr(1))}var os=["style"];function ss(t){return t.charAt(0).toUpperCase()+t.slice(1)}function cs(t){return t.split(";").map(function(e){return e.trim()}).filter(function(e){return e}).reduce(function(e,n){var a=n.indexOf(":"),r=Wa(n.slice(0,a)),i=n.slice(a+1).trim();return r.startsWith("webkit")?e[ss(r)]=i:e[r]=i,e},{})}function Ba(t,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var a=(e.children||[]).map(function(c){return Ba(t,c)}),r=Object.keys(e.attributes||{}).reduce(function(c,l){var f=e.attributes[l];switch(l){case"class":c.attrs.className=f,delete e.attributes.class;break;case"style":c.attrs.style=cs(f);break;default:l.indexOf("aria-")===0||l.indexOf("data-")===0?c.attrs[l.toLowerCase()]=f:c.attrs[Wa(l)]=f}return c},{attrs:{}}),i=n.style,s=i===void 0?{}:i,o=Jo(n,os);return r.attrs.style=H(H({},r.attrs.style),s),t.apply(void 0,[e.tag,H(H({},r.attrs),o)].concat(We(a)))}var $a=!1;try{$a=!0}catch{}function ls(){if(!$a&&console&&typeof console.error=="function"){var t;(t=console).error.apply(t,arguments)}}function Qn(t){if(t&&se(t)==="object"&&t.prefix&&t.iconName&&t.icon)return t;if(_e.icon)return _e.icon(t);if(t===null)return null;if(t&&se(t)==="object"&&t.prefix&&t.iconName)return t;if(Array.isArray(t)&&t.length===2)return{prefix:t[0],iconName:t[1]};if(typeof t=="string")return{prefix:"fas",iconName:t}}function Oe(t,e){return Array.isArray(e)&&e.length>0||!Array.isArray(e)&&e?Ot({},t,e):{}}var Zn={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},Ua=Jn.forwardRef(function(t,e){var n=H(H({},Zn),t),a=n.icon,r=n.mask,i=n.symbol,s=n.className,o=n.title,c=n.titleId,l=n.maskId,f=Qn(a),m=Oe("classes",[].concat(We(rs(n)),We((s||"").split(" ")))),p=Oe("transform",typeof n.transform=="string"?_e.transform(n.transform):n.transform),d=Oe("mask",Qn(r)),w=Qo(f,H(H(H(H({},m),p),d),{},{symbol:i,title:o,titleId:c,maskId:l}));if(!w)return ls("Could not find icon",f),null;var h=w.abstract,v={ref:e};return Object.keys(n).forEach(function(b){Zn.hasOwnProperty(b)||(v[b]=n[b])}),fs(h[0],v)});Ua.displayName="FontAwesomeIcon";Ua.propTypes={beat:A.bool,border:A.bool,beatFade:A.bool,bounce:A.bool,className:A.string,fade:A.bool,flash:A.bool,mask:A.oneOfType([A.object,A.array,A.string]),maskId:A.string,fixedWidth:A.bool,inverse:A.bool,flip:A.oneOf([!0,!1,"horizontal","vertical","both"]),icon:A.oneOfType([A.object,A.array,A.string]),listItem:A.bool,pull:A.oneOf(["right","left"]),pulse:A.bool,rotation:A.oneOf([0,90,180,270]),shake:A.bool,size:A.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:A.bool,spinPulse:A.bool,spinReverse:A.bool,symbol:A.oneOfType([A.bool,A.string]),title:A.string,titleId:A.string,transform:A.oneOfType([A.string,A.object]),swapOpacity:A.bool};var fs=Ba.bind(null,Jn.createElement);export{e1 as $,f1 as A,ws as B,Os as C,js as D,l1 as E,Ua as F,qs as G,Ss as H,Fs as I,r1 as J,Cs as K,gs as L,As as M,Ks as N,Ws as O,Ds as P,Rs as Q,$s as R,Es as S,Us as T,_s as U,Js as V,o1 as W,ci as X,ks as Y,ys as Z,t1 as _,xs as a,zs as a0,Vs as b,a1 as c,Qs as d,Xs as e,Ms as f,Ls as g,Ps as h,ms as i,Ys as j,ds as k,i1 as l,bs as m,vs as n,Hs as o,Ts as p,Bs as q,c1 as r,Zs as s,Gs as t,ps as u,s1 as v,Ns as w,hs as x,Is as y,n1 as z};
