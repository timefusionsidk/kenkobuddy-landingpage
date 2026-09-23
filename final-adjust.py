from pathlib import Path
p=Path('src/components/KenkoStage.tsx');s=p.read_text(encoding='utf-8-sig').replace("ready&&render3D?'is-hidden'", "ready&&render3D&&visible&&pageVisible?'is-hidden'");p.write_text(s,encoding='utf-8')
p=Path('src/components/KenkoCanvas.tsx');s=p.read_text(encoding='utf-8-sig');a=s.index('function StoryObjects(')
s=s[:a]+'''function WellnessOrbit(){const ref=useRef<THREE.Group>(null);useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=clock.elapsedTime*.045;});return <group ref={ref}>{wellnessNames.map((name,i)=>{const a=i*Math.PI*2/5;return <WellnessAsset key={name} name={name} scale={.32} position={[Math.cos(a)*2.05,.75+Math.sin(a)*.25,Math.sin(a)*1.7]}/>;})}</group>;}
'''+s[a:]
a=s.index("{props.mode==='complete'&&wellnessNames.map(");b=s.index('</>;',a)
s=s[:a]+"{props.mode==='complete'&&<WellnessOrbit/>}"+s[b:]
p.write_text(s,encoding='utf-8')
p=Path('src/App.tsx');s=p.read_text(encoding='utf-8-sig').replace('<nav aria-label="Main navigation"', '<nav id="main-navigation" aria-label="Main navigation"').replace('aria-expanded={menu} onClick', 'aria-expanded={menu} aria-controls="main-navigation" onKeyDown={e=>{if(e.key===\'Escape\')setMenu(false);}} onClick').replace('<span>{s.label}</span></button>', '<span>{s.label}<small>{s.statement}</small></span></button>');p.write_text(s,encoding='utf-8')
