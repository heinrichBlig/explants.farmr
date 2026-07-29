import { Culture, MediaRecipe, InventoryItem, ContaminationEvent, Lab, KnowledgeArticle, PricingTier } from '../types';

export const INITIAL_LABS: Lab[] = [
  {
    id: 'lab-main',
    name: 'Main Micropropagation Lab',
    location: 'Clean Room Alpha (ISO 5)',
    focusArea: 'Aroids, Carnivorous Plants & Rare Exotic Clones',
    createdAt: '2026-01-15',
    isDefault: true,
  },
  {
    id: 'lab-aroids',
    name: 'Rare Monstera & Variegates Line',
    location: 'Laminar Bench 02',
    focusArea: 'Monstera, Philodendron & Anthurium Multiplication',
    createdAt: '2026-03-01',
  },
  {
    id: 'lab-commercial',
    name: 'Biotech Commercial Nursery',
    location: 'Growth Room Beta',
    focusArea: 'Commercial Berry & Orchid Micropropagation',
    createdAt: '2026-04-10',
  }
];

export const INITIAL_CULTURES: Culture[] = [
  {
    id: 'cult-1',
    labId: 'lab-main',
    speciesName: 'Monstera deliciosa',
    cultivar: 'Thai Constellation',
    code: 'MON-TC-01',
    explantType: 'Nodal Segment',
    initiatedDate: '2026-06-10',
    lastSubcultureDate: '2026-07-08',
    nextSubcultureDate: '2026-08-05',
    subcultureIntervalDays: 28,
    mediaRecipeId: 'rec-1',
    mediaRecipeName: 'PCT MS + BAP 1.5 mg/L Multiplier',
    stage: 'Multiplication',
    generationCount: 3,
    contaminationStatus: 'Healthy',
    vesselCount: 8,
    plantletsCount: 32,
    vesselType: '500ml Vented PCT Jar',
    photoUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
    notes: 'Exhibiting dense multi-shoot proliferation. 4 shoots per explant average. High vigor.',
    tags: ['Variegated', 'High Value', 'PPM Protected']
  },
  {
    id: 'cult-2',
    labId: 'lab-main',
    speciesName: 'Dionaea muscipula',
    cultivar: 'B52 Giant',
    code: 'VFT-B52-04',
    explantType: 'Leaf Disk',
    initiatedDate: '2026-05-20',
    lastSubcultureDate: '2026-07-15',
    nextSubcultureDate: '2026-07-29', // Due tomorrow/soon!
    subcultureIntervalDays: 21,
    mediaRecipeId: 'rec-3',
    mediaRecipeName: 'Venus Flytrap Initiation 1/2 MS + Kinetin',
    stage: 'Multiplication',
    generationCount: 4,
    contaminationStatus: 'Healthy',
    vesselCount: 12,
    plantletsCount: 84,
    vesselType: '250ml Vented TC Vessel',
    photoUrl: 'https://images.unsplash.com/photo-1596707417563-5859898b31ae?auto=format&fit=crop&w=600&q=80',
    notes: 'Incredible clump division. Ready for subculture batch dividing into 1/2 MS rooting medium.',
    tags: ['Carnivorous', 'Subculture Due', 'PPM Included']
  },
  {
    id: 'cult-3',
    labId: 'lab-main',
    speciesName: 'Philodendron spiritus-sancti',
    cultivar: 'Pure Clone',
    code: 'PSS-01',
    explantType: 'Shoot Tip',
    initiatedDate: '2026-07-01',
    lastSubcultureDate: '2026-07-01',
    nextSubcultureDate: '2026-07-22', // Overdue!
    subcultureIntervalDays: 21,
    mediaRecipeId: 'rec-1',
    mediaRecipeName: 'PCT MS + BAP 1.5 mg/L Multiplier',
    stage: 'Initiation',
    generationCount: 1,
    contaminationStatus: 'Healthy',
    vesselCount: 4,
    plantletsCount: 4,
    vesselType: '25x150mm Glass Test Tube',
    photoUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80',
    notes: 'Initiation successful from apical meristem. Phenolics successfully suppressed using citric acid pre-soak.',
    tags: ['Ultra Rare', 'Stage I', 'Overdue']
  },
  {
    id: 'cult-4',
    labId: 'lab-main',
    speciesName: 'Vaccinium corymbosum',
    cultivar: 'Duke Blueberry',
    code: 'BB-DUKE-09',
    explantType: 'Nodal Segment',
    initiatedDate: '2026-06-01',
    lastSubcultureDate: '2026-07-10',
    nextSubcultureDate: '2026-08-07',
    subcultureIntervalDays: 28,
    mediaRecipeId: 'rec-2',
    mediaRecipeName: 'Woody Plant Medium (WPM) + 2iP',
    stage: 'Rooting',
    generationCount: 5,
    contaminationStatus: 'Healthy',
    vesselCount: 15,
    plantletsCount: 120,
    vesselType: 'BioTilt Bioreactor Vessel',
    photoUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
    notes: 'Roots developing vigorously in liquid WPM medium in BioTilt system. Acclimatization planned for next week.',
    tags: ['Commercial', 'WPM Medium', 'BioTilt']
  },
  {
    id: 'cult-5',
    labId: 'lab-main',
    speciesName: 'Nepenthes rajah',
    cultivar: 'Kinabalu Highland',
    code: 'NEP-RAJ-02',
    explantType: 'Embryo/Seed',
    initiatedDate: '2026-07-12',
    lastSubcultureDate: '2026-07-12',
    nextSubcultureDate: '2026-08-15',
    subcultureIntervalDays: 34,
    mediaRecipeId: 'rec-3',
    mediaRecipeName: 'Venus Flytrap Initiation 1/2 MS + Kinetin',
    stage: 'Initiation',
    generationCount: 1,
    contaminationStatus: 'Quarantine',
    vesselCount: 3,
    plantletsCount: 12,
    vesselType: 'Petri Dish 90mm',
    photoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    notes: 'Slight clouding near Explant #2. Quarantined for observation under 10x lens.',
    tags: ['Carnivorous', 'Highland', 'Quarantine']
  },
  {
    id: 'cult-6',
    labId: 'lab-aroids',
    speciesName: 'Anthurium clarinervium',
    cultivar: 'Dark Form',
    code: 'ANT-CLA-03',
    explantType: 'Petiole',
    initiatedDate: '2026-06-25',
    lastSubcultureDate: '2026-07-18',
    nextSubcultureDate: '2026-08-15',
    subcultureIntervalDays: 28,
    mediaRecipeId: 'rec-1',
    mediaRecipeName: 'PCT MS + BAP 1.5 mg/L Multiplier',
    stage: 'Multiplication',
    generationCount: 2,
    contaminationStatus: 'Healthy',
    vesselCount: 6,
    plantletsCount: 18,
    vesselType: '500ml Vented PCT Jar',
    photoUrl: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=600&q=80',
    notes: 'Callus formation at petiole base producing multiple direct organogenesis shoots.',
    tags: ['Aroid', 'Callus Proliferation']
  },
  {
    id: 'cult-7',
    labId: 'lab-aroids',
    speciesName: 'Phalaenopsis bellina',
    cultivar: 'Coerulea Blue',
    code: 'ORC-BEL-01',
    explantType: 'Embryo/Seed',
    initiatedDate: '2026-05-10',
    lastSubcultureDate: '2026-07-20',
    nextSubcultureDate: '2026-08-20',
    subcultureIntervalDays: 30,
    mediaRecipeId: 'rec-5',
    mediaRecipeName: 'Orchid Germination & Protoplast Base',
    stage: 'Acclimatization',
    generationCount: 4,
    contaminationStatus: 'Healthy',
    vesselCount: 10,
    plantletsCount: 50,
    vesselType: 'Acclimatization Plug Tray',
    photoUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80',
    notes: 'Transferred to humidity dome stage IV. Root establishment in Sphagnum + Perlite 50:50 mix.',
    tags: ['Orchid', 'Stage IV', 'Acclimatization']
  }
];

