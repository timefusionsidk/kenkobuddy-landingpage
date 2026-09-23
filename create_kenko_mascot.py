"""Rebuild Kenko in Blender 5: blender -b --python scripts/blender/create_kenko_mascot.py
Creates named mesh parts, a compact GLB, editable .blend and transparent fallback.
All dimensions are metres; +Z is up, Kenko faces +X. No external textures.
"""
import bpy, math, os
from mathutils import Vector
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
for folder in ['design','public/models','public/images']:
    os.makedirs(os.path.join(ROOT, folder), exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, roughness=.48):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Roughness'].default_value=roughness
    return m
cream=material('Warm porcelain',(0.83,.88,.75))
under=material('Shell rim - deep sage',(.25,.36,.31))
ink=material('Eyes - obsidian',(.012,.022,.021),.2)
coral=material('Heart - soft coral',(.92,.31,.28),.33)
coral.node_tree.nodes.get('Principled BSDF').inputs['Emission Color'].default_value=(.5,.08,.06,1)
coral.node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value=.12
colors=[('Movement',(.50,.78,.64)),('Nutrition',(.94,.66,.47)),('Hydration',(.47,.70,.91)),('Sleep',(.67,.54,.83)),('Recovery',(.94,.80,.37))]
parts=[]
def uv(name,loc,scale,mat,seg=32,rings=20,rot=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale
    if rot:o.rotation_euler=rot
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    parts.append(o); return o
body=uv('Kenko_Body',(0,0,.19),(1.38,1.04,.42),cream)
uv('Kenko_Shell_Core',(0,0,.49),(1.48,1.11,.35),under)
uv('Kenko_Head',(1.53,-.18,.62),(.65,.53,.58),cream)
uv('Kenko_Neck',(1.05,-.09,.33),(.64,.45,.39),cream)
uv('Kenko_Eye_Left',(1.76,-.652,.78),(.105,.057,.14),ink,24,14)
uv('Kenko_Eye_Right',(1.99,.151,.8),(.069,.068,.12),ink,24,14)
uv('Kenko_Eye_Glint_Left',(1.783,-.697,.825),(.027,.019,.032),material('Eye glint',(.98,.98,.91)),16,8)
uv('Kenko_Eye_Glint_Right',(2.035,.128,.842),(.017,.018,.021),bpy.data.materials['Eye glint'],16,8)
for name,loc,sc,angle in [
 ('FrontLeg_Left',(.77,-1.03,-.03),(.4,.71,.20),-.52),
 ('FrontLeg_Right',(.85,.91,-.02),(.39,.65,.20),.52),
 ('BackLeg_Left',(-.93,-.83,-.08),(.38,.60,.18),.55),
 ('BackLeg_Right',(-.99,.74,-.08),(.35,.55,.18),-.55)]:
    uv('Kenko_'+name,loc,sc,cream,32,16,(0,.08,angle))
uv('Kenko_Tail',(-1.40,0,.11),(.51,.22,.14),cream,24,12)
# Five solid, softly bevelled radial shell panels. Shared dome keeps a continuous silhouette.
for idx,(label,c) in enumerate(colors):
    vertices=[]; faces=[]; n=20; nr=10
    center=2*math.pi*idx/5 + .16
    for j in range(nr+1):
        r=.20+.80*j/nr
        for i in range(n+1):
            a=center + (i/n-.5)*(2*math.pi/5-.047)
            vertices.append((1.48*r*math.cos(a),1.10*r*math.sin(a),.57+.98*math.sqrt(max(0,1-r*r))))
    for j in range(nr):
        for i in range(n):
            v=j*(n+1)+i; faces.append((v,v+1,v+n+2,v+n+1))
    mesh=bpy.data.meshes.new('Panel_'+label);mesh.from_pydata(vertices,[],faces);mesh.update()
    o=bpy.data.objects.new('Kenko_Shell_'+label,mesh);bpy.context.collection.objects.link(o)
    o.data.materials.append(material('Panel '+label,c,.38))
    for p in mesh.polygons:p.use_smooth=True
    bpy.context.view_layer.objects.active=o;o.select_set(True)
    mod=o.modifiers.new('Panel thickness','SOLIDIFY');mod.thickness=.085
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bevel=o.modifiers.new('Soft panel edge','BEVEL');bevel.width=.035;bevel.segments=3
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    o.select_set(False);parts.append(o)
uv('Kenko_Heart_Setting',(0,-.12,1.45),(.48,.48,.15),under,32,16)
# Heart outline, filled and extruded, set into the shell like a ceramic inlay.
verts=[]; count=64
for i in range(count):
    t=2*math.pi*i/count
    x=16*math.sin(t)**3/43
    y=(13*math.cos(t)-5*math.cos(2*t)-2*math.cos(3*t)-math.cos(4*t))/43
    verts.append((x,y-.12,1.62))
mesh=bpy.data.meshes.new('Heart silhouette');mesh.from_pydata(verts,[],[tuple(reversed(range(count)))]);mesh.update()
o=bpy.data.objects.new('Kenko_Heart',mesh);bpy.context.collection.objects.link(o);o.data.materials.append(coral)
bpy.context.view_layer.objects.active=o;o.select_set(True)
m=o.modifiers.new('Inlay depth','SOLIDIFY');m.thickness=.09;bpy.ops.object.modifier_apply(modifier=m.name)
m=o.modifiers.new('Rounded heart','BEVEL');m.width=.05;m.segments=3;bpy.ops.object.modifier_apply(modifier=m.name)
for p in o.data.polygons:p.use_smooth=True
parts.append(o)
# Export only character meshes; keep studio separate from the web asset.
bpy.ops.object.select_all(action='DESELECT')
root=bpy.data.objects.new('Kenko_Root',None);bpy.context.collection.objects.link(root)
for obj in parts: obj.parent=root;obj.select_set(True)
root.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT,'public/models/kenko-mascot.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_texcoords=False,export_normals=True,export_yup=True)
# Editable animation examples, recreated in R3F at runtime to allow scroll scrubbing.
root.scale=(1,1,1);root.keyframe_insert(data_path='scale',frame=1)
root.scale=(1.012,1.012,1.024);root.keyframe_insert(data_path='scale',frame=60)
root.scale=(1,1,1);root.keyframe_insert(data_path='scale',frame=120)
root.animation_data.action.name='Idle_Breathe'
scene=bpy.context.scene;scene.frame_set(1);scene.frame_end=120
world=bpy.data.worlds.new('Kenko Studio') if not bpy.data.worlds else bpy.data.worlds[0];scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.72,.77,.88,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.35

def area(name,loc,power,color,size):
    bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.name=name;l.data.energy=power;l.data.color=color;l.data.shape='DISK';l.data.size=size;l.rotation_euler=(Vector((0,0,.5))-l.location).to_track_quat('-Z','Y').to_euler()
area('Studio_Key',(-3,-4,7),650,(1,.92,.82),5)
area('Studio_Lavender_Fill',(3,4,4),450,(.74,.79,1),4)
area('Studio_Rim',(0,1,6),500,(1,.83,.69),3)
bpy.ops.object.camera_add(location=(4.1,-6.8,5.3))
cam=bpy.context.object;cam.name='Studio_Camera';cam.rotation_euler=(Vector((.15,0,.5))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=5.7;scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
scene.render.resolution_x=1000;scene.render.resolution_y=850;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.filepath=os.path.join(ROOT,'public/images/kenko-fallback.png')
scene.view_settings.view_transform='AgX'
# Useful first-open view in Blender.
for screen in bpy.data.screens:
 for ar in screen.areas:
  if ar.type=='VIEW_3D':
   ar.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'design/kenko-mascot.blend'))
bpy.ops.render.render(write_still=True)
print('KENKO_GLB_BYTES',os.path.getsize(os.path.join(ROOT,'public/models/kenko-mascot.glb')))
