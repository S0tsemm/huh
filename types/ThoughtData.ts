// Import the intelligence maximization interfaces
import { IntelligenceMaximizationRecommendations } from '../analytics/intelligenceMaximizationModule.js';

// Define interfaces for advanced intelligence features
export interface CognitiveArchitecture {
  architectureName: string;
  description: string;
  applicability: number; // 0-10 score
  strengths: string[];
  limitations: string[];
}

export interface EpistemologicalFramework {
  frameworkName: string;
  description: string;
  applicability: number; // 0-10 score
  keyPrinciples: string[];
  exampleApplications: string[];
}

export interface AdvancedMetacognitiveStrategy {
  strategyName: string;
  description: string;
  applicability: number; // 0-10 score
  expectedBenefit: string;
  implementationSteps: string[];
}

export interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
  phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification';
  dependencies?: number[];
  toolsUsed?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
  status?: 'complete' | 'in-progress' | 'needs-revision';
  quality?: {
    coherence: number;
    depth: number;
    relevance: number;
    qualityScore: number;
    feedback: string[];
  };
  keywords?: string[];
  insightValue?: number;

  // New analytical properties
  classification?: 'hypothesis' | 'observation' | 'conclusion' | 'question' | 'solution';
  confidenceScore?: number;
  evidenceStrength?: number;
  assumptions?: string[];
  vector?: number[];  // For semantic analysis
  conceptsExtracted?: string[];
  contradictions?: Array<{ thoughtNumber: number; explanation: string }>;
  reflectionPrompts?: string[];
  
  // Prompt alignment properties
  promptAlignment?: number; // 0-10 score of how well a thought aligns with prompt
  promptRelevance?: Record<string, number>; // Relevance to different prompt aspects
  driftWarning?: string; // Warning if thought drifts from prompt
  suggestedCorrections?: string[]; // Suggestions to realign with prompt
  
  // Intelligence maximization properties
  intelligenceRecommendations?: IntelligenceMaximizationRecommendations;
  
  // New advanced intelligence properties
  cognitiveArchitectures?: CognitiveArchitecture[];
  epistemologicalFrameworks?: EpistemologicalFramework[];
  advancedMetacognitiveStrategies?: AdvancedMetacognitiveStrategy[];
  conceptualBlending?: Array<{
    sourceFrames: string[];
    blendedConcept: string;
    emergentStructure: string;
    applicability: number;
  }>;
  dialecticalReasoning?: Array<{
    thesis: string;
    antithesis: string;
    synthesis: string;
    progressiveImplications: string[];
  }>;
  adaptiveLearningPath?: {
    currentCapabilities: string[];
    developmentGoals: string[];
    learningTrajectory: string[];
    milestones: Array<{
      description: string;
      estimatedThoughtCount: number;
    }>;
  };
} 