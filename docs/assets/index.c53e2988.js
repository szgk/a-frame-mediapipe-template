const i=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerpolicy&&(s.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?s.credentials="include":n.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=a(n);fetch(n.href,s)}};i();const t={handSphers:[],sceneElement:null,canvasElement:null,cameraElement:null,canvasCtx:null,isMobile:!1},l=o=>{const e=document.createElement("a-sphere");for(const a in o)e.setAttribute(a,o[a]);return t.sceneElement.appendChild(e),e},d=o=>{o.forEach(e=>{const a=l({position:{x:e.x,y:e.y,z:e.z},radius:.04,color:"#000",["ammo-body"]:"type: kinematic",["ammo-shape"]:"type: sphere"});t.handSphers.push(a)})},m=o=>{if(t.canvasCtx.save(),t.canvasCtx.clearRect(0,0,t.canvasElement.width,t.canvasElement.height),t.canvasCtx.drawImage(o.image,0,0,t.canvasElement.width,t.canvasElement.height),o.multiHandLandmarks)for(const e of o.multiHandLandmarks)t.handSphers.length<=0&&d(e),t.handSphers.forEach((a,r)=>{a.setAttribute("position",{x:e[r].x*-3+1,y:e[r].y*-2.5+2,z:e[r].z*8-2})});t.canvasCtx.restore()},u=()=>{t.sceneElement=document.querySelector("a-scene"),t.canvasElement=document.querySelector("#output-canvas"),t.cameraElement=document.querySelector("#camera"),t.canvasCtx=t.canvasElement.getContext("2d"),t.isMobile=AFRAME.utils.device.isMobile();const o=document.querySelector("#input-video"),e=new Hands({locateFile:r=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${r}`});e.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:.5,minTrackingConfidence:.5}),e.onResults(m),new Camera(o,{onFrame:async()=>{await e.send({image:o})},width:1280,height:720}).start()};window.onload=u;