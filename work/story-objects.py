from pathlib import Path
p=Path('src/components/KenkoCanvas.tsx');s=p.read_text(encoding='utf-8-sig').replace("import { useGLTF }", "import { Line, useGLTF }")
pos=s.index('function ContextMonitor')
s=s[:pos]+'''const wellnessNames=['hydration','nutrition','movement','recovery','intelligence'] as const;
function WellnessAsset({name,position=[0,0,0],scale=1,assemble=false}:{name:typeof wellnessNames[number];position?:[number,number,number];scale?:number;assemble?:boolean}){
 const {scene:original}=useGLTF(asset(`models/${name}.glb`));const root=useRef<THREE.Group>(null);const start=useRef<number|null>(null);
 const scene=useMemo(()=>{const clone=original.clone(true);clone.traverse(o=>{if(o instanceof THREE.Mesh)o.material=(o.material as THREE.Material).clone();});return clone;},[original]);
 const ingredients=useMemo(()=>{const all:{o:THREE.Object3D;y:number}[]=[];scene.traverse(o=>{if(o.name.includes('Ingredient')||o.name.includes('Leaf'))all.push({o,y:o.position.y});});return all;},[scene]);
 useEffect(()=>()=>{scene.traverse(o=>{if(o instanceof THREE.Mesh)(o.material as THREE.Material).dispose();});},[scene]);
 useFrame(({clock},delta)=>{const t=clock.elapsedTime;if(start.current===null)start.current=t;if(root.current){root.current.position.y=position[1]+Math.sin(t*.6+position[0])*.035;root.current.rotation.y=Math.sin(t*.35+position[0])*.13;}if(assemble){const settle=Math.max(0,1-(t-start.current)/2.8);ingredients.forEach(({o,y},i)=>{o.position.y=THREE.MathUtils.damp(o.position.y,y+settle*(.5+i*.09),3,Math.min(delta,.05));});}});
 return <group ref={root} position={position} scale={scale}><primitive object={scene} dispose={null}/></group>;
}
function SceneReady({onReady}:{onReady:()=>void}){useEffect(onReady,[onReady]);return null;}
function StoryObjects(props:SceneProps){
 if(props.mode==='nutrition')return <><WellnessAsset name="nutrition" scale={1.8} position={[0,-.45,0]} assemble/><SceneReady onReady={props.onReady}/></>;
 if(props.mode==='movement')return <><WellnessAsset name="movement" scale={1.45} position={[0,-.45,0]}/><SceneReady onReady={props.onReady}/></>;
 if(props.mode==='checkin')return <><WellnessAsset name="hydration" position={[-.75,0,0]} scale={1.15}/><WellnessAsset name="recovery" position={[1,.05,-.5]} scale={.8}/><SceneReady onReady={props.onReady}/></>;
 return <><Mascot {...props}/>{props.mode==='whole'&&<group position={[0,.7,0]}>{panelNames.map((_,i)=>{const a=i*Math.PI*2/5;return <Line key={i} points={[[0,.8,0],[Math.cos(a)*1.7,.5,Math.sin(a)*1.3]]} color="#ffbcb5" transparent opacity={.45} lineWidth={1}/>;})}</group>}{props.mode==='complete'&&wellnessNames.map((name,i)=>{const a=i*Math.PI*2/5;return <WellnessAsset key={name} name={name} scale={.34} position={[Math.cos(a)*2.1,.65+Math.sin(a)*.35,Math.sin(a)*1.75]}/>;})}</>;
}
''' +s[pos:]
s=s.replace('<Mascot {...props}/><ContextMonitor','<StoryObjects key={props.mode} {...props}/><ContextMonitor')
p.write_text(s,encoding='utf-8')
