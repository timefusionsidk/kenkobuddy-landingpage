"""Reproducible texture-free wellness set. Blender 5+.
Run: blender -b --python scripts/blender/create_wellness_assets.py
Exports five independent GLBs, matching .blend studios, transparent PNG fallbacks.
"""
import bpy, math, os
from mathutils import Vector
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../..'))
def mat(name,color,rough=.42,trans=0,glow=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=(*color,1);b.inputs['Roughness'].default_value=rough;b.inputs['Transmission Weight'].default_value=trans;b.inputs['IOR'].default_value=1.33;b.inputs['Emission Color'].default_value=(*color,1);b.inputs['Emission Strength'].default_value=glow;return m
def smooth(o,name,material):
 o.name=name;o.data.materials.append(material)
 if o.type=='MESH':
  for f in o.data.polygons:f.use_smooth=True
 return o
def sphere(name,loc,scale,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,location=loc);o=bpy.context.object;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return smooth(o,name,material)
def torus(name,loc,radius,thickness,material,rot=(0,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_radius=radius,minor_radius=thickness,major_segments=48,minor_segments=8,location=loc,rotation=rot);return smooth(bpy.context.object,name,material)
def lathe(name,profile,material):
 verts=[];faces=[];n=48
 for r,z in profile:
  for i in range(n):
   t=2*math.pi*i/n;verts.append((r*math.cos(t),r*math.sin(t),z))
 for j in range(len(profile)-1):
  for i in range(n):
   a=j*n+i;b=j*n+(i+1)%n;faces.append((a,b,b+n,a+n))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return smooth(o,name,material)
def polygon(name,points,material,depth=.16):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(points,[],[tuple(range(len(points)))]);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);m=o.modifiers.new('Depth','SOLIDIFY');m.thickness=depth;bpy.ops.object.modifier_apply(modifier=m.name);m=o.modifiers.new('Soft edges','BEVEL');m.width=.065;m.segments=3;bpy.ops.object.modifier_apply(modifier=m.name);o.select_set(False);return smooth(o,name,material)
def studio(name):
 objs=[o for o in bpy.context.scene.objects if o.type=='MESH'];bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT,'public/models/'+name+'.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_texcoords=False)
 s=bpy.context.scene;s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.77,.88,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.4
 for loc,power,color,size in [((-3,-4,6),500,(1,.92,.82),5),((3,3,5),350,(.74,.79,1),4),((1,1,6),350,(1,.83,.72),3)]:
  bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.color=color;o.data.size=size;o.rotation_euler=(Vector((0,0,.55))-o.location).to_track_quat('-Z','Y').to_euler()
 bpy.ops.object.camera_add(location=(3,-5,3.5));o=bpy.context.object;o.rotation_euler=(Vector((0,0,.55))-o.location).to_track_quat('-Z','Y').to_euler();o.data.type='ORTHO';o.data.ortho_scale=4.4;s.camera=o
 s.render.engine='CYCLES';s.cycles.samples=20;s.cycles.use_denoising=True;s.render.resolution_x=800;s.render.resolution_y=680;s.render.resolution_percentage=100;s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.view_settings.view_transform='AgX';s.render.filepath=os.path.join(ROOT,'public/images/'+name+'-fallback.png')
 bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'design/'+name+'.blend'));bpy.ops.render.render(write_still=True)
 print('ASSET',name,os.path.getsize(os.path.join(ROOT,'public/models/'+name+'.glb')))
for name in ['hydration','nutrition','movement','recovery','intelligence']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 blue=mat('Water blue',(.40,.66,.90),.2,.32);cream=mat('Porcelain',(.92,.89,.81));mint=mat('Leaf mint',(.40,.70,.53));peach=mat('Peach',(.94,.57,.38));lilac=mat('Recovery lilac',(.64,.53,.82));yellow=mat('Soft gold',(.95,.79,.42));coral=mat('Coral heart',(.96,.40,.38),.3,0,.16)
 if name=='hydration':
  lathe('Hydration_Droplet',[(.65*math.sin(math.pi*t)*(1-.63*t),.18+1.75*t) for t in [i/36 for i in range(37)]],blue)
  for i in range(3):torus('Hydration_Ripple_'+str(i),(0,0,.06-i*.015),.52+i*.27,.028,blue)
 elif name=='nutrition':
  lathe('Nutrition_Bowl',[(0,.03),(.38,.03),(.73,.34),(.91,.62),(.90,.69),(.82,.69),(.76,.49),(.36,.15),(0,.15)],cream)
  sphere('Nutrition_Grain_Base',(0,0,.46),(.75,.75,.14),yellow)
  for i in range(7):
   a=i*2.4;sphere('Nutrition_Ingredient_'+str(i),(.48*math.cos(a),.48*math.sin(a),.60+(i%2)*.12),(.21,.18,.14),peach if i%2==0 else mint)
  for i in range(3):
   o=sphere('Nutrition_Leaf_'+str(i),(-.18+i*.19,.13,.82+i*.06),(.13,.31,.045),mint);o.rotation_euler=(.4,.35,i*.7)
 elif name=='movement':
  torus('Movement_Activity_Ring',(0,0,.94),.88,.15,mint,(math.pi/2,.24,0))
  torus('Movement_Inner_Ring',(0,.06,.94),.66,.024,cream,(math.pi/2,.24,0))
  sphere('Movement_Energy_Marker',(.73,-.12,1.42),(.19,.19,.19),peach)
  sphere('Movement_Platform',(0,0,-.02),(1.1,.58,.065),cream)
 elif name=='recovery':
  points=[(math.cos(math.radians(a)),0,math.sin(math.radians(a))+.98) for a in range(60,301,5)]
  for i in range(1,31):
   t=i/30;x=(1-t)**2*.5+2*(1-t)*t*(-.82)+t*t*.5;z=(1-t)*(-.866)+t*.866;points.append((x,0,z+.98))
  polygon('Recovery_Moon',points,lilac,.22)
  for i,(x,z,r) in enumerate([(-.15,.15,.35),(.2,.22,.43),(.55,.12,.32),(.78,.04,.20)]):sphere('Recovery_Cloud_'+str(i),(x,-.25,z),(r,.3,r*.65),cream)
 elif name=='intelligence':
  sphere('Intelligence_Core',(0,0,.9),(.55,.55,.55),mat('Frosted core',(.78,.67,.89),.3,.16,.04))
  pts=[]
  for i in range(64):
   t=2*math.pi*i/64;pts.append((16*math.sin(t)**3/45,-.53,(13*math.cos(t)-5*math.cos(2*t)-2*math.cos(3*t)-math.cos(4*t))/45+.98))
  polygon('Intelligence_Heart',pts,coral,.07)
  torus('Intelligence_Orbit_A',(0,0,.9),1,.018,mint,(.4,.35,0));torus('Intelligence_Orbit_B',(0,0,.9),1.15,.014,peach,(1.15,.3,.1))
  sphere('Intelligence_Satellite',(.9,-.2,1.32),(.10,.10,.10),yellow)
 studio(name)
