from pathlib import Path
import struct,json
stats=[]
for p in Path('public/models').glob('*.glb'):
 data=p.read_bytes();size,kind=struct.unpack_from('<II',data,12);doc=json.loads(data[20:20+size]);accessors=doc.get('accessors',[]);tris=0
 for m in doc.get('meshes',[]):
  for q in m['primitives']:
   if 'indices' in q:tris+=accessors[q['indices']]['count']//3
 stats.append({'file':p.name,'bytes':len(data),'triangles':tris,'meshes':len(doc.get('meshes',[])),'textures':len(doc.get('textures',[]))})
Path('design/asset-manifest.json').write_text(json.dumps(stats,indent=2),encoding='utf-8');print(json.dumps(stats,indent=2))
