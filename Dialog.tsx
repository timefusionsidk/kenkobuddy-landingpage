import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
export function Dialog({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const prior=document.activeElement as HTMLElement|null;const el=ref.current;el?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{el?.close();document.body.style.overflow=old;prior?.focus();};},[]);
 return <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="dialog-inner"><button className="icon-button close-dialog" onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button><p className="eyebrow">KENKOBUDDY</p><h2 id="dialog-title">{title}</h2>{children}</div></dialog>;
}