export const INITIAL_RECIPES: MediaRecipe[] = [
  {
    id: 'rec-1',
    labId: 'lab-main',
    name: 'PCT MS + BAP 1.5 mg/L Proliferation Formula',
    description: 'Gold-standard multiplication protocol for Monstera, Philodendron, and Anthurium species.',
    baseMedium: 'MS',
    baseStrength: 'Full',
    sucroseGramsPerL: 30,
    gellingAgent: 'Gellan Gum (Gelrite)',
    gellingGramsPerL: 2.5,
    ppmVolumeMlPerL: 1.5,
    pH: 5.7,
    pgrs: [
      { id: 'pgr-1', name: 'BAP (6-Benzylaminopurine)', type: 'Cytokinin', concentrationMgL: 1.5 },
      { id: 'pgr-2', name: 'NAA (Naphthaleneacetic Acid)', type: 'Auxin', concentrationMgL: 0.1 }
    ],
    targetSpecies: 'Monstera, Philodendron, Syngonium',
    difficulty: 'Intermediate',
    pctRecommended: true,
    pctProductCode: 'PCT-MS-KIT-01',
    pctBuyUrl: 'https://plantcelltechnology.com/products/ppm-plant-preservative-mixture',
    notes: 'Autoclave MS salts + sucrose + gelling agent at 121°C for 15 mins. Add PPM and heat-labile PGRs after cooling to 55°C.',
    author: 'Plant Cell Technology Research Lab',
    isFavorite: true
  },
  {
    id: 'rec-2',
    labId: 'lab-main',
    name: 'Woody Plant Medium (WPM) Blueberry & Woody Species',
    description: 'Low ionic strength formula formulated specifically for calcifuge, Ericaceae and recalcitrant woody species.',
    baseMedium: 'WPM',
    baseStrength: 'Full',
    sucroseGramsPerL: 20,
    gellingAgent: 'Agar',
    gellingGramsPerL: 7.0,
    ppmVolumeMlPerL: 1.0,
    pH: 5.2,
    pgrs: [
      { id: 'pgr-3', name: '2iP (Isopentenyl adenine)', type: 'Cytokinin', concentrationMgL: 2.0 },
      { id: 'pgr-4', name: 'IBA (Indole-3-butyric acid)', type: 'Auxin', concentrationMgL: 0.2 }
    ],
    targetSpecies: 'Vaccinium (Blueberry), Kalmia, Rhododendron, Ficus',
    difficulty: 'Advanced',
    pctRecommended: true,
    pctProductCode: 'PCT-WPM-50L',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    notes: 'Adjust pH precisely to 5.2 before autoclaving to avoid agar hydrolysis.',
    author: 'PCT Masterclass Protocol',
    isFavorite: true
  },
  {
    id: 'rec-3',
    labId: 'lab-main',
    name: 'Venus Flytrap & Sundew 1/2 MS Initiation',
    description: 'Low salt concentration designed for sensitive carnivorous plants prone to hyperhydricity.',
    baseMedium: 'MS',
    baseStrength: 'Half (1/2)',
    sucroseGramsPerL: 20,
    gellingAgent: 'Gellan Gum (Gelrite)',
    gellingGramsPerL: 2.2,
    ppmVolumeMlPerL: 2.0,
    pH: 5.6,
    pgrs: [
      { id: 'pgr-5', name: 'Kinetin', type: 'Cytokinin', concentrationMgL: 0.5 }
    ],
    targetSpecies: 'Dionaea muscipula, Drosera, Pinguicula',
    difficulty: 'Beginner',
    pctRecommended: true,
    pctProductCode: 'PCT-CARNIVORE-SET',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    notes: 'High PPM concentration (2.0 ml/L) is crucial for Stage I explants taken from non-sterile greenhouse traps.',
    author: 'Dr. Francisco Palacios (PCT)',
    isFavorite: true
  },
  {
    id: 'rec-4',
    labId: 'lab-main',
    name: 'Synergistic Rooting Medium (1/2 MS + IBA)',
    description: 'Stage III rooting formulation designed to induce robust, unbranched main taproots before acclimatization.',
    baseMedium: 'MS',
    baseStrength: 'Half (1/2)',
    sucroseGramsPerL: 15,
    gellingAgent: 'Agar',
    gellingGramsPerL: 6.5,
    ppmVolumeMlPerL: 1.0,
    pH: 5.8,
    pgrs: [
      { id: 'pgr-6', name: 'IBA', type: 'Auxin', concentrationMgL: 1.0 },
      { id: 'pgr-7', name: 'Activated Charcoal', type: 'Other', concentrationMgL: 2000 }
    ],
    targetSpecies: 'General Exotics & Hardwood Clones',
    difficulty: 'Intermediate',
    pctRecommended: false,
    author: 'tissue.farmr Community',
    isFavorite: false
  },
  {
    id: 'rec-5',
    labId: 'lab-main',
    name: 'Orchid Asymbiotic Seed Germination (Nitsch & Nitsch)',
    description: 'Enriched with organic supplements (banana powder & coconut water) for epiphytic orchid seed flasking.',
    baseMedium: 'Nitsch',
    baseStrength: 'Full',
    sucroseGramsPerL: 20,
    gellingAgent: 'Agar',
    gellingGramsPerL: 8.0,
    ppmVolumeMlPerL: 1.0,
    pH: 5.4,
    pgrs: [],
    targetSpecies: 'Phalaenopsis, Cattleya, Dendrobium, Paphiopedilum',
    difficulty: 'Commercial',
    pctRecommended: true,
    pctProductCode: 'PCT-ORCHID-NN',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    notes: 'Add 50g/L organic banana homogenate and 100ml/L filter-sterilized coconut water.',
    author: 'PCT Orchid Lab',
    isFavorite: true
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    labId: 'lab-main',
    name: 'Plant Preservative Mixture (PPM™) 100ml',
    category: 'PPM',
    currentStock: 18, // Low stock alert! (Threshold 25ml)
    unit: 'ml',
    minThreshold: 25,
    costEstimateUSD: 34.99,
    location: 'Reagents Fridge A (4°C)',
    pctProductCode: 'PPM-100ML',
    pctBuyUrl: 'https://plantcelltechnology.com/products/ppm-plant-preservative-mixture',
    isPctProduct: true,
    lastRestocked: '2026-05-15'
  },
  {
    id: 'inv-2',
    labId: 'lab-main',
    name: 'Murashige & Skoog (MS) Media with Vitamins 50L Pack',
    category: 'Media Salt',
    currentStock: 4,
    unit: 'packs',
    minThreshold: 2,
    costEstimateUSD: 28.50,
    location: 'Dry Storage Shelf 1',
    pctProductCode: 'PCT-MS-50L',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: true,
    lastRestocked: '2026-06-01'
  },
  {
    id: 'inv-3',
    labId: 'lab-main',
    name: 'Gelrite / Gellan Gum High Clarity 250g',
    category: 'Gelling Agent',
    currentStock: 85,
    unit: 'g',
    minThreshold: 100, // Low stock alert!
    costEstimateUSD: 42.00,
    location: 'Dry Storage Shelf 2',
    pctProductCode: 'PCT-GEL-250',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: true,
    lastRestocked: '2026-04-20'
  },
  {
    id: 'inv-4',
    labId: 'lab-main',
    name: 'BAP (6-Benzylaminopurine) Solution 1 mg/ml',
    category: 'PGR',
    currentStock: 45,
    unit: 'ml',
    minThreshold: 15,
    costEstimateUSD: 18.00,
    location: 'Reagents Freezer B (-20°C)',
    pctProductCode: 'PCT-PGR-BAP',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: true,
    lastRestocked: '2026-06-12'
  },
  {
    id: 'inv-5',
    labId: 'lab-main',
    name: 'NAA (1-Naphthaleneacetic Acid) 1 mg/ml',
    category: 'PGR',
    currentStock: 30,
    unit: 'ml',
    minThreshold: 10,
    costEstimateUSD: 16.50,
    location: 'Reagents Freezer B (-20°C)',
    pctProductCode: 'PCT-PGR-NAA',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: true,
    lastRestocked: '2026-06-12'
  },
  {
    id: 'inv-6',
    labId: 'lab-main',
    name: '500ml Polypropylene Vented Culture Jars (Box of 24)',
    category: 'Vessel',
    currentStock: 3, // 3 boxes left (Low stock alert!)
    unit: 'packs',
    minThreshold: 5,
    costEstimateUSD: 48.00,
    location: 'Sterile Supply Bin 4',
    pctProductCode: 'PCT-JAR-500',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: true,
    lastRestocked: '2026-05-30'
  },
  {
    id: 'inv-7',
    labId: 'lab-main',
    name: 'BioTilt™ Bioreactor Vessel Unit',
    category: 'Tool & Equipment',
    currentStock: 6,
    unit: 'units',
    minThreshold: 2,
    costEstimateUSD: 120.00,
    location: 'Bench Alpha Shelf',
    pctProductCode: 'PCT-BIOTILT-01',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: true,
    lastRestocked: '2026-06-25'
  },
  {
    id: 'inv-8',
    labId: 'lab-main',
    name: 'Sucrose Analytical Grade 1kg',
    category: 'Sugar & Carbon',
    currentStock: 2200,
    unit: 'g',
    minThreshold: 500,
    costEstimateUSD: 12.00,
    location: 'Dry Storage Shelf 1',
    pctBuyUrl: 'https://plantcelltechnology.com/',
    isPctProduct: false,
    lastRestocked: '2026-07-01'
  }
];

