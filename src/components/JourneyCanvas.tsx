import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** A single ambient surface. Motion values update paint without React renders. */
export function JourneyCanvas(){
 const target=useRef<HTMLDivElement>(null);
 const {scrollYProgress}=useScroll();
 const backgroundColor=useTransform(scrollYProgress,[0,.09,.2,.31,.42,.53,.72,1],['#e0e7f6','#e2e6f5','#e7e1f0','#f1e3df','#e2ece5','#e9ecdf','#ece9de','#f1eadc']);
 return <motion.div ref={target} className="journey-canvas" style={{backgroundColor}} aria-hidden="true"><div className="journey-bloom bloom-lilac"/><div className="journey-bloom bloom-peach"/><svg className="journey-grain" width="100%" height="100%"><filter id="journey-grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#journey-grain)" opacity=".035"/></svg></motion.div>;
}
