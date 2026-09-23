from pathlib import Path
p=Path('src/App.tsx');s=p.read_text().replace("import { signals }", "import { initialCheckin, signals }");s=s.replace("import { KenkoStage } from './components/KenkoStage';", "import { KenkoStage } from './components/KenkoStage';\nimport { ScrollStory } from './components/ScrollStory';")
s=s.replace('const [selected,setSelected]', 'const [value,setValue]=useState(initialCheckin);\n const [selected,setSelected]');s=s.replace('</div></main>{message', '</div><ScrollStory value={value} setValue={setValue}/></main>{message');p.write_text(s,encoding='utf-8')
p=Path('src/lib/content.ts');s=p.read_text().replace('water: 1.2','water: 1.6');p.write_text(s,encoding='utf-8')
