var define,require;(function(e){function i(e,t){return Object.prototype.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase()===t}function s(e){var o=[];if(!i(e,"string"))throw new Error("Id must be a string");if(n.hasOwnProperty(e))return n[e];if(!t.hasOwnProperty(e))throw new Error("Module "+e+" not defined");r[e]=!0;for(var u=0,a=t[e].dependencies,f=a.length;u<f;u++)o.push(r.hasOwnProperty(a[u])?n[a[u]]:s(a[u]));n[e]=i(t[e].factory,"function")?t[e].factory.apply(null,o):t[e].factory;return n[e]}var t={},n={},r={};define=function(n,r,s){var o=[];if(s===e){s=r;r=[]}t.hasOwnProperty(n)&&o.push("Module "+n+" already defined");i(n,"string")||o.push("Id must be a string");i(r,"array")||o.push("Dependencies must be an array");!i(s,"function")&&!i(s,"object")&&o.push("Factory must be a function or object");if(o.length)throw new Error(o.join(", "));t[n]={id:n,dependencies:r,factory:s}};require=function(e,t){var n=[];r={};if(i(e,"array")){for(var o=0,u=e.length;o<u;o++)n.push(s(e[o]));return i(t,"function")?t.apply(null,n):n}return s(e)};require.reset=function(){t={};n={}}})();