export type Checkin = { hours: number; quality: number; energy: number; mood: number; stress: number; water: number; soreness: number };
export const initialCheckin: Checkin = { hours: 7, quality: 4, energy: 4, mood: 4, stress: 2, water: 1.6, soreness: 2 };
export function deriveDay(v: Checkin) {
  const recovery = v.hours < 6 || v.energy <= 2 || v.soreness >= 4;
  const score = Math.round(Math.max(0, Math.min(100, Math.min(v.hours / 8, 1) * 25 + v.quality * 3 + v.energy * 3 + v.mood * 3 + (6 - v.stress) * 2 + Math.min(v.water / 2, 1) * 10 + (6 - v.soreness) * 2)));
  return {
    score, recovery,
    focus: recovery ? 'Make room for recovery.' : v.stress >= 4 ? 'A little space to reset.' : 'Keep your good rhythm going.',
    workout: recovery ? '15-minute mobility & recovery' : '30-minute full-body strength',
    explanation: recovery ? 'Your sleep, energy or soreness suggests a gentler day. Keep your routine light and give yourself time to recover.' : v.stress >= 4 ? 'Your energy is steady, but stress is elevated. A short walk and a quiet break could be useful today.' : 'Your sleep and energy support comfortable movement today. Pair it with regular meals, hydration and a consistent bedtime.',
    hydration: v.water < 1 ? 'Keep water within reach. Try a glass with your next meal.' : 'You have logged water today. Keep checking in with thirst and your routine.',
  };
}
export const signals = [
  { id: 'Movement', label: 'Movement', icon: 'activity', color: '#bfe8d1', statement: 'Choose activity that matches your energy.' },
  { id: 'Nutrition', label: 'Nutrition', icon: 'leaf', color: '#f5c6a8', statement: 'Turn your preferences into practical meals.' },
  { id: 'Hydration', label: 'Hydration', icon: 'drop', color: '#afcff4', statement: 'Stay aware of your daily hydration rhythm.' },
  { id: 'Sleep', label: 'Sleep', icon: 'moon', color: '#d6c4f2', statement: 'Understand how recovery affects your day.' },
  { id: 'Recovery', label: 'Recovery', icon: 'heart', color: '#f4d77c', statement: 'Connect mood, stress, and energy.' },
] as const;
export type Signal = typeof signals[number]['id'];
export const chapters = [
  { tag: '01 / THE WHOLE PICTURE', title: 'SEE THE\nWHOLE YOU.', text: 'Your habits do not happen separately. KenkoBuddy helps you understand how they affect one another.', signal: null, color: '#e2e8f7' },
  { tag: '02 / DAILY CHECK-IN', title: 'HOW DO\nYOU FEEL?', text: 'A little context makes the next step more personal. Start with where you are today.', signal: 'Recovery', color: '#efe5f3' },
  { tag: '03 / SMART NUTRITION', title: 'EAT WITH\nINTENTION.', text: 'Everyday ingredients. Meals that fit your preferences. A plan you can actually cook.', signal: 'Nutrition', color: '#f7e4d9' },
  { tag: '04 / THOUGHTFUL MOVEMENT', title: 'MOVE FOR\nTODAY.', text: 'Some days call for strength. Others, a little gentleness. Your plan should know the difference.', signal: 'Movement', color: '#dcece4' },
  { tag: '05 / SLEEP & RECOVERY', title: 'REST IS\nPROGRESS.', text: 'Recovery belongs in the picture. KenkoBuddy considers it before suggesting what comes next.', signal: 'Sleep', color: '#d8dcef' },
  { tag: '06 / YOUR AI COMPANION', title: 'ASK. ADAPT.\nGROW.', text: 'Meals, movement, rest. Turn a question into an achievable plan, with the context that matters to you.', signal: null, color: '#ede6ef' },
  { tag: '07 / CONNECTED PROGRESS', title: 'BETTER DAYS,\nBUILT GENTLY.', text: 'A glass of water. A good night. A small walk. See the story your everyday actions are building.', signal: null, color: '#e7eadb' },
] as const;
export type Recipe = { name: string; category: string; time: number; kcal: number; protein: number; carbs: number; fat: number; fiber: number; tag: string; ingredients: string[]; steps: string[]; substitution: string; tip: string };
export const recipes: Recipe[] = [
 { name:'Protein dosa bowl',category:'Breakfast',time:20,kcal:520,protein:28,carbs:65,fat:16,fiber:9,tag:'Vegetarian',ingredients:['2 small dosas','100 g paneer','½ cup cooked lentils','Tomato','Coriander'],steps:['Warm the dosas in a pan.','Sauté crumbled paneer with tomato.','Serve with lentils and coriander.'],substitution:'Swap paneer for tofu.',tip:'Use a non-stick pan to keep the dosa crisp.' },
 { name:'Paneer millet plate',category:'Lunch',time:25,kcal:550,protein:30,carbs:61,fat:21,fiber:8,tag:'Vegetarian',ingredients:['¾ cup cooked millet','100 g paneer','Mixed vegetables','Cumin'],steps:['Cook millet until fluffy.','Sauté paneer and vegetables with cumin.','Serve together with a squeeze of lemon.'],substitution:'Use tofu in place of paneer.',tip:'Rest cooked millet for 5 minutes before fluffing.' },
 { name:'Chickpea sundal bowl',category:'Lunch',time:15,kcal:420,protein:18,carbs:58,fat:13,fiber:13,tag:'Vegan',ingredients:['1 cup cooked chickpeas','Grated coconut','Curry leaves','Mustard seeds'],steps:['Temper mustard seeds and curry leaves in a little oil.','Add cooked chickpeas and stir.','Finish with coconut and lemon.'],substitution:'Use cooked white peas instead.',tip:'Rinse canned chickpeas thoroughly.' },
 { name:'Egg and vegetable rice',category:'Dinner',time:20,kcal:510,protein:25,carbs:65,fat:17,fiber:6,tag:'Egg-based',ingredients:['¾ cup cooked rice','2 eggs','Tomato','Onion','Mixed vegetables'],steps:['Sauté onion and tomato.','Add vegetables and cook until tender.','Scramble the eggs, then fold through the rice.'],substitution:'Use crumbled tofu instead of eggs.',tip:'Cook eggs until the whites and yolks are set.' },
 { name:'Banana oat breakfast',category:'Breakfast',time:10,kcal:390,protein:16,carbs:59,fat:10,fiber:8,tag:'Vegetarian',ingredients:['½ cup oats','200 ml milk','1 banana','1 tbsp seeds'],steps:['Simmer oats with milk.','Slice banana over the porridge.','Finish with seeds.'],substitution:'Use fortified soy milk.',tip:'Add extra water for a softer texture.' },
 { name:'Curd rice recovery bowl',category:'Dinner',time:10,kcal:400,protein:15,carbs:62,fat:10,fiber:4,tag:'Vegetarian',ingredients:['¾ cup cooked rice','150 g curd','Cucumber','Curry leaves'],steps:['Cool freshly cooked rice promptly.','Mix with curd and diced cucumber.','Add lightly tempered curry leaves.'],substitution:'Use unsweetened plant-based yogurt.',tip:'Refrigerate promptly; serve chilled.' },
];
export const weekly = [62,68,65,76,73,80,82];
