import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { asset } from '../lib/config';
import type { Signal } from '../lib/content';
const KenkoCanvas = lazy(() => import('./KenkoCanvas'));
class SceneBoundary extends Component<{children:ReactNode;onFailure:(reason?:string)=>void},{failed:boolean}> {
 state={failed:false}; static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onFailure('scene-error');}
 render(){return this.state.failed?null:this.props.children;}
}
function supportsScene(){
 const nav=navigator as Navigator & {deviceMemory?:number;connection?:{saveData?:boolean}};
 if(new URLSearchParams(location.search).has('fallback')||nav.connection?.saveData||(nav.deviceMemory??8)<=2||navigator.hardwareConcurrency<=2)return false;
 try{const c=document.createElement('canvas');const gl=c.getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}
}
export type SceneMode='kenko'|'whole'|'checkin'|'nutrition'|'movement'|'complete';
export function KenkoStage({selected=null,spread=0,className='',gaze=0,mode='kenko'}:{selected?:Signal|null;spread?:number;className?:string;gaze?:number;mode?:SceneMode}){
 const ref=useRef<HTMLDivElement>(null),pointer=useRef({x:0,y:0});
 const [near,setNear]=useState(false),[visible,setVisible]=useState(false),[pageVisible,setPageVisible]=useState(!document.hidden),[readyMode,setReadyMode]=useState<SceneMode|null>(null),[failed,setFailed]=useState(false);
 const [reason,setReason]=useState('');const [capable]=useState(supportsScene);const reduced=useReducedMotion();
 const ready=readyMode===mode;const onReady=useCallback(()=>setReadyMode(mode),[mode]),onFailure=useCallback((why?:string)=>{setReason(why??'unknown');setFailed(true);},[]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{setVisible(entry.isIntersecting);if(entry.isIntersecting)setNear(true);},{rootMargin:'100px'});if(ref.current)observer.observe(ref.current);const visibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};},[]);
 const render3D=near&&!reduced&&capable&&!failed;
 useEffect(()=>{if(!render3D||ready)return;const timer=setTimeout(()=>onFailure('load-timeout'),15000);return()=>clearTimeout(timer);},[render3D,ready,onFailure]);
 const fallback=mode==='nutrition'?'nutrition':mode==='movement'?'movement':mode==='checkin'?'hydration':null;
 return <div ref={ref} className={`kenko-stage ${className}`} data-renderer={ready&&render3D?'webgl':'fallback'} data-scene={mode} data-fallback-reason={reason} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();pointer.current={x:(e.clientX-r.left)/r.width*2-1,y:(e.clientY-r.top)/r.height*2-1};}} onPointerLeave={()=>{pointer.current={x:0,y:0};}}>
 <div className="kenko-shadow"/><div className={`fallback-layer ${ready&&render3D&&visible&&pageVisible?'is-hidden':''}`}><img className="kenko-fallback" src={asset(`images/${fallback?`${fallback}-fallback.webp`:'kenko-fallback.webp'}`)} alt={fallback?`${fallback} wellness sculpture`:'Kenko, a cream turtle with five pastel shell panels and a coral heart'} width="1000" height="850" loading={mode==='kenko'?'eager':'lazy'}/></div>
 {render3D&&<SceneBoundary onFailure={onFailure}><Suspense fallback={null}><KenkoCanvas selected={selected} spread={spread} active={visible&&pageVisible} gaze={gaze} mode={mode} pointer={pointer} onReady={onReady} onFailure={onFailure}/></Suspense></SceneBoundary>}
 </div>;
}
