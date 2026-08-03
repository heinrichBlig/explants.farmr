export type GrowthStage = 'Initiation' | 'Multiplication' | 'Rooting' | 'Acclimatization';

export type ContaminationStatus = 'Healthy' | 'Contaminated' | 'Quarantine' | 'Discarded';

export type ExplantType = 
  | 'Nodal Segment' 
  | 'Shoot Tip' 
  | 'Leaf Disk' 
  | 'Meristem' 
  | 'Root Tip' 
  | 'Callus' 
  | 'Embryo/Seed' 
  | 'Petiole';

export interface Culture {
  id: string;
  labId: string;
  speciesName: string;
  cultivar?: string;
  code: string; // e.g. "MON-01"
  explantType: ExplantType;
  initiatedDate: string;
  lastSubcultureDate: string;
  nextSubcultureDate: string;
  subcultureIntervalDays: number;
  mediaRecipeId: string;
  mediaRecipeName: string;
  stage: GrowthStage;
  generationCount: number; // Subculture generation, e.g. Gen 3
  contaminationStatus: ContaminationStatus;
  vesselCount: number;
  plantletsCount: number;
  vesselType: string; // e.g. "500ml Vented Jar", "Test Tube 25x150mm", "BioTilt Bioreactor"
  photoUrl?: string;
  notes?: string;
  tags: string[];
}

export type PGRType = 'Auxin' | 'Cytokinin' | 'Gibberellin' | 'Other';

export interface PGRConcentration {
  id: string;
  name: string; // e.g. "BAP", "NAA", "IBA", "TDZ", "2,4-D", "Kinetin"
  type: PGRType;
  concentrationMgL: number;
}

export interface MediaRecipe {
  id: string;
  labId: string;
  name: string;
  description: string;
  baseMedium: 'MS' | 'WPM' | 'B5' | 'Nitsch' | 'DKW' | 'Custom';
  baseStrength: 'Full' | 'Half (1/2)' | 'Quarter (1/4)' | 'Double (2x)';
  sucroseGramsPerL: number;
  gellingAgent: 'Agar' | 'Gellan Gum (Gelrite)' | 'Phytagel' | 'Liquid (No Gelling)';
  gellingGramsPerL: number;
  ppmVolumeMlPerL: number; // Plant Preservative Mixture ml/L (e.g. 1.0ml/L or 2.0ml/L)
  pH: number;
  pgrs: PGRConcentration[];
  targetSpecies?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Commercial';
  notes?: string;
  author: string;
  isFavorite?: boolean;
}

export type InventoryCategory = 
  | 'PPM' 
  | 'Media Salt' 
  | 'PGR' 
  | 'Gelling Agent' 
  | 'Vessel' 
  | 'Sugar & Carbon' 
  | 'Supplement & Vitamin' 
  | 'Tool & Equipment';

export interface InventoryItem {
  id: string;
  labId: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  unit: 'ml' | 'L' | 'g' | 'kg' | 'units' | 'packs';
  minThreshold: number;
  costEstimateUSD: number;
  location: string;
  lastRestocked: string;
}

export type ContaminationType = 
  | 'Bacterial' 
  | 'Fungal' 
  | 'Mite/Pest' 
  | 'Endophytic' 
  | 'Vitrification/Hyperhydricity';

export interface ContaminationEvent {
  id: string;
  labId: string;
  cultureId: string;
  cultureCode: string;
  speciesName: string;
  dateDetected: string;
  contaminationType: ContaminationType;
  suspectedCause: string;
  ppmUsed: boolean;
  ppmConcentrationMlL?: number;
  vesselType: string;
  actionTaken: 'Discarded' | 'Autoclaved' | 'PPM Rescue Bath' | 'Quarantined';
  photoUrl?: string;
  notes?: string;
}

export interface Lab {
  id: string;
  name: string;
  location: string;
  focusArea: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'Masterclass' | 'Protocol' | 'Troubleshooting' | 'Sterilization' | 'PGR Guide';
  skillLevel: 'Beginner' | 'Intermediate' | 'Commercial';
  readTimeMinutes: number;
  summary: string;
  content: string;
  videoUrl?: string;
  reagentTags?: string[];
  author: string;
}

export interface PricingTier {
  id: 'free' | 'starter' | 'pro' | 'enterprise';
  name: string;
  priceMonthly: string;
  cultureLimit: string;
  recipeLimit: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}
