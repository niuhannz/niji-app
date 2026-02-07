import type { Short, Project, Scene, Character, Comment } from './types'

export const SHORTS: Short[] = [
  { id:'1', title:'Moonlit Duel', titleJP:'月光の決闘', creator:'AkiraStudio', avatar:'A', views:'2.4M', likes:'189K', duration:'3:42', genre:'Action', color1:'#ff2d78', color2:'#a855f7', isHot:true },
  { id:'2', title:'Cherry Blossom Express', titleJP:'桜エクスプレス', creator:'SakuraManga', avatar:'S', views:'1.8M', likes:'142K', duration:'4:15', genre:'Romance', color1:'#ff8fab', color2:'#ffc2d1', isNew:true },
  { id:'3', title:'Neon Ronin', titleJP:'ネオン浪人', creator:'CyberInk', avatar:'C', views:'3.1M', likes:'256K', duration:'2:58', genre:'Sci-Fi', color1:'#00d4ff', color2:'#a855f7', isHot:true },
  { id:'4', title:'Spirit Garden', titleJP:'精霊の庭', creator:'MiyaArt', avatar:'M', views:'980K', likes:'87K', duration:'5:20', genre:'Fantasy', color1:'#00ffaa', color2:'#00d4ff' },
  { id:'5', title:'Ramen Wars', titleJP:'ラーメン戦争', creator:'FoodAnime', avatar:'F', views:'4.2M', likes:'340K', duration:'2:30', genre:'Comedy', color1:'#ff6b2b', color2:'#ffd600', isHot:true },
  { id:'6', title:'Shadow Protocol', titleJP:'影のプロトコル', creator:'DarkFrame', avatar:'D', views:'1.5M', likes:'120K', duration:'3:55', genre:'Thriller', color1:'#6366f1', color2:'#14b8a6' },
  { id:'7', title:'Starlight Academy', titleJP:'星光学園', creator:'LumiDream', avatar:'L', views:'2.8M', likes:'210K', duration:'4:45', genre:'Slice of Life', color1:'#f59e0b', color2:'#ff2d78' },
  { id:'8', title:'Mech Requiem', titleJP:'メカレクイエム', creator:'IronForge', avatar:'I', views:'1.2M', likes:'95K', duration:'6:10', genre:'Mecha', color1:'#ef4444', color2:'#7c3aed' },
  { id:'9', title:'Whispers of Edo', titleJP:'江戸の囁き', creator:'HistoriaJP', avatar:'H', views:'670K', likes:'56K', duration:'5:00', genre:'Historical', color1:'#d4a574', color2:'#8b5e3c', isNew:true },
  { id:'10', title:'Pixel Hearts', titleJP:'ピクセルハート', creator:'RetroWave', avatar:'R', views:'890K', likes:'78K', duration:'3:12', genre:'Romance', color1:'#ec4899', color2:'#f472b6' },
  { id:'11', title:'Dragon Summit', titleJP:'竜の頂上', creator:'MythForge', avatar:'M', views:'5.1M', likes:'420K', duration:'7:30', genre:'Fantasy', color1:'#dc2626', color2:'#f97316', isHot:true },
  { id:'12', title:'Cybernetic Dream', titleJP:'電脳夢', creator:'NeoTokyo', avatar:'N', views:'1.9M', likes:'155K', duration:'4:02', genre:'Sci-Fi', color1:'#06b6d4', color2:'#8b5cf6' },
]

export const GENRES = ['All','Action','Romance','Sci-Fi','Fantasy','Comedy','Thriller','Mecha','Slice of Life','Historical']

export const INITIAL_PROJECTS: Project[] = [
  { id:'p1', title:'Midnight Samurai EP.3', scenes:12, duration:'4:30', status:'draft', color1:'#ff2d78', color2:'#a855f7', lastEdited:'2 hours ago' },
  { id:'p2', title:'Neon City Chronicles', scenes:8, duration:'3:15', status:'rendering', progress:67, color1:'#00d4ff', color2:'#6366f1', lastEdited:'30 min ago' },
  { id:'p3', title:'Love in Spring EP.1', scenes:15, duration:'5:45', status:'published', color1:'#ff8fab', color2:'#fbbf24', lastEdited:'Yesterday' },
  { id:'p4', title:'Mecha Genesis', scenes:6, duration:'2:10', status:'draft', color1:'#ef4444', color2:'#f97316', lastEdited:'3 days ago' },
]

