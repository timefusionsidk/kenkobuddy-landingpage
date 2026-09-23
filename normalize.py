from pathlib import Path
for p in Path('src').rglob('*'):
 if p.suffix not in ['.tsx','.ts']:continue
 s=p.read_text(encoding='utf-8-sig')
 if 'â' in s or 'Ã' in s:
  try:s=s.encode('cp1252').decode('utf-8');p.write_text(s,encoding='utf-8');print('Normalized',p)
  except UnicodeError:pass
