import { useEffect, useMemo, useRef } from 'react';
import type { MotionValue } from 'framer-motion';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { asset } from '../lib/config';
import type { Signal } from '../lib/content';
import type { SceneMode } from './KenkoStage';
const panelNames=['Movement','Nutrition','Hydration','Sleep','Recovery'];
export type SceneProps={progress?:MotionValue<number>;selected:Signal|null;spread:number;active:boolean;gaze:number;mode:SceneMode;pointer:RefObject<{x:number;y:number}>;onReady:()=>void;onFailure:(reason?:string)=>void};
function CameraFit(){const {camera,size}=useThree();useEffect(()=>{const c=camera as THREE.OrthographicCamera;c.zoom=Math.min(size.width/5.7,size.height/4.845);c.lookAt(.15,.5,0);c.updateProjectionMatrix();},[camera,size]);return null;}
function Mascot({selected,spread,gaze,pointer,onReady,progress,mode}:SceneProps){
 const gltf=useGLTF(asset('models/kenko-mascot.glb'));const group=useRef<THREE.Group>(null);
 const scene=useMemo(()=>{const copy=gltf.scene.clone(true);copy.traverse(o=>{if(o instanceof THREE.Mesh)o.material=(o.material as THREE.MeshStandardMaterial).clone();});const head=copy.getObjectByName('Kenko_Head');if(head){copy.updateMatrixWorld(true);['Kenko_Eye_Left','Kenko_Eye_Right','Kenko_Eye_Glint_Left','Kenko_Eye_Glint_Right'].forEach(n=>{const eye=copy.getObjectByName(n);if(eye)head.attach(eye);});}return copy;},[gltf.scene]);
 const parts=useMemo(()=>({panels:panelNames.map(n=>scene.getObjectByName(`Kenko_Shell_${n}`) as THREE.Mesh),heart:scene.getObjectByName('Kenko_Heart') as THREE.Mesh,head:scene.getObjectByName('Kenko_Head'),eyes:['Kenko_Eye_Left','Kenko_Eye_Right'].map(n=>scene.getObjectByName(n)),limbs:['FrontLeg_Left','FrontLeg_Right','BackLeg_Left','BackLeg_Right'].map(n=>{const o=scene.getObjectByName(`Kenko_${n}`);return {o,rotation:o?.rotation.clone()};})}),[scene]);
 useEffect(()=>{onReady();return()=>{scene.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose();});};},[scene,onReady]);
 useFrame(({clock},delta)=>{if(!group.current)return;const t=clock.elapsedTime,dt=Math.min(delta,.05),p=pointer.current;
 group.current.position.y=Math.sin(t*.7)*.035;group.current.rotation.y=THREE.MathUtils.damp(group.current.rotation.y,p.x*.06+gaze*.09,3,dt);group.current.scale.y=1+Math.sin(t*.9)*.008;
 if(parts.head){parts.head.rotation.y=THREE.MathUtils.damp(parts.head.rotation.y,p.x*.09,3,dt);parts.head.rotation.x=THREE.MathUtils.damp(parts.head.rotation.x,p.y*.055,3,dt);}
 parts.panels.forEach((m,i)=>{if(!m)return;const picked=selected===panelNames[i],a=i*Math.PI*2/5+.16,amount=(mode==='journey'&&progress?Math.max(0,1-progress.get()*5)*.65:spread)*.42+(picked?.055:0);m.position.x=THREE.MathUtils.damp(m.position.x,Math.cos(a)*amount,4,dt);m.position.z=THREE.MathUtils.damp(m.position.z,-Math.sin(a)*amount,4,dt);m.position.y=THREE.MathUtils.damp(m.position.y,amount*.6,4,dt);const mat=m.material as THREE.MeshStandardMaterial;mat.emissive.copy(mat.color);mat.emissiveIntensity=THREE.MathUtils.damp(mat.emissiveIntensity,picked?.22:0,4,dt);});
 if(parts.heart){parts.heart.scale.setScalar(1+Math.sin(t*1.6)*.018);const mat=parts.heart.material as THREE.MeshStandardMaterial;mat.emissiveIntensity=THREE.MathUtils.damp(mat.emissiveIntensity,selected?.45:.12,3,dt);}
 const blink=t%6.2>5.9&&t%6.2<6.04?.18:1;parts.eyes.forEach(eye=>{if(eye)eye.scale.y=THREE.MathUtils.damp(eye.scale.y,blink,30,dt);});parts.limbs.forEach(({o,rotation},i)=>{if(o&&rotation)o.rotation.z=rotation.z+Math.sin(t*.7+i)*.025;});
 });return <group ref={group}><primitive object={scene} dispose={null}/></group>;
}
const wellnessNames=['hydration','nutrition','movement','recovery','intelligence'] as const;
function WellnessAsset({name,position=[0,0,0],scale=1,assemble=false}:{name:typeof wellnessNames[number];position?:[number,number,number];scale?:number;assemble?:boolean}){
 const {scene:original}=useGLTF(asset(`models/${name}.glb`));const root=useRef<THREE.Group>(null);const start=useRef<number|null>(null);
 const scene=useMemo(()=>{const clone=original.clone(true);clone.traverse(o=>{if(o instanceof THREE.Mesh)o.material=(o.material as THREE.Material).clone();});return clone;},[original]);
 const ingredients=useMemo(()=>{const all:{o:THREE.Object3D;y:number}[]=[];scene.traverse(o=>{if(o.name.includes('Ingredient')||o.name.includes('Leaf'))all.push({o,y:o.position.y});});return all;},[scene]);
 useEffect(()=>()=>{scene.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose();});},[scene]);
 useFrame(({clock},delta)=>{const t=clock.elapsedTime;if(start.current===null)start.current=t;if(root.current){root.current.position.y=position[1]+Math.sin(t*.6+position[0])*.035;root.current.rotation.y=Math.sin(t*.35+position[0])*.13;}if(assemble){const settle=Math.max(0,1-(t-start.current)/2.8);ingredients.forEach(({o,y},i)=>{o.position.y=THREE.MathUtils.damp(o.position.y,y+settle*(.5+i*.09),3,Math.min(delta,.05));});}});
 return <group ref={root} position={position} scale={scale}><primitive object={scene} dispose={null}/></group>;
}
function SceneReady({onReady}:{onReady:()=>void}){useEffect(onReady,[onReady]);return null;}
function WellnessOrbit(){const ref=useRef<THREE.Group>(null);useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=clock.elapsedTime*.045;});return <group ref={ref}>{wellnessNames.map((name,i)=>{const a=i*Math.PI*2/5;return <WellnessAsset key={name} name={name} scale={.32} position={[Math.cos(a)*2.05,.75+Math.sin(a)*.25,Math.sin(a)*1.7]}/>;})}</group>;}