export const INITIAL_SCENES: Scene[] = [
  { id:1, label:'Intro', duration:4, color:'#ff2d78', visible:true },
  { id:2, label:'Dialogue A', duration:6, color:'#a855f7', visible:true },
  { id:3, label:'Action', duration:8, color:'#00d4ff', visible:true },
  { id:4, label:'Flashback', duration:5, color:'#ffd600', visible:true },
  { id:5, label:'Climax', duration:10, color:'#ff6b2b', visible:true },
  { id:6, label:'Dialogue B', duration:4, color:'#00ffaa', visible:true },
  { id:7, label:'Resolution', duration:6, color:'#6366f1', visible:true },
  { id:8, label:'End Credits', duration:3, color:'#f472b6', visible:true },
]

export const INITIAL_CHARACTERS: Character[] = [
  { id:'c1', name:'Akira', role:'Protagonist', color:'#ff2d78', traits:['Brave','Hot-headed','Loyal'], expression:'neutral', pose:'standing', description:'A young warrior with crimson eyes and silver hair, wearing a tattered black coat. Carries a legendary katana.' },
  { id:'c2', name:'Yuki', role:'Support', color:'#00d4ff', traits:['Calm','Strategic','Mysterious'], expression:'neutral', pose:'standing', description:'An ice mage with pale blue hair and crystalline eyes. Wears flowing white robes embroidered with frost patterns.' },
  { id:'c3', name:'Ren', role:'Antagonist', color:'#a855f7', traits:['Cunning','Charming','Complex'], expression:'neutral', pose:'standing', description:'A dark prince with violet eyes and jet-black hair. Wears ornate armor with glowing purple runes.' },
  { id:'c4', name:'Hana', role:'Comic Relief', color:'#ffd600', traits:['Energetic','Clumsy','Kind'], expression:'neutral', pose:'standing', description:'A cheerful inventor with messy golden hair and oversized goggles. Always carrying gadgets and snacks.' },
]

export const INITIAL_COMMENTS: Comment[] = [
  { id:'cm1', user:'YukiArt', text:'The fight choreography is absolutely insane in this one!', time:'2h', likes:342, liked:false },
  { id:'cm2', user:'OtakuKing', text:'Best episode so far. The animation quality keeps improving.', time:'4h', likes:218, liked:false },
  { id:'cm3', user:'NightOwl', text:'That plot twist at 2:30 had me shook', time:'5h', likes:156, liked:false },
  { id:'cm4', user:'SakuraFan', text:'Can we talk about the soundtrack though? Pure art.', time:'8h', likes:89, liked:false },
  { id:'cm5', user:'MangaLover', text:'The way they animated the rain drops... perfection.', time:'12h', likes:67, liked:false },
  { id:'cm6', user:'AnimeDaily', text:'This creator just keeps getting better. Subscribed!', time:'1d', likes:45, liked:false },
]

export const CREATORS = [
  { name:'MythForge', followers:'2.1M', works:48, color:'#ff2d78', avatar:'M', bio:'Epic fantasy storyteller' },
  { name:'CyberInk', followers:'1.8M', works:35, color:'#00d4ff', avatar:'C', bio:'Cyberpunk narratives' },
  { name:'SakuraManga', followers:'1.5M', works:62, color:'#ff8fab', avatar:'S', bio:'Romance & slice of life' },
  { name:'AkiraStudio', followers:'1.2M', works:28, color:'#a855f7', avatar:'A', bio:'Action choreographer' },
  { name:'NeoTokyo', followers:'980K', works:41, color:'#6366f1', avatar:'N', bio:'Futuristic worlds' },
]

export const EXPRESSIONS = ['neutral','happy','angry','sad','shocked','smirk','blush','determined'] as const
export const POSES = ['standing','action','sitting','running','flying','dramatic'] as const
export const ART_STYLES = [
  { id:'cinematic', label:'Cinematic', color:'#ff2d78', desc:'Film-quality dramatic lighting' },
  { id:'manga', label:'Manga', color:'#a855f7', desc:'Classic manga screentone aesthetic' },
  { id:'watercolor', label:'Watercolor', color:'#00d4ff', desc:'Soft painted brush strokes' },
  { id:'cel-shade', label:'Cel Shade', color:'#00ffaa', desc:'Bold flat cel animation' },
  { id:'realistic', label:'Realistic', color:'#f59e0b', desc:'Photo-real character rendering' },
  { id:'pixel', label:'Pixel Art', color:'#ec4899', desc:'Retro 16-bit pixel style' },
] as const
