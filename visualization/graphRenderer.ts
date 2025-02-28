import { ThoughtData } from '../types/ThoughtData.js';
import { PromptMetadata } from '../analytics/promptAnalyzer.js';
import { 
  CognitiveModel, 
  ReasoningFramework,
  IntelligenceMaximizationRecommendations
} from '../analytics/intelligenceMaximizationModule.js';
import chalk from 'chalk';

export class GraphRenderer {
  /**
   * Generates a dependency graph visualization
   */
  public generateDependencyGraph(thoughts: ThoughtData[]): string {
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Thought Dependency Graph ===\n'));

    // Create a map for quick lookup
    const thoughtMap = new Map(thoughts.map(t => [t.thoughtNumber, t]));

    // Build adjacency list
    const adjacencyList: Record<number, number[]> = {};
    thoughts.forEach(thought => {
      if (thought.dependencies && thought.dependencies.length > 0) {
        thought.dependencies.forEach(dep => {
          if (!adjacencyList[dep]) {
            adjacencyList[dep] = [];
          }
          adjacencyList[dep].push(thought.thoughtNumber);
        });
      }
    });

    // Generate graph visualization
    thoughts.forEach(thought => {
      if (thought.isRevision) return;

      const phase = thought.phase || 'Execution';
      const colorFn = this.getPhaseColor(phase);
      const connections = adjacencyList[thought.thoughtNumber] || [];

      // Format node
      const nodeLabel = `T${thought.thoughtNumber}`;
      const nodeWithPhase = `${nodeLabel}(${phase[0]})`;
      const qualityIndicator = thought.quality ? 
        ` [Q:${thought.quality.qualityScore}]` : '';
      const classificationTag = thought.classification ?
        ` [${thought.classification}]` : '';
      
      // Add prompt alignment indicator
      const alignmentIndicator = thought.promptAlignment !== undefined ?
        ` [A:${thought.promptAlignment}${thought.promptAlignment >= 7 ? '✓' : thought.promptAlignment >= 4 ? '⚠️' : '❌'}]` : '';

      lines.push(colorFn(
        `${nodeWithPhase.padEnd(10)}${qualityIndicator}${classificationTag}${alignmentIndicator} ${
          connections.length ? '→' : ''
        } ${connections.map(c => `T${c}`).join(', ')}`
      ));
    });

    // Add branch information
    const branches = this.groupThoughtsByBranch(thoughts);
    if (Object.keys(branches).length > 0) {
      lines.push(chalk.yellow('\nBranches:'));
      Object.entries(branches).forEach(([branchId, branchThoughts]) => {
        const branchInfo = branchThoughts
          .map(t => {
            const phase = t.phase || 'Execution';
            const colorFn = this.getPhaseColor(phase);
            return colorFn(`T${t.thoughtNumber}(${phase[0]})`);
          })
          .join(' → ');
        lines.push(`  ${branchId}: ${branchInfo}`);
      });
    }

    // Add legend
    lines.push('\nLegend:');
    ['Planning', 'Analysis', 'Execution', 'Verification'].forEach(phase => {
      const colorFn = this.getPhaseColor(phase);
      lines.push(`  ${colorFn(`${phase[0]}`)} - ${phase}`);
    });
    lines.push(`  A:# - Prompt Alignment Score (A:8✓ = good, A:5⚠️ = moderate, A:2❌ = poor)`);

    return lines.join('\n') + '\n';
  }

