from pathlib import Path
p=Path('src/App.tsx');s=p.read_text(encoding='utf-8-sig');s=s.replace("import { Icon } from './components/Icon';","import { Icon } from './components/Icon';\nimport { KenkoStage } from './components/KenkoStage';\nimport { signals } from './lib/content';\nimport type { Signal } from './lib/content';")
s=s.replace("const [menu,setMenu]", "const [selected,setSelected]=useState<Signal|null>(null);\n const [menu,setMenu]")
a=s.index('<img className="hero-kenko"');b=s.index('<div className="hero-bottom">',a)
s=s[:a]+'''<div className="hero-kenko"><KenkoStage selected={selected}/></div>{signals.map((s,i)=><button key={s.id} className={`symbol signal-${i}`} style={{background:s.color}} aria-label={`${s.label}: ${s.statement}`} aria-pressed={selected===s.id} onMouseEnter={()=>setSelected(s.id)} onFocus={()=>setSelected(s.id)} onClick={()=>setSelected(s.id)}><Icon name={s.icon}/><span>{s.label}</span></button>)}'''+s[b:]
s=s.replace('<span>EVERY PART OF YOU, CONNECTED</span><p>Your daily wellness signals, brought together to help you take the next useful step.</p>', '<span>{signals.find(s=>s.id===selected)?.label??"EVERY PART OF YOU, CONNECTED"}</span><p aria-live="polite">{signals.find(s=>s.id===selected)?.statement??"Your daily wellness signals, brought together to help you take the next useful step."}</p>')
p.write_text(s,encoding='utf-8')
