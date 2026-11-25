import { ColoringBook, ColoringPage, ImageResolution, AgeGroup } from '../types';

export function formatCoverTitle(childName: string, theme: string): string {
  const cleanName = childName.trim() || 'Little Artist';
  const cleanTheme = theme.trim() || 'Magical Adventures';
  return `${cleanName}'s ${cleanTheme}`;
}

export function buildPagePrompt(
  theme: string,
  sceneTitle: string,
  sceneDescription: string,
  ageGroup: AgeGroup = 'kids'
): string {
  const detailLevel =
    ageGroup === 'toddler'
      ? 'Very simple bold shapes, extra thick lines, wide spaces to color, minimal small details, toddler-friendly coloring page'
      : ageGroup === 'older'
      ? 'Clean bold black ink outlines, intricate background details, fun patterns, kid coloring book page'
      : 'Bold clear black outlines, fun whimsical shapes, balanced detail, perfect for crayons and markers';

  return `Children's coloring book page of ${sceneTitle} in a ${theme} theme. Scene: ${sceneDescription}. Black and white line art only, bold thick black contour outlines, pure white background, no grayscale, no shading, no halftone, no color, no solid black filled areas, crisp vector coloring page style, ${detailLevel}. Printable children's activity book illustration.`;
}

export function validateBookInput(
  childName: string,
  theme: string
): { isValid: boolean; error?: string } {
  if (!childName.trim()) {
    return { isValid: false, error: "Please enter the child's name." };
  }
  if (!theme.trim()) {
    return { isValid: false, error: 'Please enter a theme for the coloring book.' };
  }
  if (childName.trim().length > 30) {
    return { isValid: false, error: 'Name should be 30 characters or less.' };
  }
  if (theme.trim().length > 80) {
    return { isValid: false, error: 'Theme description should be 80 characters or less.' };
  }
  return { isValid: true };
}