  /**
   * Generates a concept map visualization
   */
  public generateConceptMap(thoughts: ThoughtData[]): string {
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Concept Map ===\n'));

    // Extract all concepts and their relationships
    const conceptRelations = this.extractConceptRelations(thoughts);
    const concepts = new Set<string>();
    conceptRelations.forEach(rel => {
      concepts.add(rel.source);
      concepts.add(rel.target);
    });

    // Generate concept nodes
    concepts.forEach(concept => {
      const relatedConcepts = conceptRelations
        .filter(rel => rel.source === concept)
        .map(rel => `${rel.relationship} → ${rel.target}`);

      lines.push(chalk.yellow(`[${concept}]`));
      relatedConcepts.forEach(rel => {
        lines.push(`  ${rel}`);
      });
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Generates a timeline view of thoughts
   */
  public generateTimelineView(thoughts: ThoughtData[]): string {
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Thought Timeline ===\n'));

    let currentPhase: string | undefined;
    thoughts.forEach(thought => {
      // Add phase transition marker
      if (thought.phase && thought.phase !== currentPhase) {
        lines.push(chalk.yellow(`\n[Phase: ${thought.phase}]`));
        currentPhase = thought.phase;
      }

      // Format thought entry
      const thoughtNumber = `T${thought.thoughtNumber}`.padEnd(4);
      const classification = thought.classification ?
        chalk.blue(`[${thought.classification}] `) : '';
      const summary = this.truncateText(thought.thought, 60);
      const quality = thought.quality ?
        chalk.gray(` (Q:${thought.quality.qualityScore})`) : '';
      
      // Add prompt alignment indicator
      const alignment = thought.promptAlignment !== undefined ?
        chalk.cyan(` [A:${thought.promptAlignment}${thought.promptAlignment >= 7 ? '✓' : thought.promptAlignment >= 4 ? '⚠️' : '❌'}]`) : '';

      lines.push(
        `${thoughtNumber} ${classification}${summary}${quality}${alignment}`
      );

      // Add revision marker if applicable
      if (thought.isRevision) {
        lines.push(
          `      ${chalk.yellow('↳')} Revises T${thought.revisesThought}`
        );
      }

      // Add dependency information
      if (thought.dependencies && thought.dependencies.length > 0) {
        lines.push(
          `      ${chalk.gray('↑')} Depends on: T${thought.dependencies.join(', T')}`
        );
      }
      
      // Add drift warning if applicable
      if (thought.driftWarning) {
        lines.push(
          `      ${chalk.red('⚠️')} ${thought.driftWarning}`
        );
      }
    });

    return lines.join('\n') + '\n';
  }

  /**
   * Generates a prompt-centered visualization showing how thoughts relate to prompt goals
   */
  public generatePromptAlignmentView(thoughts: ThoughtData[], promptMetadata?: PromptMetadata): string {
    if (!promptMetadata) {
      return chalk.yellow('\n=== Prompt Alignment View ===\n(No prompt metadata available)\n');
    }
    
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Prompt Alignment View ===\n'));
    
    // Display prompt goals
    lines.push(chalk.magenta('Prompt Goals:'));
    promptMetadata.goals.forEach((goal, index) => {
      lines.push(`  ${index + 1}. ${goal}`);
    });
    lines.push('');
    
    // Display alignment of thoughts to goals
    lines.push(chalk.magenta('Thought Alignment to Goals:'));
    
    // Group thoughts by alignment score
    const highAlignment = thoughts.filter(t => t.promptAlignment !== undefined && t.promptAlignment >= 7);
    const mediumAlignment = thoughts.filter(t => t.promptAlignment !== undefined && t.promptAlignment >= 4 && t.promptAlignment < 7);
    const lowAlignment = thoughts.filter(t => t.promptAlignment !== undefined && t.promptAlignment < 4);
    
    if (highAlignment.length > 0) {
      lines.push(chalk.green('  High Alignment:'));
      highAlignment.forEach(t => {
        lines.push(`    T${t.thoughtNumber} - ${this.truncateText(t.thought, 50)} [${t.promptAlignment}/10]`);
      });
    }
    
    if (mediumAlignment.length > 0) {
      lines.push(chalk.yellow('  Medium Alignment:'));
      mediumAlignment.forEach(t => {
        lines.push(`    T${t.thoughtNumber} - ${this.truncateText(t.thought, 50)} [${t.promptAlignment}/10]`);
      });
    }
    
    if (lowAlignment.length > 0) {
      lines.push(chalk.red('  Low Alignment:'));
      lowAlignment.forEach(t => {
        lines.push(`    T${t.thoughtNumber} - ${this.truncateText(t.thought, 50)} [${t.promptAlignment}/10]`);
        if (t.driftWarning) {
          lines.push(`      ⚠️ ${t.driftWarning}`);
        }
      });
    }
    
    // Calculate overall alignment metrics
    const alignmentScores = thoughts
      .filter(t => t.promptAlignment !== undefined)
      .map(t => t.promptAlignment as number);
    
    if (alignmentScores.length > 0) {
      const avgAlignment = alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length;
      const alignmentTrend = this.calculateAlignmentTrend(thoughts);
      
      lines.push('');
      lines.push(chalk.magenta('Alignment Metrics:'));
      lines.push(`  Average Alignment: ${avgAlignment.toFixed(1)}/10`);
      lines.push(`  Alignment Trend: ${alignmentTrend}`);
      lines.push(`  High Alignment Thoughts: ${highAlignment.length}/${thoughts.length}`);
      lines.push(`  Low Alignment Thoughts: ${lowAlignment.length}/${thoughts.length}`);
    }
    
    return lines.join('\n') + '\n';
  }

  /**
   * Generates a progress tracking visualization against prompt objectives
   */
  public generatePromptProgressView(thoughts: ThoughtData[], promptMetadata?: PromptMetadata): string {
    if (!promptMetadata) {
      return chalk.yellow('\n=== Prompt Progress View ===\n(No prompt metadata available)\n');
    }
    
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Prompt Progress View ===\n'));
    
    // Display progress against each goal
    lines.push(chalk.magenta('Progress Against Goals:'));
    
    promptMetadata.goals.forEach((goal, index) => {
      // Calculate progress for this goal based on thought relevance
      const relevantThoughts = thoughts.filter(t => 
        t.promptRelevance && t.promptRelevance[`goal_${index}`] !== undefined && 
        t.promptRelevance[`goal_${index}`] > 0.5
      );
      
      const progressPercentage = Math.min(100, Math.round((relevantThoughts.length / Math.max(2, promptMetadata.complexity === 'simple' ? 3 : promptMetadata.complexity === 'medium' ? 5 : 8)) * 100));
      
      // Create progress bar
      const barWidth = 20;
      const filledWidth = Math.floor(barWidth * (progressPercentage / 100));
      const progressBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);
      
      lines.push(`  Goal ${index + 1}: ${goal}`);
      lines.push(`    [${progressBar}] ${progressPercentage}%`);
      
      // List relevant thoughts
      if (relevantThoughts.length > 0) {
        lines.push(`    Relevant thoughts: ${relevantThoughts.map(t => `T${t.thoughtNumber}`).join(', ')}`);
      } else {
        lines.push(`    No thoughts directly addressing this goal yet`);
      }
      
      lines.push('');
    });
    
    // Calculate overall progress
    const overallProgress = this.calculateOverallProgress(thoughts, promptMetadata);
    const barWidth = 30;
    const filledWidth = Math.floor(barWidth * (overallProgress / 100));
    const progressBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);
    
    lines.push(chalk.magenta('Overall Progress:'));
    lines.push(`  [${progressBar}] ${overallProgress}%`);
    
    // Add completion estimate
    const completionEstimate = this.estimateCompletion(thoughts, promptMetadata);
    lines.push(`  Estimated thoughts to completion: ${completionEstimate}`);
    
    return lines.join('\n') + '\n';
  }

  private getPhaseColor(phase: string): Function {
    const phaseColors: Record<string, Function> = {
      'Planning': chalk.blue,
      'Analysis': chalk.yellow,
      'Execution': chalk.green,
      'Verification': chalk.magenta
    };
    return phaseColors[phase] || chalk.white;
  }

  private groupThoughtsByBranch(thoughts: ThoughtData[]): Record<string, ThoughtData[]> {
    const branches: Record<string, ThoughtData[]> = {};
    
    thoughts.forEach(thought => {
      if (thought.branchId) {
        if (!branches[thought.branchId]) {
          branches[thought.branchId] = [];
        }
        branches[thought.branchId].push(thought);
      }
    });

    return branches;
  }

  private extractConceptRelations(thoughts: ThoughtData[]): Array<{
    source: string;
    target: string;
    relationship: string;
  }> {
    const relations: Array<{
      source: string;
      target: string;
      relationship: string;
    }> = [];

    thoughts.forEach(thought => {
      if (!thought.conceptsExtracted) return;

      // Connect consecutive concepts within the same thought
      for (let i = 0; i < thought.conceptsExtracted.length - 1; i++) {
        relations.push({
          source: thought.conceptsExtracted[i],
          target: thought.conceptsExtracted[i + 1],
          relationship: 'relates to'
        });
      }

      // Connect concepts to thought classification if available
      if (thought.classification && thought.conceptsExtracted.length > 0) {
        relations.push({
          source: thought.conceptsExtracted[0],
          target: thought.classification,
          relationship: 'classified as'
        });
      }
    });

    return relations;
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
  
  private calculateAlignmentTrend(thoughts: ThoughtData[]): string {
    // Get thoughts with alignment scores
    const alignedThoughts = thoughts
      .filter(t => t.promptAlignment !== undefined)
      .sort((a, b) => a.thoughtNumber - b.thoughtNumber);
    
    if (alignedThoughts.length < 3) {
      return 'Insufficient data';
    }
    
    // Get the last 5 thoughts (or fewer if not available)
    const recentThoughts = alignedThoughts.slice(-5);
    
    // Calculate trend
    const firstScore = recentThoughts[0].promptAlignment as number;
    const lastScore = recentThoughts[recentThoughts.length - 1].promptAlignment as number;
    
    const difference = lastScore - firstScore;
    
    if (difference > 1) {
      return chalk.green('↗️ Improving');
    } else if (difference < -1) {
      return chalk.red('↘️ Declining');
    } else {
      return chalk.blue('→ Stable');
    }
  }
  
  private calculateOverallProgress(thoughts: ThoughtData[], promptMetadata: PromptMetadata): number {
    // Calculate progress based on:
    // 1. Percentage of thoughts completed vs. estimated total
    // 2. Average alignment score
    // 3. Coverage of prompt goals
    
    // Get the latest thought to determine current progress
    const latestThought = thoughts.reduce((latest, current) => 
      current.thoughtNumber > latest.thoughtNumber ? current : latest, 
      thoughts[0]
    );
    
    // Calculate progress percentage based on thought numbers
    const thoughtProgress = Math.min(100, (latestThought.thoughtNumber / latestThought.totalThoughts) * 100);
    
    // Calculate average alignment score (0-10)
    const alignmentScores = thoughts
      .filter(t => t.promptAlignment !== undefined)
      .map(t => t.promptAlignment as number);
    
    const avgAlignment = alignmentScores.length > 0 
      ? alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length
      : 5; // Default to middle if no alignment data
    
    // Calculate goal coverage (percentage of goals with at least one relevant thought)
    const goalCoverage = promptMetadata.goals.map((_, index) => {
      const hasRelevantThought = thoughts.some(t => 
        t.promptRelevance && 
        t.promptRelevance[`goal_${index}`] !== undefined && 
        t.promptRelevance[`goal_${index}`] > 0.5
      );
      return hasRelevantThought ? 1 : 0;
    }).reduce((sum: number, covered: number) => sum + covered, 0) / promptMetadata.goals.length * 100;
    
    // Calculate phase progress (weight later phases more heavily)
    const phaseWeights = {
      'Planning': 0.1,
      'Analysis': 0.3,
      'Execution': 0.5,
      'Verification': 0.9
    };
    
    const latestPhase = latestThought.phase || 'Execution';
    const phaseProgress = (phaseWeights[latestPhase] || 0.5) * 100;
    
    // Combine all factors with weights
    const weightedProgress = 
      (thoughtProgress * 0.3) + 
      (avgAlignment * 10 * 0.3) + 
      (goalCoverage * 0.3) + 
      (phaseProgress * 0.1);
    
    return Math.round(weightedProgress);
  }
  
  private estimateCompletion(thoughts: ThoughtData[], promptMetadata: PromptMetadata): number {
    // Get the latest thought
    const latestThought = thoughts.reduce((latest, current) => 
      current.thoughtNumber > latest.thoughtNumber ? current : latest, 
      thoughts[0]
    );
    
    // Calculate overall progress
    const progress = this.calculateOverallProgress(thoughts, promptMetadata);
    
    // If progress is very low, estimate based on complexity
    if (progress < 10) {
      return promptMetadata.complexity === 'simple' ? 5 : 
             promptMetadata.complexity === 'medium' ? 8 : 12;
    }
    
    // Estimate remaining thoughts based on current progress and total thoughts
    const estimatedTotal = Math.ceil((latestThought.thoughtNumber * 100) / progress);
    const remainingThoughts = estimatedTotal - latestThought.thoughtNumber;
    
    return remainingThoughts;
  }

  /**
   * Generates a visualization of cognitive models and their relationships to thoughts
   */
  public generateCognitiveModelVisualization(
    thoughts: ThoughtData[], 
    cognitiveModels: CognitiveModel[]
  ): string {
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Cognitive Model Visualization ===\n'));
    
    if (cognitiveModels.length === 0) {
      lines.push('No cognitive models available for visualization.');
      return lines.join('\n');
    }
    
    // Display cognitive models
    cognitiveModels.forEach(model => {
      lines.push(chalk.yellow(`[${model.modelName}] (Applicability: ${model.applicability}/10)`));
      lines.push(`  ${model.description}`);
      
      // Display strengths
      lines.push(chalk.green('  Strengths:'));
      model.strengths.forEach(strength => {
        lines.push(`    • ${strength}`);
      });
      
      // Display limitations
      lines.push(chalk.red('  Limitations:'));
      model.limitations.forEach(limitation => {
        lines.push(`    • ${limitation}`);
      });
      
      // Display recommended uses
      lines.push(chalk.blue('  Recommended Uses:'));
      model.recommendedUses.forEach(use => {
        lines.push(`    • ${use}`);
      });
      
      // Find thoughts that might benefit from this model
      const relevantThoughts = thoughts
        .filter(thought => this.isThoughtRelevantToModel(thought, model))
        .slice(0, 3); // Limit to 3 most relevant thoughts
      
      if (relevantThoughts.length > 0) {
        lines.push(chalk.magenta('  Relevant Thoughts:'));
        relevantThoughts.forEach(thought => {
          lines.push(`    • T${thought.thoughtNumber}: ${this.truncateText(thought.thought, 50)}`);
        });
      }
      
      lines.push(''); // Add spacing between models
    });
    
    return lines.join('\n');
  }

  /**
   * Determines if a thought is relevant to a cognitive model
   */
  private isThoughtRelevantToModel(thought: ThoughtData, model: CognitiveModel): boolean {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated matching
    
    // Check if thought phase matches model recommended uses
    if (thought.phase) {
      const phaseKeywords: Record<string, string[]> = {
        'Planning': ['planning', 'preparation', 'strategy', 'design'],
        'Analysis': ['analysis', 'evaluation', 'assessment', 'understanding'],
        'Execution': ['implementation', 'execution', 'development', 'building'],
        'Verification': ['testing', 'validation', 'verification', 'quality']
      };
      
      const phaseWords = phaseKeywords[thought.phase] || [];
      
      // Check if any recommended uses contain phase-related words
      for (const use of model.recommendedUses) {
        if (phaseWords.some(word => use.toLowerCase().includes(word))) {
          return true;
        }
      }
    }
    
    // Check if thought content relates to model
    const thoughtLower = thought.thought.toLowerCase();
    const modelNameLower = model.modelName.toLowerCase();
    const descriptionLower = model.description.toLowerCase();
    
    // Direct mention of model name or description keywords
    if (thoughtLower.includes(modelNameLower)) {
      return true;
    }
    
    // Check for description keyword matches
    const descriptionKeywords = descriptionLower
      .split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 5); // Take up to 5 significant keywords
    
    return descriptionKeywords.some(keyword => thoughtLower.includes(keyword));
  }

  /**
   * Generates a visualization of reasoning frameworks and their applications
   */
  public generateReasoningFrameworkVisualization(
    thoughts: ThoughtData[],
    reasoningFrameworks: ReasoningFramework[]
  ): string {
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Reasoning Framework Visualization ===\n'));
    
    if (reasoningFrameworks.length === 0) {
      lines.push('No reasoning frameworks available for visualization.');
      return lines.join('\n');
    }
    
    // Display reasoning frameworks
    reasoningFrameworks.forEach(framework => {
      lines.push(chalk.yellow(`[${framework.frameworkName}] (Applicability: ${framework.applicability}/10)`));
      lines.push(`  ${framework.description}`);
      
      // Display key principles
      lines.push(chalk.green('  Key Principles:'));
      framework.keyPrinciples.forEach(principle => {
        lines.push(`    • ${principle}`);
      });
      
      // Display example applications
      lines.push(chalk.blue('  Example Applications:'));
      framework.exampleApplications.forEach(application => {
        lines.push(`    • ${application}`);
      });
      
      // Find thoughts that might benefit from this framework
      const relevantThoughts = thoughts
        .filter(thought => this.isThoughtRelevantToFramework(thought, framework))
        .slice(0, 3); // Limit to 3 most relevant thoughts
      
      if (relevantThoughts.length > 0) {
        lines.push(chalk.magenta('  Relevant Thoughts:'));
        relevantThoughts.forEach(thought => {
          lines.push(`    • T${thought.thoughtNumber}: ${this.truncateText(thought.thought, 50)}`);
        });
      }
      
      lines.push(''); // Add spacing between frameworks
    });
    
    return lines.join('\n');
  }

  /**
   * Determines if a thought is relevant to a reasoning framework
   */
  private isThoughtRelevantToFramework(thought: ThoughtData, framework: ReasoningFramework): boolean {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated matching
    
    // Check if thought classification matches framework
    if (thought.classification) {
      const classificationKeywords: Record<string, string[]> = {
        'hypothesis': ['scientific', 'hypothesis', 'testing', 'experiment'],
        'observation': ['observation', 'data', 'evidence', 'empirical'],
        'conclusion': ['conclusion', 'inference', 'deduction', 'reasoning'],
        'question': ['question', 'inquiry', 'exploration', 'investigation'],
        'solution': ['solution', 'implementation', 'application', 'design']
      };
      
      const classWords = classificationKeywords[thought.classification] || [];
      
      // Check if framework name or principles contain classification-related words
      if (classWords.some(word => framework.frameworkName.toLowerCase().includes(word))) {
        return true;
      }
      
      for (const principle of framework.keyPrinciples) {
        if (classWords.some(word => principle.toLowerCase().includes(word))) {
          return true;
        }
      }
    }
    
    // Check if thought content relates to framework
    const thoughtLower = thought.thought.toLowerCase();
    const frameworkNameLower = framework.frameworkName.toLowerCase();
    
    // Direct mention of framework name
    if (thoughtLower.includes(frameworkNameLower)) {
      return true;
    }
    
    // Check for principle keyword matches
    for (const principle of framework.keyPrinciples) {
      const principleKeywords = principle
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 4)
        .slice(0, 3); // Take up to 3 significant keywords
      
      if (principleKeywords.some(keyword => thoughtLower.includes(keyword))) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Generates a comprehensive intelligence maximization dashboard
   */
  public generateIntelligenceDashboard(
    thoughts: ThoughtData[],
    promptMetadata?: PromptMetadata,
    intelligenceRecommendations?: IntelligenceMaximizationRecommendations
  ): string {
    const lines: string[] = [];
    lines.push(chalk.cyan('\n=== Intelligence Maximization Dashboard ===\n'));
    
    // Display prompt information if available
    if (promptMetadata) {
      lines.push(chalk.yellow('Prompt Analysis:'));
      lines.push(`  Task Type: ${promptMetadata.taskType}`);
      lines.push(`  Complexity: ${promptMetadata.complexity}`);
      lines.push(`  Priority: ${promptMetadata.priority}`);
      lines.push('');
    }
    
    // Display thinking progress
    const latestThought = thoughts.reduce((latest, current) => 
      current.thoughtNumber > latest.thoughtNumber ? current : latest, 
      thoughts[0]
    );
    
    const progress = Math.round((latestThought.thoughtNumber / latestThought.totalThoughts) * 100);
    const barWidth = 30;
    const filledWidth = Math.floor(barWidth * (progress / 100));
    const progressBar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth);
    
    lines.push(chalk.yellow('Thinking Progress:'));
    lines.push(`  [${progressBar}] ${progress}%`);
    lines.push(`  Current Phase: ${latestThought.phase || 'Unknown'}`);
    lines.push('');
    
    // Display thought quality metrics
    lines.push(chalk.yellow('Thought Quality Metrics:'));
    
    const qualityScores = thoughts
      .filter(t => t.quality && t.quality.qualityScore !== undefined)
      .map(t => t.quality!.qualityScore);
    
    if (qualityScores.length > 0) {
      const avgQuality = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
      lines.push(`  Average Quality: ${avgQuality.toFixed(1)}/10`);
      
      // Quality trend
      if (qualityScores.length >= 3) {
        const recentScores = qualityScores.slice(-3);
        const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        const earlierScores = qualityScores.slice(0, -3);
        const earlierAvg = earlierScores.length > 0 ? 
          earlierScores.reduce((sum, score) => sum + score, 0) / earlierScores.length : recentAvg;
        
        const trend = recentAvg > earlierAvg ? 'Improving' : 
                     recentAvg < earlierAvg ? 'Declining' : 'Stable';
        
        lines.push(`  Quality Trend: ${trend}`);
      }
    } else {
      lines.push('  No quality metrics available');
    }
    lines.push('');
    
    // Display prompt alignment if available
    const alignmentScores = thoughts
      .filter(t => t.promptAlignment !== undefined)
      .map(t => t.promptAlignment as number);
    
    if (alignmentScores.length > 0) {
      const avgAlignment = alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length;
      lines.push(chalk.yellow('Prompt Alignment:'));
      lines.push(`  Average Alignment: ${avgAlignment.toFixed(1)}/10`);
      
      // Count thoughts by alignment level
      const highAligned = alignmentScores.filter(score => score >= 7).length;
      const mediumAligned = alignmentScores.filter(score => score >= 4 && score < 7).length;
      const lowAligned = alignmentScores.filter(score => score < 4).length;
      
      lines.push(`  High Alignment: ${highAligned} thoughts`);
      lines.push(`  Medium Alignment: ${mediumAligned} thoughts`);
      lines.push(`  Low Alignment: ${lowAligned} thoughts`);
      lines.push('');
    }
    
    // Display intelligence recommendations if available
    if (intelligenceRecommendations) {
      // Display cognitive biases
      if (intelligenceRecommendations.cognitiveBiases && 
          intelligenceRecommendations.cognitiveBiases.length > 0) {
        lines.push(chalk.yellow('Potential Cognitive Biases:'));
        intelligenceRecommendations.cognitiveBiases
          .sort((a, b) => b.likelihood - a.likelihood)
          .slice(0, 3) // Show top 3
          .forEach(bias => {
            const likelihood = Math.round(bias.likelihood * 10);
            lines.push(`  • ${bias.biasType} (${likelihood}/10): ${bias.description}`);
          });
        lines.push('');
      }
      
      // Display metacognitive strategies
      if (intelligenceRecommendations.metacognitiveStrategies && 
          intelligenceRecommendations.metacognitiveStrategies.length > 0) {
        lines.push(chalk.yellow('Recommended Metacognitive Strategies:'));
        intelligenceRecommendations.metacognitiveStrategies
          .slice(0, 3) // Show top 3
          .forEach(strategy => {
            lines.push(`  • ${strategy.strategyName}: ${strategy.description}`);
          });
        lines.push('');
      }
      
      // Display focus areas
      if (intelligenceRecommendations.focusAreas && 
          intelligenceRecommendations.focusAreas.length > 0) {
        lines.push(chalk.yellow('Recommended Focus Areas:'));
        intelligenceRecommendations.focusAreas.forEach(area => {
          lines.push(`  • ${area}`);
        });
        lines.push('');
      }
      
      // Display mental models if available
      if (intelligenceRecommendations.mentalModels && 
          intelligenceRecommendations.mentalModels.length > 0) {
        lines.push(chalk.yellow('Recommended Mental Models:'));
        intelligenceRecommendations.mentalModels.forEach(model => {
          lines.push(`  • ${model.modelName}: ${model.description}`);
        });
        lines.push('');
      }
    }
    
    // Display thought pattern analysis
    const thoughtsByPhase: Record<string, number> = {
      'Planning': 0,
      'Analysis': 0,
      'Execution': 0,
      'Verification': 0
    };
    
    thoughts.forEach(thought => {
      if (thought.phase) {
        thoughtsByPhase[thought.phase]++;
      }
    });
    
    lines.push(chalk.yellow('Thought Distribution by Phase:'));
    Object.entries(thoughtsByPhase).forEach(([phase, count]) => {
      const percentage = Math.round((count / thoughts.length) * 100);
      const phaseBar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
      lines.push(`  ${phase.padEnd(12)} [${phaseBar}] ${count} (${percentage}%)`);
    });
    
    return lines.join('\n') + '\n';
  }
} 