/** Keep one mascot and scene mounted as scroll changes their composition. */
function JourneyObject({index,progress,name}:{index:number;progress:MotionValue<number>;name:typeof wellnessNames[number]}){
 const ref=useRef<THREE.Group>(null);
 useFrame((_,delta)=>{
  if(!ref.current)return;
  const p=progress.get()*4,weight=Math.max(0,1-Math.abs(p-index)),final=Math.max(0,p-3);
  const amount=Math.max(weight,final*.38),dt=Math.min(delta,.05);
  const angle=wellnessNames.indexOf(name)*Math.PI*2/5+.35;
  ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x,.001+THREE.MathUtils.lerp(amount*.85,.36,final),5,dt));
  ref.current.position.x=THREE.MathUtils.damp(ref.current.position.x,THREE.MathUtils.lerp((index%2?1.35:-1.4)+(1-amount)*1.1,Math.cos(angle)*2.2,final),4,dt);
  ref.current.position.y=THREE.MathUtils.damp(ref.current.position.y,THREE.MathUtils.lerp(.45+(1-amount)*1.3,.8+Math.sin(angle)*.3,final),4,dt);
  ref.current.position.z=THREE.MathUtils.damp(ref.current.position.z,Math.sin(angle)*1.8*final,4,dt);
  ref.current.visible=ref.current.scale.x>.015;
 });
 return <group ref={ref} scale={.001}><WellnessAsset name={name} assemble={name==='nutrition'}/></group>;
}
function JourneyScene(props:SceneProps){
 const ref=useRef<THREE.Group>(null);
 useFrame((_,delta)=>{
  if(!ref.current||!props.progress)return;
  const p=props.progress.get()*4,dt=Math.min(delta,.05),middle=Math.sin(p/4*Math.PI);
  ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x,1-middle*.32-Math.max(0,p-3)*.15,4,dt));
  ref.current.position.y=THREE.MathUtils.damp(ref.current.position.y,-middle*.55,4,dt);
  ref.current.rotation.y=THREE.MathUtils.damp(ref.current.rotation.y,Math.sin(p*1.5)*.16,3,dt);
 });
 return <><group ref={ref}><Mascot {...props}/></group>{props.progress&&<>
 <JourneyObject name="hydration" index={1} progress={props.progress}/>
 <JourneyObject name="nutrition" index={2} progress={props.progress}/>
 <JourneyObject name="movement" index={3} progress={props.progress}/>
 <JourneyObject name="recovery" index={4} progress={props.progress}/>
 <JourneyObject name="intelligence" index={4.2} progress={props.progress}/>
 </>}</>;
}