// Crisp, high quality vector SVG coloring pages for instant demo and reliable fallback
export function getVectorLineArtSvg(pageIndex: number, theme: string, childName: string): string {
  const safeName = childName || 'Adventurer';
  
  const t = theme.toLowerCase();

  // Ocean Explorers SVG Set
  if (t.includes('ocean') || t.includes('sea') || t.includes('marine') || t.includes('submarine') || t.includes('fish')) {
    const oceanSvgs = [
      // Page 1: Happy Dolphin Submarine Explorer
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
        <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
        <!-- Sea Surface Waves & Sun -->
        <path d="M 20,80 Q 90,60 160,80 T 300,80 T 440,80 T 580,80" fill="none" stroke="#000" stroke-width="6"/>
        <circle cx="480" cy="140" r="35" fill="none" stroke="#000" stroke-width="6"/>
        <!-- Dolphin Submarine -->
        <path d="M 120,400 C 140,280 320,240 450,330 C 510,380 480,440 420,460 C 320,500 200,480 120,400 Z" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Porthole Window -->
        <circle cx="280" cy="370" r="45" fill="none" stroke="#000" stroke-width="8"/>
        <circle cx="280" cy="370" r="30" fill="none" stroke="#000" stroke-width="4" stroke-dasharray="8 8"/>
        <!-- Periscope & Propeller -->
        <path d="M 320,270 L 320,210 L 370,210" fill="none" stroke="#000" stroke-width="8"/>
        <ellipse cx="370" cy="210" rx="15" ry="8" fill="none" stroke="#000" stroke-width="6"/>
        <ellipse cx="110" cy="390" rx="15" ry="35" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Flukes & Fins -->
        <path d="M 460,420 C 510,410 540,430 550,470 C 520,460 480,480 440,455" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Bubbles -->
        <circle cx="100" cy="320" r="14" fill="none" stroke="#000" stroke-width="5"/>
        <circle cx="80" cy="270" r="20" fill="none" stroke="#000" stroke-width="5"/>
        <circle cx="115" cy="210" r="10" fill="none" stroke="#000" stroke-width="5"/>
        <!-- Sea Floor Coral & Shells -->
        <path d="M 20,680 Q 150,640 300,670 T 580,650 L 580,780 L 20,780 Z" fill="none" stroke="#000" stroke-width="8"/>
        <circle cx="150" cy="710" r="18" fill="none" stroke="#000" stroke-width="6"/>
        <circle cx="360" cy="720" r="25" fill="none" stroke="#000" stroke-width="6"/>
        <text x="300" y="745" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Dolphin Submarine dives into the turquoise deep!</text>
      </svg>`,
      // Page 2: Friendly Giant Octopus
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
        <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
        <!-- Octopus Head -->
        <path d="M 180,320 C 170,180 430,180 420,320 C 420,380 390,410 300,410 C 210,410 180,380 180,320 Z" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Eyes & Smile -->
        <circle cx="250" cy="290" r="18" fill="none" stroke="#000" stroke-width="6"/>
        <circle cx="254" cy="288" r="5" fill="#000"/>
        <circle cx="350" cy="290" r="18" fill="none" stroke="#000" stroke-width="6"/>
        <circle cx="354" cy="288" r="5" fill="#000"/>
        <path d="M 280,340 Q 300,360 320,340" fill="none" stroke="#000" stroke-width="6"/>
        <!-- Crown / Sailor Hat -->
        <path d="M 240,190 L 360,190 L 350,140 L 250,140 Z" fill="none" stroke="#000" stroke-width="7"/>
        <ellipse cx="300" cy="190" rx="70" ry="12" fill="none" stroke="#000" stroke-width="7"/>
        <!-- Tentacles with suction cups -->
        <path d="M 200,410 C 140,460 110,540 130,620 C 145,660 190,640 180,590 C 170,540 210,490 230,420" fill="none" stroke="#000" stroke-width="8"/>
        <circle cx="130" cy="530" r="10" fill="none" stroke="#000" stroke-width="5"/>
        <circle cx="140" cy="580" r="10" fill="none" stroke="#000" stroke-width="5"/>
        <path d="M 400,410 C 460,460 490,540 470,620 C 455,660 410,640 420,590 C 430,540 390,490 370,420" fill="none" stroke="#000" stroke-width="8"/>
        <circle cx="470" cy="530" r="10" fill="none" stroke="#000" stroke-width="5"/>
        <circle cx="460" cy="580" r="10" fill="none" stroke="#000" stroke-width="5"/>
        <text x="300" y="745" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Captain Ollie Octopus waves with eight happy arms!</text>
      </svg>`,
      // Page 3: Wise Sea Turtle over Coral Castle
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
        <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
        <!-- Sea Turtle Shell -->
        <ellipse cx="300" cy="380" rx="140" ry="110" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Shell Hexagon Pattern -->
        <polygon points="300,320 350,350 350,410 300,440 250,410 250,350" fill="none" stroke="#000" stroke-width="6"/>
        <!-- Head -->
        <path d="M 440,360 C 490,360 520,390 490,420 C 460,440 430,410 420,380" fill="none" stroke="#000" stroke-width="8"/>
        <circle cx="470" cy="385" r="7" fill="#000"/>
        <!-- Flippers -->
        <path d="M 370,300 C 420,210 470,190 460,250 C 440,300 400,340 360,330" fill="none" stroke="#000" stroke-width="8"/>
        <path d="M 230,300 C 180,210 130,190 140,250 C 160,300 200,340 240,330" fill="none" stroke="#000" stroke-width="8"/>
        <text x="300" y="745" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Gentle Sea Turtle glides across the coral reef!</text>
      </svg>`,
      // Page 4: Seahorse Lighthouse Keeper
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
        <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
        <!-- Seahorse Body -->
        <path d="M 270,220 C 320,180 370,220 340,270 C 310,310 340,360 330,440 C 310,540 240,620 280,680 C 300,710 260,730 240,690 C 220,640 260,560 270,470 C 275,410 250,340 240,280 Z" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Snout & Crown -->
        <path d="M 280,230 L 210,240 L 220,260 L 270,250" fill="none" stroke="#000" stroke-width="7"/>
        <circle cx="290" cy="220" r="8" fill="#000"/>
        <polygon points="310,180 325,150 340,180 355,155 365,185" fill="none" stroke="#000" stroke-width="6"/>
        <text x="300" y="745" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Little Seahorse sparkles in the magical kelp garden!</text>
      </svg>`,
      // Page 5: Sailor Whale Singing Starlight Songs
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
        <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
        <!-- Whale Body -->
        <path d="M 80,440 C 90,300 240,260 400,280 C 490,290 530,340 500,420 C 450,540 250,560 120,490 Z" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Belly Pleats -->
        <path d="M 200,490 Q 300,520 400,490" fill="none" stroke="#000" stroke-width="6"/>
        <path d="M 230,460 Q 320,490 420,460" fill="none" stroke="#000" stroke-width="6"/>
        <!-- Tail Fluke -->
        <path d="M 120,440 L 40,380 C 60,430 50,470 30,500 L 110,480" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Water Spout -->
        <path d="M 360,280 Q 380,180 430,160 M 360,280 Q 350,170 300,160 M 360,280 L 365,140" fill="none" stroke="#000" stroke-width="6"/>
        <text x="300" y="745" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Barnaby Whale spouts water fountains up to the moon!</text>
      </svg>`
    ];
    return `data:image/svg+xml;utf8,${encodeURIComponent(oceanSvgs[pageIndex % oceanSvgs.length])}`;
  }

  // Default: Space Dinosaurs Set
  const svgs = [
    // Page 1: T-Rex Astronaut Floating in Space
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
      <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
      <!-- Stars & Planets -->
      <circle cx="100" cy="120" r="35" fill="none" stroke="#000" stroke-width="6"/>
      <ellipse cx="100" cy="120" rx="55" ry="15" fill="none" stroke="#000" stroke-width="6" transform="rotate(-20 100 120)"/>
      <polygon points="480,90 495,120 530,125 505,150 512,185 480,168 448,185 455,150 430,125 465,120" fill="none" stroke="#000" stroke-width="6"/>
      <polygon points="120,400 130,420 155,423 137,440 142,465 120,453 98,465 103,440 85,423 110,420" fill="none" stroke="#000" stroke-width="5"/>
      <polygon points="470,520 480,540 505,543 487,560 492,585 470,573 448,585 453,560 435,543 460,540" fill="none" stroke="#000" stroke-width="5"/>
      <!-- T-Rex Astronaut -->
      <!-- Helmet -->
      <circle cx="300" cy="270" r="130" fill="none" stroke="#000" stroke-width="8"/>
      <circle cx="300" cy="270" r="110" fill="none" stroke="#000" stroke-width="4" stroke-dasharray="8 8"/>
      <!-- Head -->
      <path d="M 230,280 C 230,220 280,190 350,200 C 390,210 400,240 390,270 C 370,290 330,295 320,310 C 270,320 230,310 230,280 Z" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Eye -->
      <circle cx="330" cy="235" r="14" fill="none" stroke="#000" stroke-width="6"/>
      <circle cx="333" cy="233" r="4" fill="#000"/>
      <!-- Smile with teeth -->
      <path d="M 320,290 Q 350,295 375,275" fill="none" stroke="#000" stroke-width="6"/>
      <polygon points="330,290 338,280 345,291" fill="none" stroke="#000" stroke-width="4"/>
      <polygon points="350,289 358,278 365,286" fill="none" stroke="#000" stroke-width="4"/>
      <!-- Spacesuit Body -->
      <path d="M 220,380 C 180,450 190,560 250,590 C 280,605 320,605 360,580 C 400,550 420,440 380,380 Z" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Suit Collar -->
      <ellipse cx="300" cy="385" rx="70" ry="20" fill="none" stroke="#000" stroke-width="7"/>
      <!-- Suit Chest Badge -->
      <rect x="270" y="420" width="60" height="40" rx="8" fill="none" stroke="#000" stroke-width="6"/>
      <circle cx="285" cy="440" r="6" fill="none" stroke="#000" stroke-width="4"/>
      <line x1="300" y1="432" x2="320" y2="432" stroke="#000" stroke-width="5" stroke-linecap="round"/>
      <line x1="300" y1="444" x2="320" y2="444" stroke="#000" stroke-width="5" stroke-linecap="round"/>
      <!-- Tiny Arms -->
      <path d="M 360,430 C 410,430 420,470 380,475" fill="none" stroke="#000" stroke-width="7" stroke-linecap="round"/>
      <path d="M 365,465 C 385,480 375,505 355,490" fill="none" stroke="#000" stroke-width="7" stroke-linecap="round"/>
      <!-- Tail -->
      <path d="M 210,540 C 140,560 100,500 80,460 C 100,530 160,600 240,600" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Legs & Boots -->
      <path d="M 240,590 L 220,660 C 215,680 255,690 270,670 L 280,600" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 330,590 L 340,660 C 345,680 385,685 390,665 L 370,580" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Jetpack Bubbles -->
      <rect x="170" y="420" width="40" height="90" rx="15" fill="none" stroke="#000" stroke-width="7"/>
      <circle cx="150" cy="540" r="14" fill="none" stroke="#000" stroke-width="5"/>
      <circle cx="130" cy="570" r="20" fill="none" stroke="#000" stroke-width="5"/>
      <circle cx="110" cy="610" r="12" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Caption space -->
      <text x="300" y="730" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Captain T-Rex floats among the glittering cosmic stars!</text>
    </svg>`,

    // Page 2: Triceratops Driving a Moon Buggy Rover
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
      <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
      <!-- Moon Surface Craters -->
      <path d="M 20,620 Q 150,580 300,610 T 580,590 L 580,780 L 20,780 Z" fill="none" stroke="#000" stroke-width="8"/>
      <ellipse cx="120" cy="670" rx="40" ry="14" fill="none" stroke="#000" stroke-width="6"/>
      <ellipse cx="450" cy="660" rx="60" ry="18" fill="none" stroke="#000" stroke-width="6"/>
      <ellipse cx="280" cy="710" rx="35" ry="12" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Distant Earth & Sun -->
      <circle cx="480" cy="140" r="45" fill="none" stroke="#000" stroke-width="6"/>
      <path d="M 450,130 Q 480,120 495,145 Q 515,160 500,175" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Moon Rover Vehicle -->
      <!-- Wheels -->
      <circle cx="180" cy="570" r="55" fill="none" stroke="#000" stroke-width="8"/>
      <circle cx="180" cy="570" r="28" fill="none" stroke="#000" stroke-width="6"/>
      <line x1="180" y1="515" x2="180" y2="625" stroke="#000" stroke-width="6"/>
      <line x1="125" y1="570" x2="235" y2="570" stroke="#000" stroke-width="6"/>
      <circle cx="430" cy="570" r="55" fill="none" stroke="#000" stroke-width="8"/>
      <circle cx="430" cy="570" r="28" fill="none" stroke="#000" stroke-width="6"/>
      <line x1="430" y1="515" x2="430" y2="625" stroke="#000" stroke-width="6"/>
      <line x1="375" y1="570" x2="485" y2="570" stroke="#000" stroke-width="6"/>
      <!-- Chassis -->
      <path d="M 120,530 L 490,530 L 470,470 L 260,470 L 210,430 L 140,430 Z" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Antenna with dish -->
      <line x1="470" y1="470" x2="510" y2="360" stroke="#000" stroke-width="6"/>
      <ellipse cx="520" cy="350" rx="25" ry="10" fill="none" stroke="#000" stroke-width="6" transform="rotate(-30 520 350)"/>
      <!-- Triceratops in Rover -->
      <!-- Frill -->
      <path d="M 210,320 C 190,260 270,220 330,260 C 370,290 360,340 330,360" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Three Horns -->
      <path d="M 230,270 L 200,210 L 250,250" fill="none" stroke="#000" stroke-width="7"/>
      <path d="M 290,250 L 300,180 L 320,245" fill="none" stroke="#000" stroke-width="7"/>
      <path d="M 180,350 L 130,340 L 175,370" fill="none" stroke="#000" stroke-width="7"/>
      <!-- Snout & Beak -->
      <path d="M 200,340 C 170,360 160,380 180,410 C 200,430 240,420 250,380" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Eye & Smile -->
      <circle cx="240" cy="320" r="12" fill="none" stroke="#000" stroke-width="6"/>
      <circle cx="243" cy="318" r="4" fill="#000"/>
      <!-- Steering Wheel -->
      <ellipse cx="170" cy="410" rx="15" ry="30" fill="none" stroke="#000" stroke-width="7"/>
      <line x1="170" y1="440" x2="190" y2="470" stroke="#000" stroke-width="6"/>
      <!-- Caption space -->
      <text x="300" y="740" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Triceratops zooms across the bumpy lunar dunes!</text>
    </svg>`,

    // Page 3: Brachiosaurus Munching Meteor Leaves & Galaxy Trees
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
      <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
      <!-- Space Plant / Cosmic Tree -->
      <path d="M 460,780 C 470,550 490,380 470,250 C 450,140 370,110 390,70" fill="none" stroke="#000" stroke-width="10"/>
      <circle cx="490" cy="220" r="40" fill="none" stroke="#000" stroke-width="7"/>
      <circle cx="420" cy="180" r="45" fill="none" stroke="#000" stroke-width="7"/>
      <circle cx="470" cy="120" r="35" fill="none" stroke="#000" stroke-width="7"/>
      <circle cx="360" cy="120" r="30" fill="none" stroke="#000" stroke-width="6"/>
      <!-- Floating space crystals -->
      <polygon points="510,340 530,320 540,350 520,370" fill="none" stroke="#000" stroke-width="5"/>
      <polygon points="80,240 100,210 115,245 95,270" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Brachiosaurus with Long Neck -->
      <!-- Body & Legs -->
      <path d="M 100,680 C 80,560 140,500 240,510 C 310,520 340,580 320,680" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 120,680 L 115,750 C 115,770 160,770 160,750 L 165,680" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 270,680 L 265,750 C 265,770 310,770 310,750 L 315,680" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Tail -->
      <path d="M 90,560 C 50,580 30,640 40,700" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/>
      <!-- Huge Graceful Long Neck -->
      <path d="M 230,510 C 250,400 240,280 280,180 C 295,140 330,120 350,135" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 285,520 C 305,420 300,300 335,210 C 345,185 365,165 375,170" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Cute Head with Space Helmet -->
      <ellipse cx="365" cy="140" rx="35" ry="28" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Face -->
      <circle cx="360" cy="132" r="7" fill="#000"/>
      <path d="M 370,148 Q 385,152 395,142" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Cosmic Snack Leaf in Mouth -->
      <path d="M 390,145 Q 420,130 435,145 Q 410,165 390,145 Z" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Shooting star -->
      <line x1="80" y1="120" x2="220" y2="70" stroke="#000" stroke-width="6"/>
      <polygon points="220,70 200,65 210,85" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Caption space -->
      <text x="300" y="740" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Gentle Brachio reaches up to nibble glowing star-fruits!</text>
    </svg>`,

    // Page 4: Pterodactyl Rocketing Through Asteroid Field
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
      <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
      <!-- Asteroids -->
      <path d="M 80,180 Q 120,140 160,170 Q 180,220 140,250 Q 90,260 70,220 Z" fill="none" stroke="#000" stroke-width="7"/>
      <circle cx="110" cy="190" r="10" fill="none" stroke="#000" stroke-width="4"/>
      <circle cx="140" cy="220" r="8" fill="none" stroke="#000" stroke-width="4"/>
      <path d="M 440,540 Q 500,500 540,540 Q 560,600 510,640 Q 450,650 430,590 Z" fill="none" stroke="#000" stroke-width="7"/>
      <circle cx="470" cy="560" r="12" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Flying Pterodactyl -->
      <!-- Head and Crest -->
      <path d="M 300,280 L 370,210 C 375,230 365,260 340,285" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Long Beak -->
      <path d="M 300,280 L 210,310 L 290,325" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Eye -->
      <circle cx="295" cy="295" r="9" fill="none" stroke="#000" stroke-width="6"/>
      <circle cx="297" cy="294" r="3" fill="#000"/>
      <!-- Aviator Goggles -->
      <ellipse cx="295" cy="295" rx="16" ry="16" fill="none" stroke="#000" stroke-width="5"/>
      <path d="M 280,295 L 260,300" stroke="#000" stroke-width="5"/>
      <!-- Body & Rocket Pack -->
      <ellipse cx="320" cy="350" rx="35" ry="60" fill="none" stroke="#000" stroke-width="8" transform="rotate(25 320 350)"/>
      <!-- Twin Thrusters -->
      <rect x="340" y="320" width="30" height="70" rx="10" fill="none" stroke="#000" stroke-width="7" transform="rotate(25 340 320)"/>
      <!-- Jet Flames -->
      <path d="M 390,390 Q 450,420 480,450 Q 430,440 380,430" fill="none" stroke="#000" stroke-width="6"/>
      <path d="M 400,380 Q 440,395 460,420" fill="none" stroke="#000" stroke-width="5"/>
      <!-- Giant Wings -->
      <!-- Left Wing -->
      <path d="M 290,340 C 230,280 150,260 60,310 C 120,380 180,420 280,400" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 120,325 L 180,390" stroke="#000" stroke-width="5"/>
      <!-- Right Wing -->
      <path d="M 340,320 C 400,230 480,190 560,200 C 510,290 440,350 360,360" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 450,235 L 410,320" stroke="#000" stroke-width="5"/>
      <!-- Feet with Talons -->
      <path d="M 320,410 L 310,460 L 290,470" fill="none" stroke="#000" stroke-width="6"/>
      <path d="M 340,400 L 345,450 L 365,460" fill="none" stroke="#000" stroke-width="6"/>
      <!-- Caption space -->
      <text x="300" y="735" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Pterodactyl glides with rocket wings faster than light!</text>
    </svg>`,

    // Page 5: Stegosaurus Building a Space Station Base
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%" style="background:#fff">
      <rect x="20" y="20" width="560" height="760" fill="none" stroke="#000" stroke-width="8" rx="20"/>
      <!-- Space Station Dome & Modules -->
      <path d="M 60,560 C 60,390 200,320 320,330 C 440,340 520,440 530,560 Z" fill="none" stroke="#000" stroke-width="8"/>
      <circle cx="280" cy="420" r="40" fill="none" stroke="#000" stroke-width="7"/>
      <line x1="280" y1="380" x2="280" y2="460" stroke="#000" stroke-width="5"/>
      <line x1="240" y1="420" x2="320" y2="420" stroke="#000" stroke-width="5"/>
      <rect x="400" y="440" width="60" height="60" rx="10" fill="none" stroke="#000" stroke-width="6"/>
      <!-- Solar Panels -->
      <rect x="360" y="160" width="180" height="80" rx="8" fill="none" stroke="#000" stroke-width="7"/>
      <line x1="420" y1="160" x2="420" y2="240" stroke="#000" stroke-width="5"/>
      <line x1="480" y1="160" x2="480" y2="240" stroke="#000" stroke-width="5"/>
      <line x1="360" y1="200" x2="540" y2="200" stroke="#000" stroke-width="5"/>
      <line x1="450" y1="240" x2="430" y2="340" stroke="#000" stroke-width="6"/>
      <!-- Stegosaurus Builder -->
      <!-- Body -->
      <path d="M 140,640 C 130,550 200,500 320,510 C 420,520 460,580 440,660 Z" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Head with Construction Helmet -->
      <path d="M 140,590 C 90,600 70,620 90,650 C 110,670 150,660 160,630" fill="none" stroke="#000" stroke-width="8"/>
      <circle cx="110" cy="615" r="7" fill="#000"/>
      <!-- Hard Hat -->
      <ellipse cx="120" cy="590" rx="25" ry="12" fill="none" stroke="#000" stroke-width="6"/>
      <!-- Back Plates (Pentagon shape) -->
      <polygon points="190,520 205,460 230,470 220,520" fill="none" stroke="#000" stroke-width="6"/>
      <polygon points="245,510 265,440 295,450 280,510" fill="none" stroke="#000" stroke-width="6"/>
      <polygon points="310,510 335,430 365,445 350,515" fill="none" stroke="#000" stroke-width="6"/>
      <polygon points="380,525 405,460 430,475 410,535" fill="none" stroke="#000" stroke-width="6"/>
      <!-- Tail with 4 Spikes -->
      <path d="M 440,630 C 500,640 530,620 560,610" fill="none" stroke="#000" stroke-width="8"/>
      <line x1="530" y1="620" x2="550" y2="580" stroke="#000" stroke-width="6"/>
      <line x1="540" y1="625" x2="570" y2="595" stroke="#000" stroke-width="6"/>
      <line x1="540" y1="625" x2="555" y2="655" stroke="#000" stroke-width="6"/>
      <line x1="550" y1="620" x2="575" y2="640" stroke="#000" stroke-width="6"/>
      <!-- Legs & Tool (Wrench in hand) -->
      <path d="M 180,640 L 175,720 L 220,720 L 225,640" fill="none" stroke="#000" stroke-width="8"/>
      <path d="M 370,645 L 365,720 L 410,720 L 415,645" fill="none" stroke="#000" stroke-width="8"/>
      <!-- Wrench Tool -->
      <line x1="130" y1="670" x2="160" y2="700" stroke="#000" stroke-width="8"/>
      <!-- Ground Line -->
      <line x1="40" y1="720" x2="560" y2="720" stroke="#000" stroke-width="8"/>
      <!-- Caption space -->
      <text x="300" y="755" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#000">Stegosaurus tightens bolts on the shiny new moon base!</text>
    </svg>`
  ];

  const svgContent = svgs[pageIndex % svgs.length];
  // Convert SVG to data URL
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml;utf8,${encoded}`;
}

export function generateDemoBook(
  childName: string = 'Leo',
  theme: string = 'space dinosaurs',
  imageSize: ImageResolution = '1K'
): ColoringBook {
  const safeName = childName.trim() || 'Leo';
  const safeTheme = theme.trim() || 'Space Dinosaurs';

  const isOcean = safeTheme.toLowerCase().includes('ocean') || safeTheme.toLowerCase().includes('sea') || safeTheme.toLowerCase().includes('marine');

  const defaultPages: ColoringPage[] = isOcean ? [
    {
      id: 'ocean-page-1',
      pageNumber: 1,
      title: 'Dolphin Submarine Dive',
      sceneDescription: 'A cheerful dolphin submarine diving into crystal ocean waves under bright sunshine.',
      rhymeCaption: 'Down into the deep blue sea so bright,\nDolphin Submarine explores with pure delight!',
      imageUrl: getVectorLineArtSvg(0, safeTheme, safeName)
    },
    {
      id: 'ocean-page-2',
      pageNumber: 2,
      title: 'Captain Ollie Octopus',
      sceneDescription: 'A friendly octopus wearing a captain sailor hat waving with eight playful tentacles.',
      rhymeCaption: 'With eight bubbly arms he steers the crew,\nSinging ocean songs the whole day through!',
      imageUrl: getVectorLineArtSvg(1, safeTheme, safeName)
    },
    {
      id: 'ocean-page-3',
      pageNumber: 3,
      title: 'Gentle Sea Turtle Reef',
      sceneDescription: 'A wise sea turtle gliding gracefully over underwater coral castles and sea anemones.',
      rhymeCaption: 'Gliding along the coral floor,\nFinding friendly fish and treasures to explore!',
      imageUrl: getVectorLineArtSvg(2, safeTheme, safeName)
    },
    {
      id: 'ocean-page-4',
      pageNumber: 4,
      title: 'Sparkling Seahorse Garden',
      sceneDescription: 'A crowned seahorse swimming near glowing kelp fronds and friendly starfish.',
      rhymeCaption: 'Dancing in the waves without a care,\nTiny bubbles sparkling everywhere!',
      imageUrl: getVectorLineArtSvg(3, safeTheme, safeName)
    },
    {
      id: 'ocean-page-5',
      pageNumber: 5,
      title: 'Singing Sailor Whale',
      sceneDescription: 'A joyful gentle whale spouting water fountains high up into the sunset sky.',
      rhymeCaption: 'Spouting water high into the air,\nSharing oceanic magic everywhere!',
      imageUrl: getVectorLineArtSvg(4, safeTheme, safeName)
    }
  ] : [
    {
      id: 'demo-page-1',
      pageNumber: 1,
      title: 'Captain T-Rex in Orbit',
      sceneDescription: 'A happy Tyrannosaurus Rex floating in zero-gravity wearing an astronaut bubble helmet, surrounded by swirling planetary rings and twinkling stars.',
      rhymeCaption: 'Floating high above the moon so bright,\nCaptain T-Rex roars with pure delight!',
      imageUrl: getVectorLineArtSvg(0, safeTheme, safeName)
    },
    {
      id: 'demo-page-2',
      pageNumber: 2,
      title: 'Triceratops Lunar Rover',
      sceneDescription: 'A friendly Triceratops with three shiny horns driving an electric four-wheel lunar rover over moon craters and extraterrestrial hills.',
      rhymeCaption: 'Over the bumpy craters he will steer,\nBeeping his horn for all the stars to hear!',
      imageUrl: getVectorLineArtSvg(1, safeTheme, safeName)
    },
    {
      id: 'demo-page-3',
      pageNumber: 3,
      title: 'Brachiosaurus Nebula Snack',
      sceneDescription: 'A tall Brachiosaurus with an extra-long neck stretching up to nibble glowing star-shaped space fruits from an interstellar cosmic canopy.',
      rhymeCaption: 'Reaching way up to the highest tree,\nMunching space berries as happy as can be!',
      imageUrl: getVectorLineArtSvg(2, safeTheme, safeName)
    },
    {
      id: 'demo-page-4',
      pageNumber: 4,
      title: 'Rocket Pterodactyl Flight',
      sceneDescription: 'A daring Pterodactyl wearing pilot goggles and dual rocket thrusters gliding gracefully between floating asteroids in deep space.',
      rhymeCaption: 'Zooming past comets on rocket wings,\nListening to the songs the galaxy sings!',
      imageUrl: getVectorLineArtSvg(3, safeTheme, safeName)
    },
    {
      id: 'demo-page-5',
      pageNumber: 5,
      title: 'Stegosaurus Moon Base Builder',
      sceneDescription: 'A clever Stegosaurus in a space hardhat using tools to construct a glass dome research base on the surface of an alien moon.',
      rhymeCaption: 'Building a fortress where everyone can play,\nWelcoming astronauts from far, far away!',
      imageUrl: getVectorLineArtSvg(4, safeTheme, safeName)
    }
  ];

  return {
    id: `book-${Date.now()}`,
    childName: safeName,
    theme: safeTheme,
    ageGroup: 'kids',
    imageSize,
    coverTitle: formatCoverTitle(safeName, safeTheme),
    coverSubtitle: 'An Epic Coloring Adventure',
    coverDedication: `Specially created for ${safeName} • Happy Coloring!`,
    pages: defaultPages,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  };
}
