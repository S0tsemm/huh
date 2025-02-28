// IntelligenceMaximizationModule.ts
// This component is responsible for maximizing AI capabilities based on prompt specifics
// It recommends strategies, estimates complexity, and identifies appropriate reasoning types

import { PromptMetadata } from './promptAnalyzer.js';
// Import the advanced intelligence interfaces
import { CognitiveArchitecture, EpistemologicalFramework, AdvancedMetacognitiveStrategy } from '../types/ThoughtData.js';

// Define interfaces for the module

// Strategy recommendation based on prompt type
export interface StrategyRecommendation {
  strategyName: string;
  description: string;
  reasonForRecommendation: string;
  estimatedEffectiveness: number; // 0-10 score
  applicablePhases: Array<'Planning' | 'Analysis' | 'Execution' | 'Verification'>;
}

// Reasoning type recommendation
export interface ReasoningTypeRecommendation {
  reasoningType: 'deductive' | 'inductive' | 'abductive' | 'analogical' | 'causal' | 'counterfactual' | 'creative' | 
                 'divergent' | 'systems' | 'hierarchical' | 'modular' | 'integrative' | 'strategic' | 'comparative' | 
                 'procedural' | 'evaluative';
  description: string;
  applicability: number; // 0-10 score
  examples: string[];
}

// Complexity estimation result
export interface ComplexityEstimation {
  overallComplexity: 'simple' | 'medium' | 'complex';
  dimensionalComplexity: {
    conceptual: number; // 0-10 score
    procedural: number; // 0-10 score
    contextual: number; // 0-10 score
    domain: number; // 0-10 score
  };
  recommendedThoughtCount: number;
  recommendedPhaseDistribution: {
    Planning: number;
    Analysis: number;
    Execution: number;
    Verification: number;
  };
}

// Cognitive bias detection
export interface CognitiveBiasDetection {
  biasType: string;
  description: string;
  likelihood: number; // 0-1 score
  mitigationStrategy: string;
}

// Metacognitive strategy
export interface MetacognitiveStrategy {
  strategyName: string;
  description: string;
  applicability: number; // 0-10 score
  expectedBenefit: string;
}

// Adaptive learning recommendation
export interface AdaptiveLearningRecommendation {
  learningArea: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  recommendedResources: string[];
  expectedBenefits: string[];
  relevanceToPrompt: number; // 0-10 score
}

// Thought pattern analysis
export interface ThoughtPatternAnalysis {
  dominantPatterns: Array<{
    patternName: string;
    description: string;
    frequency: number; // 0-1 score
    impact: 'positive' | 'neutral' | 'negative';
  }>;
  suggestedPatternShifts: Array<{
    from: string;
    to: string;
    benefit: string;
  }>;
  thinkingDiversity: number; // 0-10 score
  patternEvolution: 'improving' | 'stable' | 'narrowing';
}

// Advanced cognitive model interface
export interface CognitiveModel {
  modelName: string;
  description: string;
  applicability: number; // 0-10 score
  strengths: string[];
  limitations: string[];
  recommendedUses: string[];
}

// Advanced reasoning framework interface
export interface ReasoningFramework {
  frameworkName: string;
  description: string;
  applicability: number; // 0-10 score
  keyPrinciples: string[];
  exampleApplications: string[];
}

// Intelligence maximization recommendations
export interface IntelligenceMaximizationRecommendations {
  strategies: StrategyRecommendation[];
  reasoningTypes: ReasoningTypeRecommendation[];
  complexityEstimation: ComplexityEstimation;
  toolRecommendations: string[];
  focusAreas: string[];
  potentialPitfalls: string[];
  // New fields
  cognitiveBiases: CognitiveBiasDetection[];
  metacognitiveStrategies: MetacognitiveStrategy[];
  adaptiveSuggestions: string[];
  insightGenerationPrompts: string[];
  adaptiveLearningRecommendations: AdaptiveLearningRecommendation[];
  thoughtPatternAnalysis?: ThoughtPatternAnalysis; // Optional as it requires multiple thoughts
  // New advanced fields
  cognitiveModels: CognitiveModel[];
  reasoningFrameworks: ReasoningFramework[];
  decisionStrategies: Array<{
    strategyName: string;
    description: string;
    applicability: number;
    decisionFactors: string[];
  }>;
  mentalModels: Array<{
    modelName: string;
    description: string;
    applicability: number;
    exampleApplication: string;
  }>;
  // Add missing properties
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

export class IntelligenceMaximizationModule {
  /**
   * Generates comprehensive recommendations for maximizing AI intelligence based on prompt
   * @param promptMetadata The analyzed prompt metadata
   * @param currentThoughtNumber The current thought number in the sequence
   * @param totalThoughts The total estimated thoughts
   * @param phase The current thinking phase
   * @returns Intelligence maximization recommendations
   */
  public generateRecommendations(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification',
    previousThoughts?: Array<{
      thought: string;
      phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification';
      classification?: string;
      toolsUsed?: string[];
    }>
  ): IntelligenceMaximizationRecommendations {
    // Generate strategy recommendations
    const strategies = this.recommendStrategies(promptMetadata, currentThoughtNumber, totalThoughts, phase);
    
    // Recommend reasoning types
    const reasoningTypes = this.recommendReasoningTypes(promptMetadata, phase);
    
    // Estimate complexity
    const complexityEstimation = this.estimateDetailedComplexity(promptMetadata);
    
    // Recommend tools
    const toolRecommendations = this.recommendTools(promptMetadata, phase);
    
    // Identify focus areas
    const focusAreas = this.identifyFocusAreas(promptMetadata, currentThoughtNumber, totalThoughts);
    
    // Identify potential pitfalls
    const potentialPitfalls = this.identifyPotentialPitfalls(promptMetadata);
    
    // New methods
    const cognitiveBiases = this.detectPotentialCognitiveBiases(promptMetadata, phase);
    const metacognitiveStrategies = this.recommendMetacognitiveStrategies(promptMetadata, currentThoughtNumber, totalThoughts);
    const adaptiveSuggestions = this.generateAdaptiveSuggestions(promptMetadata, currentThoughtNumber, totalThoughts, phase);
    const insightGenerationPrompts = this.generateInsightPrompts(promptMetadata, phase);
    
    // New adaptive learning recommendations
    const adaptiveLearningRecommendations = this.generateAdaptiveLearningRecommendations(promptMetadata, currentThoughtNumber, totalThoughts);
    
    // Optional thought pattern analysis
    const thoughtPatternAnalysis = previousThoughts && previousThoughts.length > 0 
      ? this.analyzeThoughtPatterns(previousThoughts, promptMetadata)
      : undefined;
    
    // New advanced recommendations
    const cognitiveModels = this.recommendCognitiveModels(promptMetadata, phase);
    const reasoningFrameworks = this.recommendReasoningFrameworks(promptMetadata, phase);
    const decisionStrategies = this.recommendDecisionStrategies(promptMetadata, currentThoughtNumber, totalThoughts);
    const mentalModels = this.recommendMentalModels(promptMetadata, phase);
    
    // New advanced intelligence features
    const cognitiveArchitectures = this.recommendCognitiveArchitectures(promptMetadata, phase);
    const epistemologicalFrameworks = this.recommendEpistemologicalFrameworks(promptMetadata, phase);
    const advancedMetacognitiveStrategies = this.recommendAdvancedMetacognitiveStrategies(promptMetadata, currentThoughtNumber, totalThoughts);
    const conceptualBlending = this.generateConceptualBlending(promptMetadata);
    const dialecticalReasoning = this.generateDialecticalReasoning(promptMetadata);
    const adaptiveLearningPath = this.generateAdaptiveLearningPath(promptMetadata, currentThoughtNumber, totalThoughts);
    
    return {
      strategies,
      reasoningTypes,
      complexityEstimation,
      toolRecommendations,
      focusAreas,
      potentialPitfalls,
      cognitiveBiases,
      metacognitiveStrategies,
      adaptiveSuggestions,
      insightGenerationPrompts,
      adaptiveLearningRecommendations,
      thoughtPatternAnalysis,
      // Add new fields
      cognitiveModels,
      reasoningFrameworks,
      decisionStrategies,
      mentalModels,
      // Add new advanced intelligence features
      cognitiveArchitectures,
      epistemologicalFrameworks,
      advancedMetacognitiveStrategies,
      conceptualBlending,
      dialecticalReasoning,
      adaptiveLearningPath
    };
  }