function StoryObjects(props:SceneProps){
 if(props.mode==='journey')return <JourneyScene {...props}/>;
 if(props.mode==='nutrition')return <><WellnessAsset name="nutrition" scale={1.8} position={[0,-.45,0]} assemble/><SceneReady onReady={props.onReady}/></>;
 if(props.mode==='movement')return <><WellnessAsset name="movement" scale={1.45} position={[0,-.45,0]}/><SceneReady onReady={props.onReady}/></>;
 if(props.mode==='checkin')return <><WellnessAsset name="hydration" position={[-.75,0,0]} scale={1.15}/><WellnessAsset name="recovery" position={[1,.05,-.5]} scale={.8}/><SceneReady onReady={props.onReady}/></>;
 return <><Mascot {...props}/>{props.mode==='whole'&&<group position={[0,.7,0]}>{panelNames.map((_,i)=>{const a=i*Math.PI*2/5;return <Line key={i} points={[[0,.8,0],[Math.cos(a)*1.7,.5,Math.sin(a)*1.3]]} color="#ffbcb5" transparent opacity={.45} lineWidth={1}/>;})}</group>}{props.mode==='complete'&&<WellnessOrbit/>}</>;
}
function ContextMonitor({onFailure}:Pick<SceneProps,'onFailure'>){const gl=useThree(s=>s.gl);const slow=useRef(0);useEffect(()=>{const c=gl.domElement;const lost=(e:Event)=>{e.preventDefault();onFailure('context-lost');};c.addEventListener('webglcontextlost',lost);return()=>c.removeEventListener('webglcontextlost',lost);},[gl,onFailure]);useFrame((_,delta)=>{slow.current=delta>.15?slow.current+Math.min(delta,.2):Math.max(0,slow.current-.1);if(slow.current>12)onFailure('slow-renderer');});return null;}
export default function KenkoCanvas(props:SceneProps){useEffect(()=>{if(props.mode!=='kenko')wellnessNames.forEach(n=>useGLTF.preload(asset(`models/${n}.glb`)));},[props.mode]);return <Canvas aria-hidden="true" className="kenko-canvas" orthographic camera={{position:[4.1,5.3,6.8],zoom:95,near:.1,far:40}} dpr={[1,matchMedia('(max-width:640px)').matches?1.25:1.5]} frameloop={props.active?'always':'never'} gl={{alpha:true,antialias:true,powerPreference:'low-power',toneMapping:THREE.AgXToneMapping}}><CameraFit/><ambientLight intensity={1.2}/><directionalLight position={[-3,7,4]} intensity={3} color="#fff1df"/><directionalLight position={[3,4,-4]} intensity={2} color="#cbd6ff"/><directionalLight position={[-4,2,-2]} intensity={.8} color="#cef1db"/><StoryObjects key={props.mode} {...props}/><ContextMonitor onFailure={props.onFailure}/></Canvas>;}