export const INITIAL_CONTAMINATION_LOGS: ContaminationEvent[] = [
  {
    id: 'cont-1',
    labId: 'lab-main',
    cultureId: 'cult-5',
    cultureCode: 'NEP-RAJ-02',
    speciesName: 'Nepenthes rajah',
    dateDetected: '2026-07-24',
    contaminationType: 'Bacterial',
    suspectedCause: 'Explant surface contamination on non-sterile field wild seed stock',
    ppmUsed: false,
    ppmConcentrationMlL: 0,
    vesselType: 'Petri Dish 90mm',
    actionTaken: 'PPM Rescue Bath',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    notes: 'Milky halo around seed #2 on day 12. Submersed seed in 5% PPM solution for 15 min and re-plated on fresh 2ml/L PPM 1/2 MS medium.'
  },
  {
    id: 'cont-2',
    labId: 'lab-main',
    cultureId: 'cult-99',
    cultureCode: 'PHI-VER-02',
    speciesName: 'Philodendron verrucosum',
    dateDetected: '2026-07-14',
    contaminationType: 'Fungal',
    suspectedCause: 'Airborne spore during flow hood transfer on high humidity day',
    ppmUsed: true,
    ppmConcentrationMlL: 1.0,
    vesselType: '500ml Vented PCT Jar',
    actionTaken: 'Autoclaved',
    notes: 'White fuzzy mycelium detected at edge of agar on day 8. Autoclaved vessel immediately before disposal.'
  },
  {
    id: 'cont-3',
    labId: 'lab-aroids',
    cultureId: 'cult-98',
    cultureCode: 'MON-OBL-01',
    speciesName: 'Monstera obliqua Peru',
    dateDetected: '2026-06-28',
    contaminationType: 'Endophytic',
    suspectedCause: 'Systemic latent bacterium inside vascular bundle of node',
    ppmUsed: true,
    ppmConcentrationMlL: 1.5,
    vesselType: '25x150mm Glass Test Tube',
    actionTaken: 'Discarded',
    notes: 'Latent bacterial ooze emerged from cut stem base after 3 weeks in warm growth chamber.'
  },
  {
    id: 'cont-4',
    labId: 'lab-main',
    cultureId: 'cult-97',
    cultureCode: 'DRO-CAP-05',
    speciesName: 'Drosera capensis',
    dateDetected: '2026-06-10',
    contaminationType: 'Vitrification/Hyperhydricity',
    suspectedCause: 'Excessive liquid condensation & high cytokinin level',
    ppmUsed: true,
    ppmConcentrationMlL: 1.0,
    vesselType: '250ml Vented TC Vessel',
    actionTaken: 'Quarantined',
    notes: 'Plantlets appeared translucent and water-soaked. Reduced humidity and transferred to agar-thickened medium (8g/L).'
  }
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: 'PPM™ (Plant Preservative Mixture) Complete Operating Protocol',
    category: 'Sterilization',
    skillLevel: 'Beginner',
    readTimeMinutes: 8,
    summary: 'How PPM prevents endophytes, bacteria, and fungal spores without inhibiting plantlet tissue growth or organogenesis.',
    content: `Plant Preservative Mixture (PPM™) is a heat-stable broad-spectrum biocide formulated by Plant Cell Technology. It targets membrane permeability and enzyme synthesis in bacterial and fungal contaminant cells while leaving plant cells undamaged.

### Recommended Dosages
- **Stage I Initiation (Field explants):** 2.0 - 3.0 ml / L of media.
- **Stage II Proliferation & Maintenance:** 1.0 - 1.5 ml / L of media.
- **Explant Rescue Soak (5% Solution):** 5 ml PPM in 95 ml sterile water for 10-20 minutes before plating.

### Key Rules
1. PPM can be autoclaved directly in media at 121°C (15 psi) for up to 20 minutes without loss of potency.
2. Maintain media pH between 5.5 and 5.8 for optimal PPM ion activity.
3. Combine PPM with 0.1% Tween-20 during explant surface wash to break surface tension on hairy or waxy leaves.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder or PCT video link
    pctProductTags: ['PPM™ 100ml', 'PPM™ 500ml', 'Sterile Tween-20'],
    pctArticleUrl: 'https://plantcelltechnology.com/blogs/news',
    author: 'Dr. Francisco Palacios (PCT Chief Scientist)'
  },
  {
    id: 'kb-2',
    title: 'Monstera & Aroid Micropropagation Masterclass',
    category: 'Masterclass',
    skillLevel: 'Intermediate',
    readTimeMinutes: 14,
    summary: 'Step-by-step nodal explant dissection, phenolics control, and BAP cytokinin shoot proliferation ratio benchmarking.',
    content: `Aroids such as Monstera deliciosa, Philodendron, and Anthurium respond exceptionally well to tissue culture when phenolic oxidation is controlled during Stage I.

### Protocol Steps
1. **Explant Harvest:** Select semi-hardwood nodal segments with active axillary buds.
2. **Anti-Browning Pre-Treatment:** Soak dissected nodes in an antioxidant solution containing 150 mg/L Ascorbic Acid + 100 mg/L Citric Acid for 30 minutes.
3. **Sterilization:** 10% Household Bleach (0.6% NaOCl) + 2 drops Tween-20 for 12 minutes, followed by 3x sterile water rinses.
4. **Initiation Medium:** Full MS salts + 30g/L Sucrose + 1.5ml/L PPM + 1.0 mg/L BAP + 0.1 mg/L NAA.
5. **Subculture Cycle:** Every 21-28 days. Proliferation index expected: 3x to 5x shoots per subculture cycle.`,
    pctProductTags: ['MS Media Pack', 'BAP Cytokinin', 'Ascorbic Acid', 'PCT Vented Jars'],
    pctArticleUrl: 'https://plantcelltechnology.com/blogs/news',
    author: 'PCT Masterclass Series'
  },
  {
    id: 'kb-3',
    title: 'Carnivorous Plant Tissue Culture: Mitigating Hyperhydricity',
    category: 'Protocol',
    skillLevel: 'Beginner',
    readTimeMinutes: 10,
    summary: 'Why Dionaea, Nepenthes, and Drosera require half-strength MS medium, reduced sucrose, and controlled gelling density.',
    content: `Carnivorous plants evolved in nutrient-poor bogs and are highly sensitive to mineral salts and high osmotic pressure. Full-strength MS medium often leads to vitrification (glassy, fragile leaves that fail in acclimatization).

### Best Practices for Carnivorous Species
- **Salt Strength:** Always use 1/2 MS or 1/3 MS macro & micro nutrients.
- **Sugar:** Limit sucrose to 15g - 20g/L.
- **PGR Balance:** Keep BAP or Kinetin ≤ 0.5 mg/L. High cytokinins trigger hyperhydricity rapidly in Sundews and Venus Flytraps.
- **Gelling Density:** Increase Gelrite to 2.5g/L or Agar to 7.5g/L to reduce free water availability on media surface.`,
    pctProductTags: ['1/2 MS Media', 'Gellan Gum Gelrite', 'Kinetin'],
    pctArticleUrl: 'https://plantcelltechnology.com/blogs/news',
    author: 'Plant Cell Technology Research'
  },
  {
    id: 'kb-4',
    title: 'Bioreactors & Liquid Culture Scaling with BioTilt™',
    category: 'Masterclass',
    skillLevel: 'Commercial',
    readTimeMinutes: 18,
    summary: 'How temporary immersion systems (TIS) boost multiplication rates by 300% while cutting agar/labor costs in half.',
    content: `Traditional agar culture suffers from nutrient depletion gradients and labor-intensive manual transfer. Temporary Immersion Systems (TIS) like the **BioTilt™ Bioreactor** flood plantlets with liquid medium for 5 minutes every 6 hours, providing maximum gas exchange and rapid nutrient uptake.

### Key Commercial Advantages
- 300-400% higher shoot production per vessel compared to solid agar.
- Zero gelling agent cost (saves $400+ per 1000 vessels).
- Drastically reduced subculture handling time.
- Ideal for Blueberry, Orchid, Cannabis, and Banana commercial lines.`,
    pctProductTags: ['BioTilt™ Bioreactor', 'Liquid MS Medium', 'Sintered Air Filters'],
    pctArticleUrl: 'https://plantcelltechnology.com/',
    author: 'Commercial TC Engineering Team'
  },
  {
    id: 'kb-5',
    title: 'Tissue Culture Troubleshooting Flowchart & Diagnostic Guide',
    category: 'Troubleshooting',
    skillLevel: 'Intermediate',
    readTimeMinutes: 12,
    summary: 'Quick diagnostic decision tree for media discoloration, shoot tip necrosis, bacterial hazing, and slow growth.',
    content: `### Problem 1: Agar Turning Black or Brown
- **Cause:** Phenolic exudation from explant cut surfaces.
- **Solution:** Add 2.0 g/L Activated Charcoal to media or transfer explants to fresh media every 48 hours for the first week.

### Problem 2: White/Yellow Cloudiness Around Explant Base
- **Cause:** Bacterial contamination (bacterial ooze).
- **Solution:** Dip explant in 5% PPM solution for 15 minutes and plate onto medium with 2.0 ml/L PPM. If systemic, discard vessel.

### Problem 3: Pale Yellow / Chlorotic Young Leaves
- **Cause:** Iron deficiency or incorrect pH (pH > 6.0).
- **Solution:** Re-check pH meter calibration. Ensure Fe-EDTA or Fe-EDDHA iron source is fresh and protected from light.`,
    pctProductTags: ['Activated Charcoal', 'PPM™ 100ml', 'Fe-EDTA Iron', 'pH Buffer Solutions'],
    pctArticleUrl: 'https://plantcelltechnology.com/',
    author: 'PCT Technical Support'
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Hobbyist',
    priceMonthly: '$0',
    cultureLimit: 'Up to 15 Active Cultures',
    recipeLimit: '3 Custom Recipes',
    features: [
      'Basic Culture Tracker & Stages',
      'Media Recipe Builder with Auto-Scale',
      'Local Storage Persistence',
      'PCT Knowledge Base Access',
      'Community Recipe Library'
    ],
    ctaText: 'Current Plan'
  },
  {
    id: 'starter',
    name: 'Starter Lab',
    priceMonthly: '$19 / mo',
    cultureLimit: 'Unlimited Cultures',
    recipeLimit: 'Unlimited Recipes',
    features: [
      'Everything in Free',
      'Unlimited Cultures & Media Recipes',
      'Inventory Manager with Low Stock Alerts',
      'Subculture Schedule Calendar View',
      'Contamination Log & Analytics',
      '1-Click PCT Restock Referral Discounts',
      'CSV / JSON Full Data Backup Export'
    ],
    highlighted: true,
    ctaText: 'Upgrade to Starter'
  },
  {
    id: 'pro',
    name: 'Pro Commercial',
    priceMonthly: '$49 / mo',
    cultureLimit: 'Unlimited + Multi-Lab',
    recipeLimit: 'Unlimited Recipes',
    features: [
      'Everything in Starter',
      'Multi-Lab & Multi-Project Workspaces',
      'Advanced Contamination Rate Reduction Charts',
      'Batch Subculture Actions',
      'BioTilt™ Bioreactor Schedule Tracking',
      'Priority PCT Technical Support & Protocol Advice'
    ],
    ctaText: 'Upgrade to Pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Nursery',
    priceMonthly: '$149 / mo',
    cultureLimit: 'Unlimited Workspaces',
    recipeLimit: 'Unlimited Recipes',
    features: [
      'Everything in Pro',
      'Team Member Role Simulation',
      'Custom API & QR Code Label Generator',
      'Dedicated PCT Masterclass Consultation'
    ],
    ctaText: 'Contact Enterprise Sales'
  },
  {
    id: 'pct_partner',
    name: 'PCT Partner Tier',
    priceMonthly: 'FREE forever',
    cultureLimit: 'Unlimited Everything',
    recipeLimit: 'Unlimited Everything',
    features: [
      'Completely Free for Plant Cell Technology Team & Certified Labs',
      'Co-branded Dashboard Experience',
      'Earn 10-15% Affiliate Commission on Referred Product Sales',
      'Direct Protocol Publishing to Community Library'
    ],
    ctaText: 'PCT Partner Access'
  }
];
