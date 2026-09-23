from PIL import Image,ImageDraw
from pathlib import Path
folder=Path('public/images');names=['hydration','nutrition','movement','recovery','intelligence'];sheet=Image.new('RGB',(1250,300),'#e2e8f7')
for i,n in enumerate(names):
 im=Image.open(folder/f'{n}-fallback.png');im.save(folder/f'{n}-fallback.webp',quality=88,method=6);im.thumbnail((245,250));sheet.paste(im,(i*250,0),im);ImageDraw.Draw(sheet).text((i*250+60,265),n,fill='#171b25')
sheet.save('work/wellness-assets.jpg')