  /**
   * Recommends strategies based on prompt type and current phase
   * @param promptMetadata The analyzed prompt metadata
   * @param currentThoughtNumber The current thought number
   * @param totalThoughts The total estimated thoughts
   * @param phase The current thinking phase
   * @returns Array of strategy recommendations
   */
  private recommendStrategies(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): StrategyRecommendation[] {
    const recommendations: StrategyRecommendation[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Add task-type specific strategies
    switch (promptMetadata.taskType) {
      case 'creative':
        recommendations.push({
          strategyName: 'Divergent Thinking',
          description: 'Generate multiple diverse ideas before converging on solutions',
          reasonForRecommendation: 'Creative tasks benefit from exploring multiple possibilities',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis']
        });
        
        recommendations.push({
          strategyName: 'Analogical Reasoning',
          description: 'Draw parallels from different domains to inspire novel solutions',
          reasonForRecommendation: 'Analogies can spark creative insights',
          estimatedEffectiveness: 8,
          applicablePhases: ['Analysis', 'Execution']
        });
        break;
        
      case 'analytical':
        recommendations.push({
          strategyName: 'Systematic Decomposition',
          description: 'Break down the problem into clearly defined components',
          reasonForRecommendation: 'Analytical tasks benefit from structured problem decomposition',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis']
        });
        
        recommendations.push({
          strategyName: 'Evidence-Based Reasoning',
          description: 'Support each conclusion with specific evidence',
          reasonForRecommendation: 'Analytical tasks require rigorous justification',
          estimatedEffectiveness: 8,
          applicablePhases: ['Analysis', 'Execution', 'Verification']
        });
        break;
        
      case 'informational':
        recommendations.push({
          strategyName: 'Comprehensive Coverage',
          description: 'Ensure all relevant aspects of the topic are addressed',
          reasonForRecommendation: 'Informational tasks benefit from breadth of coverage',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Execution']
        });
        
        recommendations.push({
          strategyName: 'Hierarchical Organization',
          description: 'Structure information from general to specific',
          reasonForRecommendation: 'Hierarchical organization improves information accessibility',
          estimatedEffectiveness: 8,
          applicablePhases: ['Execution', 'Verification']
        });
        break;
        
      case 'technical':
        recommendations.push({
          strategyName: 'Precision-First Approach',
          description: 'Focus on technical accuracy and precise terminology',
          reasonForRecommendation: 'Technical tasks require domain-specific precision',
          estimatedEffectiveness: 9,
          applicablePhases: ['Analysis', 'Execution']
        });
        
        recommendations.push({
          strategyName: 'Implementation Planning',
          description: 'Develop detailed step-by-step implementation plans',
          reasonForRecommendation: 'Technical tasks benefit from explicit implementation details',
          estimatedEffectiveness: 8,
          applicablePhases: ['Planning', 'Execution']
        });
        break;
        
      case 'mixed':
        recommendations.push({
          strategyName: 'Adaptive Approach',
          description: 'Flexibly switch between creative and analytical modes',
          reasonForRecommendation: 'Mixed tasks require adaptability between thinking styles',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis', 'Execution']
        });
        break;
    }
    
    // Add phase-specific strategies
    if (phase) {
      switch (phase) {
        case 'Planning':
          recommendations.push({
            strategyName: 'Goal Decomposition',
            description: 'Break down the main goal into sub-goals',
            reasonForRecommendation: 'Planning phase benefits from clear goal hierarchy',
            estimatedEffectiveness: 8,
            applicablePhases: ['Planning']
          });
          break;
          
        case 'Analysis':
          recommendations.push({
            strategyName: 'Multi-perspective Analysis',
            description: 'Analyze the problem from multiple stakeholder perspectives',
            reasonForRecommendation: 'Analysis phase benefits from diverse viewpoints',
            estimatedEffectiveness: 8,
            applicablePhases: ['Analysis']
          });
          break;
          
        case 'Execution':
          recommendations.push({
            strategyName: 'Incremental Development',
            description: 'Build the solution in incremental steps with validation',
            reasonForRecommendation: 'Execution phase benefits from iterative approach',
            estimatedEffectiveness: 8,
            applicablePhases: ['Execution']
          });
          break;
          
        case 'Verification':
          recommendations.push({
            strategyName: 'Criteria-Based Evaluation',
            description: 'Evaluate the solution against explicit success criteria',
            reasonForRecommendation: 'Verification phase benefits from objective assessment',
            estimatedEffectiveness: 8,
            applicablePhases: ['Verification']
          });
          break;
      }
    }
    
    // Add progress-specific strategies
    if (progress < 0.3) {
      recommendations.push({
        strategyName: 'Exploratory Breadth',
        description: 'Explore the problem space broadly before diving deep',
        reasonForRecommendation: 'Early thoughts benefit from broad exploration',
        estimatedEffectiveness: 8,
        applicablePhases: ['Planning', 'Analysis']
      });
    } else if (progress > 0.7) {
      recommendations.push({
        strategyName: 'Convergent Synthesis',
        description: 'Synthesize insights from previous thoughts into cohesive solution',
        reasonForRecommendation: 'Later thoughts benefit from synthesis of earlier insights',
        estimatedEffectiveness: 8,
        applicablePhases: ['Execution', 'Verification']
      });
    }
    
    // Add complexity-specific strategies
    switch (promptMetadata.complexity) {
      case 'complex':
        recommendations.push({
          strategyName: 'Iterative Refinement',
          description: 'Continuously refine understanding through multiple passes',
          reasonForRecommendation: 'Complex problems benefit from iterative approaches',
          estimatedEffectiveness: 9,
          applicablePhases: ['Planning', 'Analysis', 'Execution', 'Verification']
        });
        break;
    }
    
    // Return top strategies (limit to 3 to avoid overwhelming)
    return recommendations.slice(0, 3);
  }

  /**
   * Recommends appropriate reasoning types based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @param phase The current thinking phase
   * @returns Array of reasoning type recommendations
   */
  private recommendReasoningTypes(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): ReasoningTypeRecommendation[] {
    const recommendations: ReasoningTypeRecommendation[] = [];
    
    // Add task-type specific reasoning types
    switch (promptMetadata.taskType) {
      case 'creative':
        recommendations.push({
          reasoningType: 'creative',
          description: 'Generate novel ideas by combining existing concepts in new ways',
          applicability: 9,
          examples: ['Brainstorming multiple solutions', 'Using metaphors to reframe the problem']
        });
        
        recommendations.push({
          reasoningType: 'analogical',
          description: 'Draw parallels between the current problem and similar situations',
          applicability: 8,
          examples: ['Applying solutions from one domain to another', 'Using metaphors to generate insights']
        });
        
        // New reasoning type
        recommendations.push({
          reasoningType: 'divergent',
          description: 'Explore multiple different directions to generate a variety of possibilities',
          applicability: 8,
          examples: ['Considering wildly different approaches', 'Suspending judgment to explore unusual ideas']
        });
        break;
        
      case 'analytical':
        recommendations.push({
          reasoningType: 'deductive',
          description: 'Draw specific conclusions from general principles',
          applicability: 9,
          examples: ['Applying established rules to specific cases', 'Using logical inference']
        });
        
        recommendations.push({
          reasoningType: 'causal',
          description: 'Identify cause-effect relationships',
          applicability: 8,
          examples: ['Analyzing root causes', 'Predicting outcomes based on actions']
        });
        
        // New reasoning type
        recommendations.push({
          reasoningType: 'systems',
          description: 'Analyze interactions between components in a complex system',
          applicability: 8,
          examples: ['Mapping feedback loops', 'Identifying emergent properties']
        });
        break;
        
      case 'informational':
        recommendations.push({
          reasoningType: 'inductive',
          description: 'Draw general conclusions from specific observations',
          applicability: 9,
          examples: ['Identifying patterns from examples', 'Generalizing from specific cases']
        });
        
        // New reasoning type
        recommendations.push({
          reasoningType: 'hierarchical',
          description: 'Organize information in levels from general to specific',
          applicability: 8,
          examples: ['Creating taxonomies', 'Developing conceptual hierarchies']
        });
        break;
        
      case 'technical':
        recommendations.push({
          reasoningType: 'deductive',
          description: 'Apply established principles to specific technical problems',
          applicability: 9,
          examples: ['Applying technical standards', 'Following established procedures']
        });
        
        recommendations.push({
          reasoningType: 'causal',
          description: 'Analyze technical cause-effect relationships',
          applicability: 8,
          examples: ['Debugging by tracing effects to causes', 'Predicting system behavior']
        });
        
        // New reasoning type
        recommendations.push({
          reasoningType: 'modular',
          description: 'Break down complex systems into independent functional components',
          applicability: 9,
          examples: ['Designing with separation of concerns', 'Creating abstraction layers']
        });
        break;
        
      case 'mixed':
        recommendations.push({
          reasoningType: 'abductive',
          description: 'Form the most likely explanation from incomplete information',
          applicability: 8,
          examples: ['Developing working hypotheses', 'Making educated guesses with limited data']
        });
        
        // New reasoning type
        recommendations.push({
          reasoningType: 'integrative',
          description: 'Combine insights from multiple reasoning approaches',
          applicability: 9,
          examples: ['Synthesizing analytical and creative thinking', 'Balancing quantitative and qualitative factors']
        });
        break;
    }
    
    // Add phase-specific reasoning types
    if (phase) {
      switch (phase) {
        case 'Planning':
          recommendations.push({
            reasoningType: 'counterfactual',
            description: 'Consider alternative scenarios and their implications',
            applicability: 7,
            examples: ['What if analysis', 'Considering edge cases']
          });
          
          // New reasoning type
          recommendations.push({
            reasoningType: 'strategic',
            description: 'Focus on long-term goals and high-level approaches',
            applicability: 8,
            examples: ['Identifying key leverage points', 'Focusing on highest-impact areas']
          });
          break;
          
        case 'Analysis':
          if (!recommendations.some(r => r.reasoningType === 'causal')) {
            recommendations.push({
              reasoningType: 'causal',
              description: 'Identify cause-effect relationships in the problem domain',
              applicability: 8,
              examples: ['Root cause analysis', 'Impact assessment']
            });
          }
          
          // New reasoning type
          recommendations.push({
            reasoningType: 'comparative',
            description: 'Analyze similarities and differences between options or scenarios',
            applicability: 8,
            examples: ['Side-by-side comparison', 'Evaluating trade-offs']
          });
          break;
          
        case 'Execution':
          if (!recommendations.some(r => r.reasoningType === 'deductive')) {
            recommendations.push({
              reasoningType: 'deductive',
              description: 'Apply established principles to implementation',
              applicability: 8,
              examples: ['Following best practices', 'Applying domain principles']
            });
          }
          
          // New reasoning type
          recommendations.push({
            reasoningType: 'procedural',
            description: 'Focus on step-by-step processes and implementation details',
            applicability: 9,
            examples: ['Creating action sequences', 'Defining workflows']
          });
          break;
          
        case 'Verification':
          recommendations.push({
            reasoningType: 'counterfactual',
            description: 'Test solution against alternative scenarios',
            applicability: 8,
            examples: ['Edge case testing', 'What-if analysis']
          });
          
          // New reasoning type
          recommendations.push({
            reasoningType: 'evaluative',
            description: 'Assess solutions against explicit criteria and requirements',
            applicability: 9,
            examples: ['Systematic testing', 'Requirements validation']
          });
          break;
      }
    }
    
    // Return top reasoning types (limit to 3 to avoid overwhelming)
    return recommendations.slice(0, 3);
  }

  /**
   * Estimates detailed complexity of the task based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Detailed complexity estimation
   */
  private estimateDetailedComplexity(promptMetadata: PromptMetadata): ComplexityEstimation {
    // Start with the basic complexity from prompt metadata
    const overallComplexity = promptMetadata.complexity;
    
    // Calculate dimensional complexity scores
    const conceptualComplexity = this.calculateConceptualComplexity(promptMetadata);
    const proceduralComplexity = this.calculateProceduralComplexity(promptMetadata);
    const contextualComplexity = this.calculateContextualComplexity(promptMetadata);
    const domainComplexity = this.calculateDomainComplexity(promptMetadata);
    
    // Calculate recommended thought count based on complexity
    let recommendedThoughtCount = 5; // Default for simple tasks
    
    if (overallComplexity === 'medium') {
      recommendedThoughtCount = 8;
    } else if (overallComplexity === 'complex') {
      recommendedThoughtCount = 12;
    }
    
    // Adjust based on dimensional complexity
    const avgDimensionalComplexity = (
      conceptualComplexity + 
      proceduralComplexity + 
      contextualComplexity + 
      domainComplexity
    ) / 4;
    
    // Fine-tune thought count based on dimensional complexity
    recommendedThoughtCount = Math.round(
      recommendedThoughtCount * (1 + (avgDimensionalComplexity - 5) / 10)
    );
    
    // Calculate recommended phase distribution
    const recommendedPhaseDistribution = this.calculatePhaseDistribution(
      overallComplexity,
      {
        conceptual: conceptualComplexity,
        procedural: proceduralComplexity,
        contextual: contextualComplexity,
        domain: domainComplexity
      }
    );
    
    return {
      overallComplexity,
      dimensionalComplexity: {
        conceptual: conceptualComplexity,
        procedural: proceduralComplexity,
        contextual: contextualComplexity,
        domain: domainComplexity
      },
      recommendedThoughtCount,
      recommendedPhaseDistribution
    };
  }

  /**
   * Calculates conceptual complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Conceptual complexity score (0-10)
   */
  private calculateConceptualComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Adjust based on number of goals
    complexity += Math.min(promptMetadata.goals.length - 1, 3);
    
    // Adjust based on number of domains
    complexity += Math.min(promptMetadata.domains.length - 1, 2);
    
    // Adjust based on task type
    if (promptMetadata.taskType === 'analytical' || promptMetadata.taskType === 'technical') {
      complexity += 1;
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates procedural complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Procedural complexity score (0-10)
   */
  private calculateProceduralComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Adjust based on number of constraints
    complexity += Math.min(promptMetadata.constraints.length, 3);
    
    // Adjust based on task type
    if (promptMetadata.taskType === 'technical') {
      complexity += 2;
    } else if (promptMetadata.taskType === 'analytical') {
      complexity += 1;
    }
    
    // Adjust based on priority
    if (promptMetadata.priority === 'high') {
      complexity += 1;
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates contextual complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Contextual complexity score (0-10)
   */
  private calculateContextualComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Adjust based on number of entities
    complexity += Math.min(promptMetadata.entities.length / 2, 3);
    
    // Adjust based on task type
    if (promptMetadata.taskType === 'mixed') {
      complexity += 2;
    } else if (promptMetadata.taskType === 'creative') {
      complexity += 1;
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates domain complexity based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Domain complexity score (0-10)
   */
  private calculateDomainComplexity(promptMetadata: PromptMetadata): number {
    let complexity = 5; // Start with medium complexity
    
    // Domain-specific complexity adjustments
    const complexDomains = [
      'quantum physics', 'machine learning', 'artificial intelligence',
      'cryptography', 'medicine', 'law', 'finance', 'mathematics'
    ];
    
    const mediumDomains = [
      'programming', 'engineering', 'biology', 'chemistry', 'psychology',
      'economics', 'business', 'education'
    ];
    
    // Check for complex domains
    for (const domain of promptMetadata.domains) {
      if (complexDomains.some(d => domain.toLowerCase().includes(d))) {
        complexity += 2;
        break;
      } else if (mediumDomains.some(d => domain.toLowerCase().includes(d))) {
        complexity += 1;
        break;
      }
    }
    
    // Ensure score is within 0-10 range
    return Math.max(0, Math.min(10, complexity));
  }

  /**
   * Calculates recommended phase distribution based on complexity
   * @param overallComplexity The overall complexity rating
   * @param dimensionalComplexity The dimensional complexity scores
   * @returns Recommended phase distribution
   */
  private calculatePhaseDistribution(
    overallComplexity: 'simple' | 'medium' | 'complex',
    dimensionalComplexity: {
      conceptual: number;
      procedural: number;
      contextual: number;
      domain: number;
    }
  ): {
    Planning: number;
    Analysis: number;
    Execution: number;
    Verification: number;
  } {
    // Default distributions based on overall complexity
    let distribution = {
      Planning: 0,
      Analysis: 0,
      Execution: 0,
      Verification: 0
    };
    
    switch (overallComplexity) {
      case 'simple':
        distribution = {
          Planning: 1,
          Analysis: 1,
          Execution: 2,
          Verification: 1
        };
        break;
        
      case 'medium':
        distribution = {
          Planning: 2,
          Analysis: 2,
          Execution: 3,
          Verification: 1
        };
        break;
        
      case 'complex':
        distribution = {
          Planning: 3,
          Analysis: 3,
          Execution: 4,
          Verification: 2
        };
        break;
    }
    
    // Adjust based on dimensional complexity
    if (dimensionalComplexity.conceptual > 7) {
      distribution.Planning += 1;
      distribution.Analysis += 1;
    }
    
    if (dimensionalComplexity.procedural > 7) {
      distribution.Execution += 1;
    }
    
    if (dimensionalComplexity.contextual > 7) {
      distribution.Analysis += 1;
    }
    
    if (dimensionalComplexity.domain > 7) {
      distribution.Analysis += 1;
      distribution.Verification += 1;
    }
    
    return distribution;
  }

  /**
   * Recommends tools based on prompt metadata and current phase
   * @param promptMetadata The analyzed prompt metadata
   * @param phase The current thinking phase
   * @returns Array of recommended tool names
   */
  private recommendTools(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): string[] {
    const recommendations: string[] = [];
    
    // Always recommend sequential thinking
    recommendations.push('sequentialthinking');
    
    // Task-type specific tool recommendations
    switch (promptMetadata.taskType) {
      case 'creative':
        recommendations.push('brainstorming');
        recommendations.push('analogyMapping');
        break;
        
      case 'analytical':
        recommendations.push('dataAnalysis');
        recommendations.push('logicalReasoning');
        break;
        
      case 'informational':
        recommendations.push('informationRetrieval');
        recommendations.push('factChecking');
        break;
        
      case 'technical':
        recommendations.push('codeGeneration');
        recommendations.push('technicalDocumentation');
        break;
    }
    
    // Phase-specific tool recommendations
    if (phase) {
      switch (phase) {
        case 'Planning':
          recommendations.push('goalDecomposition');
          break;
          
        case 'Analysis':
          recommendations.push('rootCauseAnalysis');
          break;
          
        case 'Execution':
          recommendations.push('stepByStepImplementation');
          break;
          
        case 'Verification':
          recommendations.push('qualityAssessment');
          break;
      }
    }
    
    // Filter out duplicates and return
    return [...new Set(recommendations)];
  }

  /**
   * Identifies key focus areas based on prompt metadata and progress
   * @param promptMetadata The analyzed prompt metadata
   * @param currentThoughtNumber The current thought number
   * @param totalThoughts The total estimated thoughts
   * @returns Array of focus areas
   */
  private identifyFocusAreas(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): string[] {
    const focusAreas: string[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Early stage focus areas
    if (progress < 0.3) {
      focusAreas.push('Ensure comprehensive understanding of the problem');
      focusAreas.push('Identify key constraints and requirements');
      
      if (promptMetadata.complexity === 'complex') {
        focusAreas.push('Break down the problem into manageable components');
      }
    }
    // Middle stage focus areas
    else if (progress >= 0.3 && progress < 0.7) {
      focusAreas.push('Develop detailed solution approaches');
      focusAreas.push('Address the most challenging aspects first');
      
      if (promptMetadata.taskType === 'creative') {
        focusAreas.push('Explore multiple alternative approaches');
      } else if (promptMetadata.taskType === 'analytical') {
        focusAreas.push('Ensure logical consistency in your analysis');
      }
    }
    // Late stage focus areas
    else {
      focusAreas.push('Synthesize insights from previous thoughts');
      focusAreas.push('Verify solution against original requirements');
      
      if (promptMetadata.priority === 'high') {
        focusAreas.push('Ensure solution addresses highest priority aspects');
      }
    }
    
    // Add focus areas based on prompt goals
    if (promptMetadata.goals.length > 0) {
      // Add the first goal as a focus area
      focusAreas.push(`Address the key goal: ${promptMetadata.goals[0]}`);
    }
    
    return focusAreas;
  }

  /**
   * Identifies potential pitfalls based on prompt metadata
   * @param promptMetadata The analyzed prompt metadata
   * @returns Array of potential pitfalls
   */
  private identifyPotentialPitfalls(promptMetadata: PromptMetadata): string[] {
    const pitfalls: string[] = [];
    
    // Task-type specific pitfalls
    switch (promptMetadata.taskType) {
      case 'creative':
        pitfalls.push('Focusing too narrowly on conventional solutions');
        pitfalls.push('Failing to validate creative ideas against practical constraints');
        break;
        
      case 'analytical':
        pitfalls.push('Making unwarranted assumptions without evidence');
        pitfalls.push('Overlooking important variables or factors');
        break;
        
      case 'informational':
        pitfalls.push('Providing excessive detail without clear organization');
        pitfalls.push('Failing to prioritize the most relevant information');
        break;
        
      case 'technical':
        pitfalls.push('Overlooking edge cases or error conditions');
        pitfalls.push('Focusing on implementation details before understanding requirements');
        break;
        
      case 'mixed':
        pitfalls.push('Inconsistent approach across different aspects of the problem');
        pitfalls.push('Failing to integrate creative and analytical components');
        break;
    }
    
    // Complexity-specific pitfalls
    switch (promptMetadata.complexity) {
      case 'complex':
        pitfalls.push('Getting lost in details without maintaining big-picture view');
        pitfalls.push('Failing to recognize interdependencies between components');
        break;
    }
    
    // Constraint-related pitfalls
    if (promptMetadata.constraints.length > 0) {
      pitfalls.push('Developing solutions that violate key constraints');
    }
    
    // Domain-specific pitfalls
    if (promptMetadata.domains.includes('technical') || 
        promptMetadata.domains.includes('programming') ||
        promptMetadata.domains.includes('engineering')) {
      pitfalls.push('Proposing technically infeasible solutions');
    }
    
    return pitfalls;
  }
  /**
   * Detects potential cognitive biases based on prompt type and phase
   */
  private detectPotentialCognitiveBiases(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): CognitiveBiasDetection[] {
    const biases: CognitiveBiasDetection[] = [];
    
    // Add task-specific biases
    switch (promptMetadata.taskType) {
      case 'creative':
        biases.push({
          biasType: 'Novelty bias',
          description: 'Favoring ideas that seem new over those that are effective',
          likelihood: 0.7,
          mitigationStrategy: 'Balance novelty with practicality by evaluating ideas against concrete criteria'
        });
        break;
        
      case 'analytical':
        biases.push({
          biasType: 'Confirmation bias',
          description: 'Seeking information that confirms existing hypotheses',
          likelihood: 0.8,
          mitigationStrategy: 'Actively search for disconfirming evidence and alternative explanations'
        });
        break;
        
      case 'technical':
        biases.push({
          biasType: 'Sunk cost fallacy',
          description: 'Continuing with an approach because of prior investment',
          likelihood: 0.6,
          mitigationStrategy: 'Evaluate approaches based on future utility, not past investment'
        });
        break;
    }
    
    // Add phase-specific biases
    if (phase) {
      switch (phase) {
        case 'Planning':
          biases.push({
            biasType: 'Planning fallacy',
            description: 'Underestimating time and resources needed',
            likelihood: 0.75,
            mitigationStrategy: 'Add buffer time and consider past similar tasks as reference points'
          });
          break;
          
        case 'Analysis':
          biases.push({
            biasType: 'Anchoring bias',
            description: 'Over-relying on first piece of information encountered',
            likelihood: 0.65,
            mitigationStrategy: 'Consider multiple starting points and diverse information sources'
          });
          break;
          
        case 'Execution':
          biases.push({
            biasType: 'Optimism bias',
            description: 'Overestimating likelihood of positive outcomes',
            likelihood: 0.7,
            mitigationStrategy: 'Conduct pre-mortems to identify potential failure points'
          });
          break;
          
        case 'Verification':
          biases.push({
            biasType: 'Availability bias',
            description: 'Judging quality based on easily recalled examples',
            likelihood: 0.6,
            mitigationStrategy: 'Use structured evaluation criteria rather than relying on memory'
          });
          break;
      }
    }
    
    // Add complexity-specific biases
    if (promptMetadata.complexity === 'complex') {
      biases.push({
        biasType: 'Simplification bias',
        description: 'Reducing complex problems to simpler models that miss key factors',
        likelihood: 0.8,
        mitigationStrategy: 'Explicitly map out interconnections and feedback loops'
      });
    }
    
    return biases;
  }

  /**
   * Recommends metacognitive strategies to enhance thinking quality
   */
  private recommendMetacognitiveStrategies(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): MetacognitiveStrategy[] {
    const strategies: MetacognitiveStrategy[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // General metacognitive strategies
    strategies.push({
      strategyName: 'Explicit assumption testing',
      description: 'Identify and validate key assumptions underlying your thinking',
      applicability: 8,
      expectedBenefit: 'Reduces risk of building on faulty premises'
    });
    
    strategies.push({
      strategyName: 'Counterfactual thinking',
      description: 'Consider what would happen if key facts or assumptions were different',
      applicability: 7,
      expectedBenefit: 'Reveals dependencies and alternative possibilities'
    });
    
    // Progress-specific strategies
    if (progress < 0.3) {
      // Early stage
      strategies.push({
        strategyName: 'Problem reframing',
        description: 'Describe the problem in multiple different ways to reveal new aspects',
        applicability: 9,
        expectedBenefit: 'Prevents premature narrowing of problem scope'
      });
    } else if (progress < 0.7) {
      // Middle stage
      strategies.push({
        strategyName: 'Intermediate synthesis',
        description: 'Periodically integrate insights from multiple thoughts into coherent models',
        applicability: 9,
        expectedBenefit: 'Prevents fragmentation of thinking across multiple thoughts'
      });
    } else {
      // Late stage
      strategies.push({
        strategyName: 'Critical review',
        description: 'Systematically evaluate the strength of your solution against requirements',
        applicability: 9,
        expectedBenefit: 'Identifies gaps before finalizing solution'
      });
    }
    
    // Task-specific strategies
    switch (promptMetadata.taskType) {
      case 'creative':
        strategies.push({
          strategyName: 'Constraint relaxation',
          description: 'Temporarily ignore constraints to explore novel possibilities',
          applicability: 8,
          expectedBenefit: 'Generates innovative options that can be refined to meet constraints'
        });
        break;
        
      case 'analytical':
        strategies.push({
          strategyName: 'Multiple models analysis',
          description: 'Apply different analytical frameworks to the same problem',
          applicability: 8,
          expectedBenefit: 'Reveals insights that any single model might miss'
        });
        break;
        
      case 'technical':
        strategies.push({
          strategyName: 'Edge case identification',
          description: 'Systematically identify boundary conditions and exceptions',
          applicability: 9,
          expectedBenefit: 'Prevents failures in non-standard scenarios'
        });
        break;
    }
    
    return strategies.slice(0, 3); // Return top 3 strategies
  }

  /**
   * Generates adaptive suggestions based on current context
   */
  private generateAdaptiveSuggestions(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): string[] {
    const suggestions: string[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Progress-based suggestions
    if (progress < 0.2) {
      suggestions.push('Consider spending more time understanding the problem before diving into solutions');
    } else if (progress > 0.8) {
      suggestions.push('Begin synthesizing key insights from your thinking process');
    }
    
    // Phase transition suggestions
    if (phase === 'Planning' && progress > 0.3) {
      suggestions.push('Consider transitioning from planning to analysis phase');
    } else if (phase === 'Analysis' && progress > 0.5) {
      suggestions.push('Consider moving from analysis to execution phase');
    } else if (phase === 'Execution' && progress > 0.8) {
      suggestions.push('Begin verification of your solution');
    }
    
    // Complexity-based suggestions
    if (promptMetadata.complexity === 'complex') {
      suggestions.push('Break down complex aspects into manageable components');
      suggestions.push('Regularly zoom out to maintain perspective on the overall problem');
    }
    
    // Task-specific adaptive suggestions
    switch (promptMetadata.taskType) {
      case 'creative':
        if (currentThoughtNumber > 3) {
          suggestions.push('Consider combining elements from your previous thoughts in novel ways');
        }
        break;
        
      case 'analytical':
        if (currentThoughtNumber > 3) {
          suggestions.push('Look for patterns or contradictions across your previous analyses');
        }
        break;
        
      case 'technical':
        suggestions.push('Consider both the implementation details and the user experience');
        break;
        
      case 'informational':
        suggestions.push('Ensure information is organized in a logical hierarchy');
        break;
    }
    
    return suggestions;
  }

  /**
   * Generates prompts to stimulate insight generation
   */
  private generateInsightPrompts(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): string[] {
    const prompts: string[] = [];
    
    // General insight prompts
    prompts.push('What unexpected connections exist between different aspects of this problem?');
    prompts.push('What would an expert in this domain notice that others might miss?');
    
    // Phase-specific prompts
    if (phase) {
      switch (phase) {
        case 'Planning':
          prompts.push('What hidden assumptions might be limiting your planning approach?');
          prompts.push('What would a completely different planning approach look like?');
          break;
          
        case 'Analysis':
          prompts.push("What patterns or anomalies in the data haven't been explained yet?");
          prompts.push('What would change if a key assumption in your analysis was incorrect?');
          break;
          
        case 'Execution':
          prompts.push('What elegant simplifications could make this solution more robust?');
          prompts.push('What aspects of the implementation might create unexpected effects?');
          break;
          
        case 'Verification':
          prompts.push("What perspectives or criteria haven't been considered in verification?");
          prompts.push('What would be the most surprising way this solution could fail?');
          break;
      }
    }
    
    // Domain-specific prompts
    if (promptMetadata.domains.length > 0) {
      prompts.push(`How might principles from ${promptMetadata.domains[0]} be applied in unexpected ways?`);
    }
    
    // Task-specific prompts
    switch (promptMetadata.taskType) {
      case 'creative':
        prompts.push('What if you combined seemingly unrelated elements of this problem?');
        prompts.push("How would you approach this if traditional constraints didn't apply?");
        break;
        
      case 'analytical':
        prompts.push("What alternative explanations haven't been considered yet?");
        prompts.push("What meta-patterns exist across different analyses you've performed?");
        break;
        
      case 'technical':
        prompts.push('What elegant architectural patterns could simplify this solution?');
        prompts.push('How might this solution evolve or need to adapt in the future?');
        break;
        
      case 'informational':
        prompts.push("What deeper principles connect the information you've gathered?");
        prompts.push('What context or background would make this information more meaningful?');
        break;
    }
    
    return prompts.slice(0, 3); // Return top 3 prompts
  }

  /**
   * Generates adaptive learning recommendations based on prompt and progress
   */
  private generateAdaptiveLearningRecommendations(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): AdaptiveLearningRecommendation[] {
    const recommendations: AdaptiveLearningRecommendation[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Identify learning areas based on prompt domains
    promptMetadata.domains.forEach(domain => {
      // Generate domain-specific learning recommendations
      const learningRec = this.generateDomainLearningRecommendation(domain, promptMetadata.complexity);
      if (learningRec) {
        recommendations.push(learningRec);
      }
    });
    
    // Add task-specific learning recommendations
    const taskRec = this.generateTaskLearningRecommendation(promptMetadata.taskType, progress);
    if (taskRec) {
      recommendations.push(taskRec);
    }
    
    // Add complexity-based learning recommendations
    if (promptMetadata.complexity === 'complex') {
      recommendations.push({
        learningArea: 'Complex Problem Decomposition',
        currentLevel: 'intermediate',
        recommendedResources: [
          'Breaking down complex problems into manageable components',
          'Identifying dependencies between sub-problems',
          'Tracking progress across multiple problem dimensions'
        ],
        expectedBenefits: [
          'More systematic approach to complex problems',
          'Better organization of thoughts and solutions',
          'Reduced cognitive load through structured decomposition'
        ],
        relevanceToPrompt: 9
      });
    }
    
    return recommendations.slice(0, 2); // Return top 2 recommendations
  }
  
  /**
   * Generates domain-specific learning recommendations
   */
  private generateDomainLearningRecommendation(
    domain: string, 
    complexity: 'simple' | 'medium' | 'complex'
  ): AdaptiveLearningRecommendation | null {
    // Domain-specific learning recommendations
    const domainRecommendations: Record<string, AdaptiveLearningRecommendation> = {
      'programming': {
        learningArea: 'Programming Patterns',
        currentLevel: complexity === 'simple' ? 'beginner' : 
                      complexity === 'medium' ? 'intermediate' : 'advanced',
        recommendedResources: [
          'Design patterns for maintainable code',
          'Testing strategies for robust software',
          'Performance optimization techniques'
        ],
        expectedBenefits: [
          'More elegant and maintainable solutions',
          'Fewer bugs and edge cases',
          'Better performance characteristics'
        ],
        relevanceToPrompt: 8
      },
      'math': {
        learningArea: 'Mathematical Reasoning',
        currentLevel: complexity === 'simple' ? 'beginner' : 
                      complexity === 'medium' ? 'intermediate' : 'advanced',
        recommendedResources: [
          'Formal proof techniques',
          'Mathematical modeling approaches',
          'Numerical analysis methods'
        ],
        expectedBenefits: [
          'More rigorous analytical thinking',
          'Better quantitative problem solving',
          'Improved ability to formalize problems'
        ],
        relevanceToPrompt: 8
      },
      'business': {
        learningArea: 'Strategic Business Analysis',
        currentLevel: complexity === 'simple' ? 'beginner' : 
                      complexity === 'medium' ? 'intermediate' : 'advanced',
        recommendedResources: [
          'Competitive analysis frameworks',
          'Market sizing and segmentation',
          'Business model innovation'
        ],
        expectedBenefits: [
          'More comprehensive business analysis',
          'Better strategic recommendations',
          'Improved market understanding'
        ],
        relevanceToPrompt: 8
      },
      'writing': {
        learningArea: 'Effective Communication',
        currentLevel: complexity === 'simple' ? 'beginner' : 
                      complexity === 'medium' ? 'intermediate' : 'advanced',
        recommendedResources: [
          'Structured argumentation techniques',
          'Narrative development methods',
          'Audience-centered writing'
        ],
        expectedBenefits: [
          'More persuasive communication',
          'Better organized content',
          'Improved engagement with readers'
        ],
        relevanceToPrompt: 8
      }
    };
    
    // Find matching domain or closest match
    for (const [key, recommendation] of Object.entries(domainRecommendations)) {
      if (domain.toLowerCase().includes(key) || key.includes(domain.toLowerCase())) {
        return recommendation;
      }
    }
    
    return null;
  }
  
  /**
   * Generates task-specific learning recommendations
   */
  private generateTaskLearningRecommendation(
    taskType: string,
    progress: number
  ): AdaptiveLearningRecommendation | null {
    // Task-specific learning recommendations
    const taskRecommendations: Record<string, AdaptiveLearningRecommendation> = {
      'creative': {
        learningArea: 'Creative Problem Solving',
        currentLevel: 'intermediate',
        recommendedResources: [
          'Lateral thinking techniques',
          'Constraint relaxation methods',
          'Analogical reasoning approaches'
        ],
        expectedBenefits: [
          'More innovative solutions',
          'Breaking out of conventional thinking patterns',
          'Finding unexpected connections between ideas'
        ],
        relevanceToPrompt: 9
      },
      'analytical': {
        learningArea: 'Analytical Reasoning',
        currentLevel: 'intermediate',
        recommendedResources: [
          'Hypothesis testing frameworks',
          'Causal analysis techniques',
          'Evidence evaluation methods'
        ],
        expectedBenefits: [
          'More rigorous analysis',
          'Better identification of root causes',
          'Improved ability to evaluate competing explanations'
        ],
        relevanceToPrompt: 9
      },
      'technical': {
        learningArea: 'Technical Problem Solving',
        currentLevel: 'intermediate',
        recommendedResources: [
          'Systems thinking approaches',
          'Technical requirement analysis',
          'Implementation planning techniques'
        ],
        expectedBenefits: [
          'More robust technical solutions',
          'Better anticipation of edge cases',
          'Improved implementation planning'
        ],
        relevanceToPrompt: 9
      }
    };
    
    // Return task-specific recommendation if available
    return taskRecommendations[taskType] || null;
  }

  /**
   * Analyzes thought patterns across multiple thoughts
   * @param thoughts Array of previous thoughts
   * @param promptMetadata The prompt metadata for context
   * @returns Analysis of thought patterns
   */
  public analyzeThoughtPatterns(
    thoughts: Array<{
      thought: string;
      phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification';
      classification?: string;
      toolsUsed?: string[];
    }>,
    promptMetadata: PromptMetadata
  ): ThoughtPatternAnalysis {
    // Skip if not enough thoughts
    if (thoughts.length < 3) {
      return {
        dominantPatterns: [],
        suggestedPatternShifts: [],
        thinkingDiversity: 5,
        patternEvolution: 'stable'
      };
    }
    
    // Analyze phase distribution
    const phaseDistribution = this.analyzePhaseDistribution(thoughts);
    
    // Analyze tool usage patterns
    const toolUsagePatterns = this.analyzeToolUsagePatterns(thoughts);
    
    // Analyze classification patterns
    const classificationPatterns = this.analyzeClassificationPatterns(thoughts);
    
    // Identify dominant patterns
    const dominantPatterns = this.identifyDominantPatterns(
      phaseDistribution, 
      toolUsagePatterns, 
      classificationPatterns,
      promptMetadata
    );
    
    // Calculate thinking diversity
    const thinkingDiversity = this.calculateThinkingDiversity(
      phaseDistribution,
      toolUsagePatterns,
      classificationPatterns
    );
    
    // Determine pattern evolution
    const patternEvolution = this.determinePatternEvolution(thoughts);
    
    // Generate suggested pattern shifts
    const suggestedPatternShifts = this.generatePatternShifts(
      dominantPatterns,
      promptMetadata,
      thinkingDiversity
    );
    
    return {
      dominantPatterns,
      suggestedPatternShifts,
      thinkingDiversity,
      patternEvolution
    };
  }
  
  /**
   * Analyzes the distribution of thinking phases
   */
  private analyzePhaseDistribution(thoughts: Array<{
    thought: string;
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification';
  }>): Record<string, number> {
    const distribution: Record<string, number> = {
      'Planning': 0,
      'Analysis': 0,
      'Execution': 0,
      'Verification': 0
    };
    
    // Count occurrences of each phase
    thoughts.forEach(thought => {
      if (thought.phase) {
        distribution[thought.phase]++;
      }
    });
    
    // Convert to percentages
    const total = thoughts.length;
    Object.keys(distribution).forEach(phase => {
      distribution[phase] = distribution[phase] / total;
    });
    
    return distribution;
  }
  
  /**
   * Analyzes tool usage patterns
   */
  private analyzeToolUsagePatterns(thoughts: Array<{
    thought: string;
    toolsUsed?: string[];
  }>): Array<{
    tool: string;
    frequency: number;
  }> {
    const toolCounts: Record<string, number> = {};
    
    // Count tool usage
    thoughts.forEach(thought => {
      if (thought.toolsUsed && thought.toolsUsed.length > 0) {
        thought.toolsUsed.forEach(tool => {
          toolCounts[tool] = (toolCounts[tool] || 0) + 1;
        });
      }
    });
    
    // Convert to frequency array
    const total = thoughts.length;
    return Object.entries(toolCounts)
      .map(([tool, count]) => ({
        tool,
        frequency: count / total
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
  
  /**
   * Analyzes classification patterns
   */
  private analyzeClassificationPatterns(thoughts: Array<{
    thought: string;
    classification?: string;
  }>): Array<{
    classification: string;
    frequency: number;
  }> {
    const classificationCounts: Record<string, number> = {};
    
    // Count classifications
    thoughts.forEach(thought => {
      if (thought.classification) {
        classificationCounts[thought.classification] = 
          (classificationCounts[thought.classification] || 0) + 1;
      }
    });
    
    // Convert to frequency array
    const total = thoughts.filter(t => t.classification).length || 1;
    return Object.entries(classificationCounts)
      .map(([classification, count]) => ({
        classification,
        frequency: count / total
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }
  
  /**
   * Identifies dominant thought patterns
   */
  private identifyDominantPatterns(
    phaseDistribution: Record<string, number>,
    toolUsagePatterns: Array<{ tool: string; frequency: number }>,
    classificationPatterns: Array<{ classification: string; frequency: number }>,
    promptMetadata: PromptMetadata
  ): Array<{
    patternName: string;
    description: string;
    frequency: number;
    impact: 'positive' | 'neutral' | 'negative';
  }> {
    const patterns: Array<{
      patternName: string;
      description: string;
      frequency: number;
      impact: 'positive' | 'neutral' | 'negative';
    }> = [];
    
    // Check for phase-based patterns
    if (phaseDistribution['Planning'] > 0.4) {
      patterns.push({
        patternName: 'Planning-Heavy',
        description: 'Significant focus on planning phase',
        frequency: phaseDistribution['Planning'],
        impact: promptMetadata.complexity === 'complex' ? 'positive' : 'negative'
      });
    }
    
    if (phaseDistribution['Execution'] > 0.6) {
      patterns.push({
        patternName: 'Execution-Focused',
        description: 'Strong emphasis on execution with less planning/verification',
        frequency: phaseDistribution['Execution'],
        impact: promptMetadata.complexity === 'simple' ? 'positive' : 'negative'
      });
    }
    
    if (phaseDistribution['Verification'] < 0.1) {
      patterns.push({
        patternName: 'Verification-Light',
        description: 'Limited verification of solutions',
        frequency: 1 - phaseDistribution['Verification'],
        impact: 'negative'
      });
    }
    
    // Check for tool-based patterns
    if (toolUsagePatterns.length === 0) {
      patterns.push({
        patternName: 'Tool-Avoidant',
        description: 'Minimal use of available tools',
        frequency: 0.8,
        impact: 'negative'
      });
    } else if (toolUsagePatterns[0].frequency > 0.7) {
      patterns.push({
        patternName: 'Single-Tool-Dominant',
        description: `Heavy reliance on ${toolUsagePatterns[0].tool}`,
        frequency: toolUsagePatterns[0].frequency,
        impact: 'neutral'
      });
    }
    
    // Check for classification-based patterns
    if (classificationPatterns.length > 0 && classificationPatterns[0].frequency > 0.6) {
      const dominantClassification = classificationPatterns[0].classification;
      patterns.push({
        patternName: `${dominantClassification}-Dominant`,
        description: `Thinking primarily classified as ${dominantClassification}`,
        frequency: classificationPatterns[0].frequency,
        impact: this.evaluateClassificationImpact(dominantClassification, promptMetadata)
      });
    }
    
    return patterns;
  }
  
  /**
   * Evaluates the impact of a dominant classification
   */
  private evaluateClassificationImpact(
    classification: string,
    promptMetadata: PromptMetadata
  ): 'positive' | 'neutral' | 'negative' {
    // Task-specific classification impact
    const positiveClassifications: Record<string, string[]> = {
      'creative': ['hypothesis', 'question'],
      'analytical': ['observation', 'conclusion'],
      'technical': ['solution'],
      'informational': ['observation']
    };
    
    // Check if this classification is positive for this task type
    if (
      positiveClassifications[promptMetadata.taskType] && 
      positiveClassifications[promptMetadata.taskType].includes(classification)
    ) {
      return 'positive';
    }
    
    // Default impact based on diversity
    return 'neutral';
  }
  
  /**
   * Calculates thinking diversity score
   */
  private calculateThinkingDiversity(
    phaseDistribution: Record<string, number>,
    toolUsagePatterns: Array<{ tool: string; frequency: number }>,
    classificationPatterns: Array<{ classification: string; frequency: number }>
  ): number {
    let diversityScore = 5; // Start with neutral score
    
    // Phase diversity
    const phaseValues = Object.values(phaseDistribution);
    const phaseEntropy = this.calculateEntropy(phaseValues);
    diversityScore += phaseEntropy * 2; // 0-2 points
    
    // Tool diversity
    const toolFrequencies = toolUsagePatterns.map(p => p.frequency);
    if (toolFrequencies.length > 0) {
      const toolEntropy = this.calculateEntropy(toolFrequencies);
      diversityScore += toolEntropy * 1.5; // 0-1.5 points
    }
    
    // Classification diversity
    const classificationFrequencies = classificationPatterns.map(p => p.frequency);
    if (classificationFrequencies.length > 0) {
      const classificationEntropy = this.calculateEntropy(classificationFrequencies);
      diversityScore += classificationEntropy * 1.5; // 0-1.5 points
    }
    
    // Cap at 0-10
    return Math.max(0, Math.min(10, diversityScore));
  }
  
  /**
   * Calculates entropy as a measure of diversity
   */
  private calculateEntropy(probabilities: number[]): number {
    // Filter out zeros and normalize
    const validProbs = probabilities.filter(p => p > 0);
    const sum = validProbs.reduce((a, b) => a + b, 0);
    const normalizedProbs = validProbs.map(p => p / sum);
    
    // Calculate entropy
    const entropy = -normalizedProbs.reduce((sum, p) => sum + p * Math.log2(p), 0);
    
    // Normalize to 0-1 range (max entropy for n values is log2(n))
    const maxEntropy = Math.log2(normalizedProbs.length || 1);
    return maxEntropy === 0 ? 0 : entropy / maxEntropy;
  }
  
  /**
   * Determines how thought patterns are evolving
   */
  private determinePatternEvolution(thoughts: Array<{
    thought: string;
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification';
    classification?: string;
    toolsUsed?: string[];
  }>): 'improving' | 'stable' | 'narrowing' {
    if (thoughts.length < 5) return 'stable';
    
    // Split into first and second half
    const midpoint = Math.floor(thoughts.length / 2);
    const firstHalf = thoughts.slice(0, midpoint);
    const secondHalf = thoughts.slice(midpoint);
    
    // Calculate diversity for each half
    const firstHalfDiversity = this.calculateThinkingDiversity(
      this.analyzePhaseDistribution(firstHalf),
      this.analyzeToolUsagePatterns(firstHalf),
      this.analyzeClassificationPatterns(firstHalf)
    );
    
    const secondHalfDiversity = this.calculateThinkingDiversity(
      this.analyzePhaseDistribution(secondHalf),
      this.analyzeToolUsagePatterns(secondHalf),
      this.analyzeClassificationPatterns(secondHalf)
    );
    
    // Determine trend
    const difference = secondHalfDiversity - firstHalfDiversity;
    if (difference > 1) return 'improving';
    if (difference < -1) return 'narrowing';
    return 'stable';
  }
  
  /**
   * Generates suggested pattern shifts
   */
  private generatePatternShifts(
    dominantPatterns: Array<{
      patternName: string;
      description: string;
      frequency: number;
      impact: 'positive' | 'neutral' | 'negative';
    }>,
    promptMetadata: PromptMetadata,
    thinkingDiversity: number
  ): Array<{
    from: string;
    to: string;
    benefit: string;
  }> {
    const shifts: Array<{
      from: string;
      to: string;
      benefit: string;
    }> = [];
    
    // Generate shifts for negative patterns
    dominantPatterns
      .filter(pattern => pattern.impact === 'negative')
      .forEach(pattern => {
        if (pattern.patternName === 'Planning-Heavy') {
          shifts.push({
            from: 'Excessive planning',
            to: 'Balanced execution and verification',
            benefit: 'More concrete progress and validation of ideas'
          });
        }
        
        if (pattern.patternName === 'Execution-Focused' && promptMetadata.complexity !== 'simple') {
          shifts.push({
            from: 'Immediate execution',
            to: 'More thorough planning and analysis',
            benefit: 'Better structured approach for complex problems'
          });
        }
        
        if (pattern.patternName === 'Verification-Light') {
          shifts.push({
            from: 'Limited verification',
            to: 'Systematic solution testing',
            benefit: 'Higher quality, more robust solutions'
          });
        }
        
        if (pattern.patternName === 'Tool-Avoidant') {
          shifts.push({
            from: 'Manual reasoning only',
            to: 'Strategic tool utilization',
            benefit: 'Enhanced capabilities and efficiency'
          });
        }
      });
    
    // Add diversity-based shifts
    if (thinkingDiversity < 5) {
      shifts.push({
        from: 'Narrow thinking patterns',
        to: 'Diverse reasoning approaches',
        benefit: 'More creative and comprehensive solutions'
      });
      
      // Task-specific diversity recommendations
      if (promptMetadata.taskType === 'creative') {
        shifts.push({
          from: 'Conventional thinking',
          to: 'Exploratory and divergent thinking',
          benefit: 'More innovative and original ideas'
        });
      } else if (promptMetadata.taskType === 'analytical') {
        shifts.push({
          from: 'Single analytical framework',
          to: 'Multiple analytical perspectives',
          benefit: 'More robust and nuanced analysis'
        });
      }
    }
    
    return shifts;
  }
  /**
   * Recommends cognitive models based on prompt metadata and phase
   */
  private recommendCognitiveModels(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): CognitiveModel[] {
    const models: CognitiveModel[] = [];
    
    // Add task-specific cognitive models
    switch (promptMetadata.taskType) {
      case 'creative':
        models.push({
          modelName: 'Divergent-Convergent Thinking',
          description: 'Alternating between generating many possibilities and narrowing down to the best options',
          applicability: 9,
          strengths: ['Encourages exploration of many options', 'Balances creativity with practicality'],
          limitations: ['Can be time-consuming', 'Requires discipline to switch between modes'],
          recommendedUses: ['Brainstorming sessions', 'Design challenges', 'Problem reframing']
        });
        
        models.push({
          modelName: 'Associative Network Model',
          description: 'Forming connections between seemingly unrelated concepts to generate novel ideas',
          applicability: 8,
          strengths: ['Produces unexpected combinations', 'Breaks conventional thinking patterns'],
          limitations: ['Can lead to impractical ideas', 'Effectiveness varies with domain knowledge'],
          recommendedUses: ['Generating novel solutions', 'Breaking creative blocks', 'Conceptual innovation']
        });
        break;
        
      case 'analytical':
        models.push({
          modelName: 'Bayesian Reasoning',
          description: 'Updating beliefs based on new evidence using probability theory principles',
          applicability: 9,
          strengths: ['Handles uncertainty well', 'Provides framework for evidence evaluation', 'Reduces cognitive biases'],
          limitations: ['Requires quantification of beliefs', 'Can be computationally intensive'],
          recommendedUses: ['Hypothesis testing', 'Risk assessment', 'Decision making under uncertainty']
        });
        
        models.push({
          modelName: 'Causal Network Analysis',
          description: 'Mapping cause-effect relationships to understand system behavior',
          applicability: 8,
          strengths: ['Reveals hidden dependencies', 'Supports intervention planning', 'Identifies leverage points'],
          limitations: ['Difficult to validate causal links', 'Can oversimplify complex systems'],
          recommendedUses: ['Root cause analysis', 'Impact assessment', 'System optimization']
        });
        break;
        
      case 'technical':
        models.push({
          modelName: 'Hierarchical Problem Decomposition',
          description: 'Breaking complex problems into nested sub-problems with clear dependencies',
          applicability: 9,
          strengths: ['Manages complexity effectively', 'Creates clear work breakdown', 'Supports parallel processing'],
          limitations: ['May miss cross-cutting concerns', 'Requires clear problem boundaries'],
          recommendedUses: ['Software architecture', 'Project planning', 'Algorithm design']
        });
        
        models.push({
          modelName: 'Design Pattern Recognition',
          description: 'Identifying and applying established solution patterns to technical problems',
          applicability: 8,
          strengths: ['Leverages proven solutions', 'Provides common vocabulary', 'Accelerates problem solving'],
          limitations: ['Can lead to over-engineering', 'Requires pattern knowledge'],
          recommendedUses: ['Software design', 'Architecture planning', 'System integration']
        });
        break;
        
      case 'informational':
        models.push({
          modelName: 'Information Hierarchy Model',
          description: 'Organizing information in levels from general to specific with clear relationships',
          applicability: 9,
          strengths: ['Improves information accessibility', 'Supports progressive disclosure', 'Clarifies relationships'],
          limitations: ['Can oversimplify complex topics', 'Requires clear categorization'],
          recommendedUses: ['Content organization', 'Knowledge base design', 'Educational material']
        });
        break;
    }
    
    // Add phase-specific cognitive models
    if (phase) {
      switch (phase) {
        case 'Planning':
          models.push({
            modelName: 'Scenario Planning',
            description: 'Developing multiple future scenarios to prepare for different possibilities',
            applicability: 8,
            strengths: ['Improves adaptability', 'Identifies key uncertainties', 'Prevents tunnel vision'],
            limitations: ['Can be resource intensive', 'Difficult to determine scenario probabilities'],
            recommendedUses: ['Strategic planning', 'Risk management', 'Contingency planning']
          });
          break;
          
        case 'Analysis':
          models.push({
            modelName: 'Multi-perspective Analysis',
            description: 'Examining a problem from multiple stakeholder or disciplinary perspectives',
            applicability: 8,
            strengths: ['Reveals blind spots', 'Generates comprehensive understanding', 'Reduces bias'],
            limitations: ['Can be time-consuming', 'Requires diverse knowledge'],
            recommendedUses: ['Complex problem analysis', 'Stakeholder management', 'Interdisciplinary challenges']
          });
          break;
          
        case 'Execution':
          models.push({
            modelName: 'Implementation Mapping',
            description: 'Creating detailed execution plans with dependencies, resources, and milestones',
            applicability: 8,
            strengths: ['Clarifies execution steps', 'Identifies resource needs', 'Supports tracking'],
            limitations: ['Can become outdated quickly', 'May create false sense of certainty'],
            recommendedUses: ['Project implementation', 'Process design', 'Resource allocation']
          });
          break;
          
        case 'Verification':
          models.push({
            modelName: 'Falsification Testing',
            description: 'Actively trying to disprove assumptions and find flaws in solutions',
            applicability: 9,
            strengths: ['Identifies weaknesses proactively', 'Improves solution robustness', 'Reduces confirmation bias'],
            limitations: ['Can create negative mindset', 'Requires intellectual honesty'],
            recommendedUses: ['Solution validation', 'Quality assurance', 'Critical review']
          });
          break;
      }
    }
    
    // Add complexity-specific models
    if (promptMetadata.complexity === 'complex') {
      models.push({
        modelName: 'Systems Thinking',
        description: 'Analyzing problems in terms of interconnected elements, feedback loops, and emergent properties',
        applicability: 9,
        strengths: ['Reveals emergent behaviors', 'Identifies leverage points', 'Prevents reductionist thinking'],
        limitations: ['Difficult to validate models', 'Can be overwhelming in scope'],
        recommendedUses: ['Complex problem solving', 'Organizational change', 'Policy development']
      });
    }
    
    return models.slice(0, 3); // Return top 3 models
  }

  /**
   * Recommends reasoning frameworks based on prompt metadata and phase
   */
  private recommendReasoningFrameworks(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): ReasoningFramework[] {
    const frameworks: ReasoningFramework[] = [];
    
    // Add task-specific reasoning frameworks
    switch (promptMetadata.taskType) {
      case 'creative':
        frameworks.push({
          frameworkName: 'Design Thinking',
          description: 'Human-centered approach to innovation that integrates user needs, technological possibilities, and business requirements',
          applicability: 9,
          keyPrinciples: ['Empathize with users', 'Define problems clearly', 'Ideate multiple solutions', 'Prototype rapidly', 'Test with users'],
          exampleApplications: ['Product design', 'Service innovation', 'Experience design']
        });
        break;
        
      case 'analytical':
        frameworks.push({
          frameworkName: 'Scientific Method',
          description: 'Systematic approach to investigation involving observation, hypothesis formation, prediction, testing, and theory refinement',
          applicability: 9,
          keyPrinciples: ['Base on observable evidence', 'Form testable hypotheses', 'Design controlled experiments', 'Analyze data objectively', 'Refine theories based on results'],
          exampleApplications: ['Research design', 'Data analysis', 'Hypothesis testing']
        });
        break;
        
      case 'technical':
        frameworks.push({
          frameworkName: 'First Principles Thinking',
          description: 'Breaking down complex problems into basic elements and reassembling from the ground up',
          applicability: 9,
          keyPrinciples: ['Identify fundamental truths', 'Question assumptions', 'Build up from basics', 'Avoid reasoning by analogy'],
          exampleApplications: ['Engineering design', 'Innovation in mature fields', 'Problem reformulation']
        });
        break;
        
      case 'informational':
        frameworks.push({
          frameworkName: 'Structured Knowledge Representation',
          description: 'Organizing information using formal structures like taxonomies, ontologies, and semantic networks',
          applicability: 8,
          keyPrinciples: ['Define clear categories', 'Establish relationships', 'Maintain consistency', 'Support inference'],
          exampleApplications: ['Knowledge base design', 'Information architecture', 'Content organization']
        });
        break;
    }
    
    // Add general reasoning frameworks
    frameworks.push({
      frameworkName: 'Critical Thinking',
      description: 'Disciplined approach to conceptualizing, analyzing, and evaluating information',
      applicability: 8,
      keyPrinciples: ['Question assumptions', 'Evaluate evidence quality', 'Consider alternative explanations', 'Recognize biases', 'Draw reasoned conclusions'],
      exampleApplications: ['Argument evaluation', 'Source credibility assessment', 'Decision making']
    });
    
    frameworks.push({
      frameworkName: 'Systems Thinking',
      description: 'Holistic approach that focuses on how system components interrelate and work over time within larger systems',
      applicability: 7,
      keyPrinciples: ['Identify system boundaries', 'Map interconnections', 'Recognize feedback loops', 'Consider emergent properties', 'Look for leverage points'],
      exampleApplications: ['Complex problem analysis', 'Organizational design', 'Environmental planning']
    });
    
    // Add phase-specific frameworks
    if (phase) {
      switch (phase) {
        case 'Planning':
          frameworks.push({
            frameworkName: 'Backward Planning',
            description: 'Starting with the end goal and working backward to identify necessary steps',
            applicability: 8,
            keyPrinciples: ['Define clear end state', 'Identify prerequisites for each step', 'Work backward from goal', 'Establish dependencies'],
            exampleApplications: ['Project planning', 'Goal achievement', 'Strategy development']
          });
          break;
          
        case 'Analysis':
          frameworks.push({
            frameworkName: 'MECE Principle',
            description: 'Mutually Exclusive, Collectively Exhaustive approach to problem breakdown',
            applicability: 8,
            keyPrinciples: ['Ensure categories don\'t overlap', 'Ensure all possibilities are covered', 'Create clear structure', 'Avoid gaps and redundancies'],
            exampleApplications: ['Problem structuring', 'Option analysis', 'Comprehensive review']
          });
          break;
          
        case 'Execution':
          frameworks.push({
            frameworkName: 'Agile Methodology',
            description: 'Iterative approach to implementation with continuous feedback and adaptation',
            applicability: 8,
            keyPrinciples: ['Deliver incrementally', 'Embrace change', 'Get frequent feedback', 'Adapt continuously'],
            exampleApplications: ['Software development', 'Project management', 'Product delivery']
          });
          break;
          
        case 'Verification':
          frameworks.push({
            frameworkName: 'Red Team Analysis',
            description: 'Adversarial approach to testing by actively trying to find flaws and weaknesses',
            applicability: 8,
            keyPrinciples: ['Adopt adversarial mindset', 'Challenge assumptions', 'Identify vulnerabilities', 'Test edge cases'],
            exampleApplications: ['Security testing', 'Plan validation', 'Solution robustness testing']
          });
          break;
      }
    }
    
    return frameworks.slice(0, 2); // Return top 2 frameworks
  }

  /**
   * Recommends decision strategies based on prompt metadata and progress
   */
  private recommendDecisionStrategies(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): Array<{
    strategyName: string;
    description: string;
    applicability: number;
    decisionFactors: string[];
  }> {
    const strategies: Array<{
      strategyName: string;
      description: string;
      applicability: number;
      decisionFactors: string[];
    }> = [];
    
    const progress = currentThoughtNumber / totalThoughts;
    
    // Early stage decision strategies
    if (progress < 0.3) {
      strategies.push({
        strategyName: 'Option Generation',
        description: 'Focus on creating multiple alternatives before evaluation',
        applicability: 9,
        decisionFactors: ['Diversity of options', 'Creative potential', 'Breaking conventional thinking']
      });
      
      strategies.push({
        strategyName: 'Information Gathering',
        description: 'Prioritize collecting relevant information before making decisions',
        applicability: 8,
        decisionFactors: ['Information quality', 'Source credibility', 'Relevance to goals']
      });
    }
    // Middle stage decision strategies
    else if (progress >= 0.3 && progress < 0.7) {
      strategies.push({
        strategyName: 'Weighted Criteria Analysis',
        description: 'Evaluate options against multiple weighted criteria',
        applicability: 9,
        decisionFactors: ['Alignment with goals', 'Feasibility', 'Resource requirements', 'Risk level']
      });
      
      strategies.push({
        strategyName: 'Cost-Benefit Analysis',
        description: 'Evaluate options based on their costs and benefits',
        applicability: 8,
        decisionFactors: ['Quantifiable benefits', 'Direct and indirect costs', 'Time horizon', 'Uncertainty']
      });
    }
    // Late stage decision strategies
    else {
      strategies.push({
        strategyName: 'Implementation Planning',
        description: 'Focus on how to effectively implement the chosen solution',
        applicability: 9,
        decisionFactors: ['Resource availability', 'Timeline', 'Dependencies', 'Risk mitigation']
      });
      
      strategies.push({
        strategyName: 'Validation Testing',
        description: 'Test decisions against potential scenarios and edge cases',
        applicability: 8,
        decisionFactors: ['Robustness', 'Edge case handling', 'Failure modes', 'Adaptability']
      });
    }
    
    // Task-specific decision strategies
    switch (promptMetadata.taskType) {
      case 'creative':
        strategies.push({
          strategyName: 'Novelty-Utility Balance',
          description: 'Balance innovative aspects with practical utility',
          applicability: 8,
          decisionFactors: ['Originality', 'Practicality', 'Value creation', 'Implementation feasibility']
        });
        break;
        
      case 'analytical':
        strategies.push({
          strategyName: 'Evidence-Based Decision Making',
          description: 'Base decisions on quality and weight of available evidence',
          applicability: 9,
          decisionFactors: ['Evidence quality', 'Statistical significance', 'Alternative explanations', 'Confidence levels']
        });
        break;
        
      case 'technical':
        strategies.push({
          strategyName: 'Trade-off Analysis',
          description: 'Explicitly evaluate trade-offs between competing technical factors',
          applicability: 9,
          decisionFactors: ['Performance', 'Reliability', 'Maintainability', 'Scalability', 'Security']
        });
        break;
    }
    
    return strategies.slice(0, 2); // Return top 2 strategies
  }

  /**
   * Recommends mental models based on prompt metadata and phase
   */
  private recommendMentalModels(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): Array<{
    modelName: string;
    description: string;
    applicability: number;
    exampleApplication: string;
  }> {
    const models: Array<{
      modelName: string;
      description: string;
      applicability: number;
      exampleApplication: string;
    }> = [];
    
    // General mental models
    models.push({
      modelName: 'Second-Order Thinking',
      description: 'Considering the consequences of the consequences',
      applicability: 8,
      exampleApplication: 'When evaluating a solution, consider not just its immediate effects but also the subsequent effects those will cause'
    });
    
    models.push({
      modelName: 'Inversion',
      description: 'Approaching problems backward by focusing on what to avoid',
      applicability: 7,
      exampleApplication: 'Instead of asking "How do I solve this problem?", ask "What would guarantee failure?"'
    });
    
    models.push({
      modelName: 'Opportunity Cost',
      description: 'Considering what you give up by choosing one option over others',
      applicability: 7,
      exampleApplication: 'When choosing a solution approach, explicitly consider what alternative approaches you\'re giving up'
    });
    
    // Phase-specific mental models
    if (phase) {
      switch (phase) {
        case 'Planning':
          models.push({
            modelName: 'Map vs. Territory',
            description: 'Recognizing that models and plans are simplifications of reality',
            applicability: 8,
            exampleApplication: 'When creating a plan, acknowledge its limitations and build in flexibility for unexpected developments'
          });
          break;
          
        case 'Analysis':
          models.push({
            modelName: 'Falsifiability',
            description: 'Focusing on how hypotheses could be proven wrong',
            applicability: 9,
            exampleApplication: 'For each analytical conclusion, ask "What evidence would prove this wrong?" and actively seek that evidence'
          });
          break;
          
        case 'Execution':
          models.push({
            modelName: 'Feedback Loops',
            description: 'Understanding how systems amplify or dampen changes through feedback',
            applicability: 8,
            exampleApplication: 'When implementing a solution, identify both positive and negative feedback mechanisms that will affect outcomes'
          });
          break;
          
        case 'Verification':
          models.push({
            modelName: 'Confirmation Bias',
            description: 'Awareness of the tendency to favor information confirming existing beliefs',
            applicability: 9,
            exampleApplication: 'When verifying a solution, actively seek evidence that would disprove its effectiveness'
          });
          break;
      }
    }
    
    // Task-specific mental models
    switch (promptMetadata.taskType) {
      case 'creative':
        models.push({
          modelName: 'Combinatorial Thinking',
          description: 'Creating new ideas by combining existing concepts in novel ways',
          applicability: 9,
          exampleApplication: 'Take concepts from different domains and combine them to generate innovative solutions'
        });
        break;
        
      case 'analytical':
        models.push({
          modelName: 'Probabilistic Thinking',
          description: 'Reasoning in terms of probabilities rather than certainties',
          applicability: 9,
          exampleApplication: 'Express conclusions in terms of confidence levels rather than binary true/false statements'
        });
        break;
        
      case 'technical':
        models.push({
          modelName: 'Abstraction Laddering',
          description: 'Moving up and down levels of abstraction to gain different perspectives',
          applicability: 8,
          exampleApplication: 'When designing a system, alternate between high-level architecture and low-level implementation details'
        });
        break;
    }
    
    return models.slice(0, 3); // Return top 3 models
  }
  /**
   * Recommends cognitive architectures based on prompt metadata and phase
   */
  private recommendCognitiveArchitectures(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): CognitiveArchitecture[] {
    const architectures: CognitiveArchitecture[] = [];
    
    // Add task-specific cognitive architectures
    switch (promptMetadata.taskType) {
      case 'creative':
        architectures.push({
          architectureName: 'Conceptual Blending Network',
          description: 'Architecture for combining concepts from different domains to create novel ideas',
          applicability: 9,
          strengths: ['Generates innovative combinations', 'Supports creative problem solving'],
          limitations: ['May produce impractical ideas', 'Requires diverse knowledge base']
        });
        break;
        
      case 'analytical':
        architectures.push({
          architectureName: 'Bayesian Cognitive Architecture',
          description: 'Probabilistic reasoning framework for updating beliefs based on evidence',
          applicability: 9,
          strengths: ['Handles uncertainty well', 'Supports evidence-based reasoning'],
          limitations: ['Computationally intensive', 'Requires prior probability estimates']
        });
        break;
        
      case 'technical':
        architectures.push({
          architectureName: 'Hierarchical Problem Solver',
          description: 'Architecture for decomposing complex problems into manageable sub-problems',
          applicability: 9,
          strengths: ['Effective for complex problems', 'Supports parallel processing'],
          limitations: ['May miss cross-cutting concerns', 'Requires clear problem boundaries']
        });
        break;
    }
    
    // Add general cognitive architecture
    architectures.push({
      architectureName: 'Adaptive Control of Thought',
      description: 'General cognitive architecture modeling declarative and procedural knowledge',
      applicability: 7,
      strengths: ['Comprehensive cognitive model', 'Supports skill acquisition'],
      limitations: ['Complex to implement fully', 'May be overkill for simple problems']
    });
    
    return architectures.slice(0, 2); // Return top 2 architectures
  }

  /**
   * Recommends epistemological frameworks based on prompt metadata and phase
   */
  private recommendEpistemologicalFrameworks(
    promptMetadata: PromptMetadata,
    phase?: 'Planning' | 'Analysis' | 'Execution' | 'Verification'
  ): EpistemologicalFramework[] {
    const frameworks: EpistemologicalFramework[] = [];
    
    // Add task-specific epistemological frameworks
    switch (promptMetadata.taskType) {
      case 'creative':
        frameworks.push({
          frameworkName: 'Constructivism',
          description: 'Knowledge is actively constructed based on experiences and interactions',
          applicability: 8,
          keyPrinciples: ['Knowledge is constructed, not discovered', 'Learning is an active process'],
          exampleApplications: ['Design thinking', 'Creative problem solving']
        });
        break;
        
      case 'analytical':
        frameworks.push({
          frameworkName: 'Critical Rationalism',
          description: 'Knowledge advances through conjecture and refutation',
          applicability: 9,
          keyPrinciples: ['Theories should be falsifiable', 'Progress through critical testing'],
          exampleApplications: ['Scientific method', 'Hypothesis testing']
        });
        break;
        
      case 'technical':
        frameworks.push({
          frameworkName: 'Pragmatism',
          description: 'Knowledge should be evaluated based on practical consequences',
          applicability: 8,
          keyPrinciples: ['Truth is what works in practice', 'Ideas are instruments for action'],
          exampleApplications: ['Engineering design', 'Technical problem solving']
        });
        break;
    }
    
    // Add general epistemological frameworks
    frameworks.push({
      frameworkName: 'Empiricism',
      description: 'Knowledge comes primarily from sensory experience and evidence',
      applicability: 7,
      keyPrinciples: ['Evidence-based knowledge', 'Observation over theory'],
      exampleApplications: ['Data analysis', 'Experimental design']
    });
    
    frameworks.push({
      frameworkName: 'Rationalism',
      description: 'Knowledge can be derived through reason and logical inference',
      applicability: 7,
      keyPrinciples: ['Logical deduction', 'A priori reasoning'],
      exampleApplications: ['Mathematical proofs', 'Logical analysis']
    });
    
    return frameworks.slice(0, 2); // Return top 2 frameworks
  }

  /**
   * Recommends advanced metacognitive strategies based on prompt metadata and progress
   */
  private recommendAdvancedMetacognitiveStrategies(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): AdvancedMetacognitiveStrategy[] {
    const strategies: AdvancedMetacognitiveStrategy[] = [];
    const progress = currentThoughtNumber / totalThoughts;
    
    // Add task-specific metacognitive strategies
    switch (promptMetadata.taskType) {
      case 'creative':
        strategies.push({
          strategyName: 'Conceptual Blending Protocol',
          description: 'Systematically combine concepts from different domains to generate novel ideas',
          applicability: 9,
          expectedBenefit: 'Generates innovative solutions through structured concept combination',
          implementationSteps: [
            'Identify source domains relevant to the problem',
            'Extract key concepts from each domain',
            'Create mappings between concepts',
            'Blend the mapped concepts to generate new ideas',
            'Elaborate and refine the blended concepts'
          ]
        });
        break;
        
      case 'analytical':
        strategies.push({
          strategyName: 'Cognitive Decoupling',
          description: 'Separate thinking from context to avoid biases and preconceptions',
          applicability: 9,
          expectedBenefit: 'Reduces contextual biases and enables more objective analysis',
          implementationSteps: [
            'Identify potential biases and preconceptions',
            'Deliberately set aside contextual assumptions',
            'Analyze the problem using abstract principles',
            'Apply multiple perspectives to the analysis',
            'Reintegrate context carefully after analysis'
          ]
        });
        break;
        
      case 'technical':
        strategies.push({
          strategyName: 'Mental Model Iteration',
          description: 'Systematically refine mental models of technical systems through testing',
          applicability: 8,
          expectedBenefit: 'Develops more accurate understanding of complex technical systems',
          implementationSteps: [
            'Create initial mental model of the system',
            'Generate predictions based on the model',
            'Test predictions against actual behavior',
            'Identify discrepancies and update the model',
            'Repeat until model accurately predicts system behavior'
          ]
        });
        break;
    }
    
    // Add general metacognitive strategies
    strategies.push({
      strategyName: 'Metacognitive Questioning',
      description: 'Systematically question your own thinking process to improve reasoning',
      applicability: 8,
      expectedBenefit: 'Identifies and corrects flaws in reasoning',
      implementationSteps: [
        'Pause regularly during problem solving',
        'Ask: "What assumptions am I making?"',
        'Ask: "What evidence supports my conclusions?"',
        'Ask: "What alternative approaches could I try?"',
        'Adjust thinking based on answers to these questions'
      ]
    });
    
    return strategies.slice(0, 2); // Return top 2 strategies
  }

  /**
   * Generates conceptual blending recommendations based on prompt metadata
   */
  private generateConceptualBlending(
    promptMetadata: PromptMetadata
  ): Array<{
    sourceFrames: string[];
    blendedConcept: string;
    emergentStructure: string;
    applicability: number;
  }> {
    const blends: Array<{
      sourceFrames: string[];
      blendedConcept: string;
      emergentStructure: string;
      applicability: number;
    }> = [];
    
    // Only generate conceptual blends for creative or complex tasks
    if (promptMetadata.taskType === 'creative' || promptMetadata.complexity === 'complex') {
      // Generate domain-specific blends based on prompt domains
      if (promptMetadata.domains.length >= 2) {
        blends.push({
          sourceFrames: [promptMetadata.domains[0], promptMetadata.domains[1]],
          blendedConcept: `${promptMetadata.domains[0]}-${promptMetadata.domains[1]} Integration`,
          emergentStructure: `Novel approach combining principles from ${promptMetadata.domains[0]} and ${promptMetadata.domains[1]}`,
          applicability: 8
        });
      }
      
      // Add task-specific conceptual blends
      switch (promptMetadata.taskType) {
        case 'creative':
          blends.push({
            sourceFrames: ['Divergent Thinking', 'Convergent Analysis'],
            blendedConcept: 'Structured Creativity Framework',
            emergentStructure: 'Systematic approach that alternates between creative exploration and analytical refinement',
            applicability: 9
          });
          break;
          
        case 'analytical':
          blends.push({
            sourceFrames: ['Quantitative Analysis', 'Qualitative Insights'],
            blendedConcept: 'Mixed-Method Analytical Model',
            emergentStructure: 'Framework that integrates numerical data with contextual understanding',
            applicability: 8
          });
          break;
          
        case 'technical':
          blends.push({
            sourceFrames: ['System Architecture', 'User Experience'],
            blendedConcept: 'Human-Centered Technical Design',
            emergentStructure: 'Technical approach that prioritizes both system integrity and user needs',
            applicability: 8
          });
          break;
      }
    }
    
    return blends;
  }

  /**
   * Generates dialectical reasoning recommendations based on prompt metadata
   */
  private generateDialecticalReasoning(
    promptMetadata: PromptMetadata
  ): Array<{
    thesis: string;
    antithesis: string;
    synthesis: string;
    progressiveImplications: string[];
  }> {
    const dialectics: Array<{
      thesis: string;
      antithesis: string;
      synthesis: string;
      progressiveImplications: string[];
    }> = [];
    
    // Generate task-specific dialectical reasoning
    switch (promptMetadata.taskType) {
      case 'creative':
        dialectics.push({
          thesis: 'Focus on novel, innovative solutions',
          antithesis: 'Prioritize practical, implementable approaches',
          synthesis: 'Develop innovative solutions with practical implementation paths',
          progressiveImplications: [
            'Balance creativity with feasibility',
            'Prototype innovative ideas to test practicality',
            'Iterate between divergent and convergent thinking'
          ]
        });
        break;
        
      case 'analytical':
        dialectics.push({
          thesis: 'Rely on quantitative data and metrics',
          antithesis: 'Consider qualitative factors and context',
          synthesis: 'Integrate quantitative analysis with qualitative understanding',
          progressiveImplications: [
            'Use mixed methods approaches',
            'Validate quantitative findings with qualitative insights',
            'Develop contextually-aware analytical frameworks'
          ]
        });
        break;
        
      case 'technical':
        dialectics.push({
          thesis: 'Optimize for technical performance and efficiency',
          antithesis: 'Prioritize usability and user experience',
          synthesis: 'Design systems that are both technically excellent and user-friendly',
          progressiveImplications: [
            'Involve users early in technical design',
            'Establish metrics for both performance and usability',
            'Create technical solutions that adapt to user needs'
          ]
        });
        break;
    }
    
    // Add complexity-specific dialectical reasoning
    if (promptMetadata.complexity === 'complex') {
      dialectics.push({
        thesis: 'Break down the problem into independent components',
        antithesis: 'Consider the problem holistically as an interconnected system',
        synthesis: 'Use modular design within a systems thinking framework',
        progressiveImplications: [
          'Identify both component-level and system-level requirements',
          'Design clear interfaces between components',
          'Test both individual components and integrated system'
        ]
      });
    }
    
    return dialectics;
  }

  /**
   * Generates adaptive learning path based on prompt metadata and progress
   */
  private generateAdaptiveLearningPath(
    promptMetadata: PromptMetadata,
    currentThoughtNumber: number,
    totalThoughts: number
  ): {
    currentCapabilities: string[];
    developmentGoals: string[];
    learningTrajectory: string[];
    milestones: Array<{
      description: string;
      estimatedThoughtCount: number;
    }>;
  } | undefined {
    // Only generate learning path for complex problems or if significant progress has been made
    if (promptMetadata.complexity !== 'complex' && currentThoughtNumber < 3) {
      return undefined;
    }
    
    // Define current capabilities based on task type
    const currentCapabilities: string[] = [];
    switch (promptMetadata.taskType) {
      case 'creative':
        currentCapabilities.push('Divergent thinking', 'Conceptual association');
        break;
      case 'analytical':
        currentCapabilities.push('Logical analysis', 'Pattern recognition');
        break;
      case 'technical':
        currentCapabilities.push('Technical problem decomposition', 'Solution implementation');
        break;
      default:
        currentCapabilities.push('General problem solving', 'Sequential thinking');
    }
    
    // Add domain-specific capabilities
    if (promptMetadata.domains.length > 0) {
      currentCapabilities.push(`${promptMetadata.domains[0]} domain knowledge`);
    }
    
    // Define development goals based on task complexity and progress
    const developmentGoals: string[] = [];
    if (promptMetadata.complexity === 'complex') {
      developmentGoals.push('Systems thinking for complex problems');
      developmentGoals.push('Multi-perspective analysis');
    }
    
    // Add task-specific development goals
    switch (promptMetadata.taskType) {
      case 'creative':
        developmentGoals.push('Advanced conceptual blending techniques');
        developmentGoals.push('Evaluation frameworks for creative solutions');
        break;
      case 'analytical':
        developmentGoals.push('Causal inference in complex systems');
        developmentGoals.push('Bayesian reasoning under uncertainty');
        break;
      case 'technical':
        developmentGoals.push('Architectural pattern recognition');
        developmentGoals.push('Technical debt management strategies');
        break;
    }
    
    // Define learning trajectory
    const learningTrajectory: string[] = [
      'Master foundational concepts and techniques',
      'Apply techniques to increasingly complex problems',
      'Integrate multiple approaches and perspectives',
      'Develop novel solutions and methodologies'
    ];
    
    // Define milestones
    const milestones: Array<{
      description: string;
      estimatedThoughtCount: number;
    }> = [];
    
    // Calculate milestone thought counts based on total thoughts
    const milestone1 = Math.max(1, Math.floor(totalThoughts * 0.25));
    const milestone2 = Math.max(2, Math.floor(totalThoughts * 0.5));
    const milestone3 = Math.max(3, Math.floor(totalThoughts * 0.75));
    const milestone4 = totalThoughts;
    
    // Add task-specific milestones
    switch (promptMetadata.taskType) {
      case 'creative':
        milestones.push(
          { description: 'Generate diverse initial ideas', estimatedThoughtCount: milestone1 },
          { description: 'Develop promising concepts in detail', estimatedThoughtCount: milestone2 },
          { description: 'Evaluate and refine solutions', estimatedThoughtCount: milestone3 },
          { description: 'Finalize innovative solution', estimatedThoughtCount: milestone4 }
        );
        break;
      case 'analytical':
        milestones.push(
          { description: 'Define analytical framework', estimatedThoughtCount: milestone1 },
          { description: 'Analyze key factors and relationships', estimatedThoughtCount: milestone2 },
          { description: 'Synthesize findings into cohesive model', estimatedThoughtCount: milestone3 },
          { description: 'Validate and refine analytical conclusions', estimatedThoughtCount: milestone4 }
        );
        break;
      case 'technical':
        milestones.push(
          { description: 'Establish technical requirements', estimatedThoughtCount: milestone1 },
          { description: 'Design core technical architecture', estimatedThoughtCount: milestone2 },
          { description: 'Implement and test key components', estimatedThoughtCount: milestone3 },
          { description: 'Optimize and finalize technical solution', estimatedThoughtCount: milestone4 }
        );
        break;
      default:
        milestones.push(
          { description: 'Define problem scope and approach', estimatedThoughtCount: milestone1 },
          { description: 'Develop initial solution framework', estimatedThoughtCount: milestone2 },
          { description: 'Refine and validate approach', estimatedThoughtCount: milestone3 },
          { description: 'Finalize comprehensive solution', estimatedThoughtCount: milestone4 }
        );
    }
    
    return {
      currentCapabilities,
      developmentGoals,
      learningTrajectory,
      milestones
    };
  }
} 