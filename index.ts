#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
// Fixed chalk import for ESM
import chalk from 'chalk';
import { SemanticAnalyzer } from './analytics/semanticAnalyzer.js';
import { ContradictionDetector } from './analytics/contradictionDetector.js';
import { ReflectionEngine } from './analytics/reflectionEngine.js';
import { GraphRenderer } from './visualization/graphRenderer.js';
import { PromptAnalyzer, PromptContext } from './analytics/promptAnalyzer.js';
import { IntelligenceMaximizationModule, IntelligenceMaximizationRecommendations } from './analytics/intelligenceMaximizationModule.js';
import { ThoughtData, CognitiveArchitecture, EpistemologicalFramework, AdvancedMetacognitiveStrategy } from './types/ThoughtData.js';

// Add type for tool usage statistics
interface ToolUsageStats {
  usageCount: number;
  thoughtsUsedIn: number[];
  phaseUsage: Record<string, number>;
}

class SequentialThinkingServer {
  private thoughtHistory: ThoughtData[] = [];
  private branches: Record<string, ThoughtData[]> = {};
  private availableTools: string[] = []; // Will store tools the system knows about
  private toolUsageStats: Record<string, ToolUsageStats> = {};

  // New analytics and visualization components
  private semanticAnalyzer: SemanticAnalyzer;
  private contradictionDetector: ContradictionDetector;
  private reflectionEngine: ReflectionEngine;
  private graphRenderer: GraphRenderer;
  
  // New prompt analysis components
  private promptContext: PromptContext;
  private promptAnalyzer: PromptAnalyzer;
  
  // New intelligence maximization component
  private intelligenceMaximizationModule: IntelligenceMaximizationModule;

  constructor() {
    // Default available tool is the sequential thinking itself
    this.availableTools = ["sequentialthinking"];
    
    // Initialize analytics and visualization components
    this.semanticAnalyzer = new SemanticAnalyzer();
    this.contradictionDetector = new ContradictionDetector();
    this.reflectionEngine = new ReflectionEngine();
    this.graphRenderer = new GraphRenderer();
    
    // Initialize prompt analysis components
    this.promptContext = new PromptContext();
    this.promptAnalyzer = new PromptAnalyzer(this.promptContext);
    
    // Initialize intelligence maximization component
    this.intelligenceMaximizationModule = new IntelligenceMaximizationModule();
    
    console.error(chalk.cyan('MCP Sequential Thinking Server initialized with advanced intelligence capabilities'));
    console.error(chalk.green('Available cognitive architectures: Conceptual Blending Network, Bayesian Cognitive Architecture, Hierarchical Problem Solver'));
    console.error(chalk.green('Available epistemological frameworks: Empiricism, Rationalism, Constructivism, Critical Rationalism'));
    console.error(chalk.green('Available metacognitive strategies: Cognitive Decoupling, Metacognitive Questioning, Conceptual Blending Protocol'));
  }

  public setAvailableTools(tools: string[]) {
    this.availableTools = [...new Set([...this.availableTools, ...tools])];
  }

  private validateThoughtData(input: unknown): ThoughtData {
    const data = input as Record<string, unknown>;

    if (!data.thought || typeof data.thought !== 'string') {
      throw new Error('Invalid thought: must be a string');
    }
    if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
      throw new Error('Invalid thoughtNumber: must be a number');
    }
    if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
      throw new Error('Invalid totalThoughts: must be a number');
    }
    if (typeof data.nextThoughtNeeded !== 'boolean') {
      throw new Error('Invalid nextThoughtNeeded: must be a boolean');
    }

    return {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      isRevision: data.isRevision as boolean | undefined,
      revisesThought: data.revisesThought as number | undefined,
      branchFromThought: data.branchFromThought as number | undefined,
      branchId: data.branchId as string | undefined,
      needsMoreThoughts: data.needsMoreThoughts as boolean | undefined,
      phase: data.phase as 'Planning' | 'Analysis' | 'Execution' | 'Verification' | undefined,
      dependencies: data.dependencies as number[] | undefined,
      toolsUsed: data.toolsUsed as string[] | undefined,
      complexity: data.complexity as 'simple' | 'medium' | 'complex' | undefined,
      status: data.status as 'complete' | 'in-progress' | 'needs-revision' | undefined,
      quality: data.quality as ThoughtData['quality'],
      keywords: data.keywords as string[] | undefined,
      insightValue: data.insightValue as number | undefined,
      classification: data.classification as ThoughtData['classification'] | undefined,
      confidenceScore: data.confidenceScore as ThoughtData['confidenceScore'] | undefined,
      evidenceStrength: data.evidenceStrength as ThoughtData['evidenceStrength'] | undefined,
    };
  }

  private formatThought(thoughtData: ThoughtData): string {
    const { 
      thoughtNumber, 
      totalThoughts, 
      thought, 
      isRevision, 
      revisesThought, 
      branchFromThought, 
      phase,
      status
    } = thoughtData;

    // Create a compact header with essential information
    let header = '';
    
    // Add thought type indicator
    if (isRevision) {
      header = `🔄 Rev T${thoughtNumber}/${totalThoughts} (rev T${revisesThought})`;
    } else if (branchFromThought) {
      header = `🌿 Branch T${thoughtNumber}/${totalThoughts} (from T${branchFromThought})`;
    } else {
      header = `💭 T${thoughtNumber}/${totalThoughts}`;
    }
    
    // Add phase and status if available
    if (phase) {
      const phaseEmoji = phase === 'Planning' ? '📝' : 
                         phase === 'Analysis' ? '🔍' : 
                         phase === 'Execution' ? '⚙️' : 
                         phase === 'Verification' ? '✅' : '';
      header += ` | ${phaseEmoji}${phase}`;
    }
    
    if (status) {
      const statusSymbol = status === 'complete' ? '✓' : 
                         status === 'needs-revision' ? '⚠️' : '⏳';
      header += ` | ${statusSymbol}`;
    }
    
    // Add prompt alignment if available (important for reasoning quality)
    if (thoughtData.promptAlignment !== undefined) {
      const alignmentSymbol = thoughtData.promptAlignment >= 7 ? '✓' : 
                           thoughtData.promptAlignment >= 4 ? '⚠️' : '❌';
      header += ` | A:${thoughtData.promptAlignment}${alignmentSymbol}`;
    }
    
    // Create a simpler border
    const border = '─'.repeat(Math.min(60, Math.max(header.length, 30)));

    return `
┌${border}┐
│ ${header.padEnd(border.length - 2)} │
├${border}┤
${thought.split('\n').map(line => `│ ${line.padEnd(border.length - 2)} │`).join('\n')}
└${border}┘`;
  }

  private assessThoughtQuality(thought: ThoughtData): void {
    // Initialize quality object
    thought.quality = {
      coherence: 5,
      depth: 5,
      relevance: 5,
      qualityScore: 5,
      feedback: []
    };
    
    // Assess coherence based on connection to previous thoughts
    if (thought.dependencies && thought.dependencies.length > 0) {
      thought.quality.coherence = Math.min(8, 5 + thought.dependencies.length);
    } else if (thought.thoughtNumber > 1) {
      thought.quality.coherence = 3;
      thought.quality.feedback.push("Consider how this thought connects to previous thinking");
    }
    
    // Assess depth based on length and complexity
    const wordCount = thought.thought.split(/\s+/).length;
    if (wordCount < 30) {
      thought.quality.depth = 3;
      thought.quality.feedback.push("This thought could be explored in more depth");
    } else if (wordCount > 100) {
      thought.quality.depth = 8;
    }
    
    // Assess relevance based on phase appropriateness
    if (thought.phase === 'Planning' && thought.thoughtNumber > 3) {
      thought.quality.relevance = 4;
      thought.quality.feedback.push("Consider moving from planning to execution");
    }
    
    // Calculate overall score
    thought.quality.qualityScore = Math.round(
      (thought.quality.coherence + thought.quality.depth + thought.quality.relevance) / 3
    );
    
    // Log quality assessment
    if (thought.quality.feedback.length > 0) {
      console.error(chalk.cyan('\nThought Quality Feedback:'));
      thought.quality.feedback.forEach(fb => {
        console.error(`  • ${fb}`);
      });
    }

    // Set insight value based on quality metrics
    thought.insightValue = Math.round(
      (thought.quality.depth * 0.4 + 
       thought.quality.coherence * 0.3 + 
       thought.quality.relevance * 0.3) * 
      (thought.dependencies?.length ? 1.2 : 1)  // Bonus for connected thoughts
    );
  }

  private provideStrategicGuidance(currentThought: ThoughtData): string[] {
    const guidance: string[] = [];
    const progress = currentThought.thoughtNumber / currentThought.totalThoughts;
    
    // Check for phase progression
    if (progress > 0.75 && currentThought.phase !== 'Verification') {
      guidance.push("Consider transitioning to the Verification phase to validate your solution");
    }
    
    // Check for prompt alignment
    if (currentThought.promptAlignment !== undefined && currentThought.promptAlignment < 5) {
      guidance.push("This thought has low alignment with the original prompt. Consider revising to better address the prompt's goals");
    }
    
    // Add intelligence maximization guidance if available
    if (currentThought.intelligenceRecommendations) {
      // Add strategy recommendations
      if (currentThought.intelligenceRecommendations.strategies.length > 0) {
        const topStrategy = currentThought.intelligenceRecommendations.strategies[0];
        guidance.push(`Try using the "${topStrategy.strategyName}" strategy: ${topStrategy.description}`);
      }
      
      // Add reasoning type recommendations
      if (currentThought.intelligenceRecommendations.reasoningTypes.length > 0) {
        const topReasoningType = currentThought.intelligenceRecommendations.reasoningTypes[0];
        guidance.push(`Consider using ${topReasoningType.reasoningType} reasoning: ${topReasoningType.description}`);
      }
    }
    
    return guidance;
  }

  private trackToolUsage(thought: ThoughtData): void {
    if (!thought.toolsUsed || thought.toolsUsed.length === 0) {
      return;
    }
    
    // Update tool usage statistics
    for (const tool of thought.toolsUsed) {
      if (!this.toolUsageStats[tool]) {
        this.toolUsageStats[tool] = {
          usageCount: 0,
          thoughtsUsedIn: [],
          phaseUsage: { 'Planning': 0, 'Analysis': 0, 'Execution': 0, 'Verification': 0 }
        };
      }
      
      this.toolUsageStats[tool].usageCount++;
      this.toolUsageStats[tool].thoughtsUsedIn.push(thought.thoughtNumber);
      
      if (thought.phase) {
        this.toolUsageStats[tool].phaseUsage[thought.phase]++;
      }
    }
    
    // Log tool usage statistics
    console.error(chalk.cyan('\nTool Usage Statistics:'));
    for (const [toolName, stats] of Object.entries(this.toolUsageStats)) {
      console.error(`  ${toolName}: Used ${stats.usageCount} times`);
      
      // Show phase distribution
      const phaseUsage = Object.entries(stats.phaseUsage)
        .filter(([_, count]) => count > 0)
        .map(([phase, count]) => `${phase}: ${count}`)
        .join(', ');
        
      if (phaseUsage) {
        console.error(`    Phase usage: ${phaseUsage}`);
      }

      // Show recent thoughts where tool was used
      const recentThoughts = stats.thoughtsUsedIn.slice(-3);
      if (recentThoughts.length > 0) {
        console.error(`    Recent usage in thoughts: T${recentThoughts.join(', T')}`);
      }
    }
  }

  public processThought(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validateThoughtData(input);

      // Auto-adjust totalThoughts if needed
      if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
        validatedInput.totalThoughts = validatedInput.thoughtNumber;
      }

      // Set a default phase if not provided
      if (!validatedInput.phase) {
        const phaseMap: Record<number, 'Planning' | 'Analysis' | 'Execution' | 'Verification'> = {
          1: 'Planning',
        };
        validatedInput.phase = phaseMap[validatedInput.thoughtNumber] || 'Execution';
      }

      // Enhance thought with semantic analysis (minimal)
      validatedInput.keywords = this.extractKeywords(validatedInput.thought);

      // Check for contradictions (minimal)
      const contradictions = this.contradictionDetector.checkContradictions(
        validatedInput,
        this.thoughtHistory
      );
      if (contradictions.hasContradictions) {
        validatedInput.contradictions = contradictions.details;
        console.error(chalk.yellow('\nPotential contradictions detected'));
      }

      // Analyze prompt alignment if prompt context is initialized (minimal)
      if (this.promptContext.isInitialized()) {
        const promptMetadata = this.promptContext.getMetadata();
        if (promptMetadata) {
          const alignmentData = this.promptAnalyzer.analyzeThoughtAlignment(
            validatedInput.thought,
            promptMetadata
          );
          
          // Add alignment data to thought
          validatedInput.promptAlignment = alignmentData.promptAlignment;
          validatedInput.promptRelevance = alignmentData.promptRelevance;
          validatedInput.driftWarning = alignmentData.driftWarning;
          
          // Generate intelligence maximization recommendations (minimal)
          if (promptMetadata) {
            validatedInput.intelligenceRecommendations = this.intelligenceMaximizationModule.generateRecommendations(
              promptMetadata,
              validatedInput.thoughtNumber,
              validatedInput.totalThoughts,
              validatedInput.phase
            );
          }
        }
      }

      // Add to thought history
      this.thoughtHistory.push(validatedInput);

      // Handle branching
      if (validatedInput.branchFromThought && validatedInput.branchId) {
        if (!this.branches[validatedInput.branchId]) {
          this.branches[validatedInput.branchId] = [];
        }
        this.branches[validatedInput.branchId].push(validatedInput);
      }

      // Generate only essential visualizations
      const dependencyGraph = this.graphRenderer.generateDependencyGraph(this.thoughtHistory);
      console.error(dependencyGraph);

      // Calculate progress
      const progress = (validatedInput.thoughtNumber / validatedInput.totalThoughts) * 100;
      const progressBar = this.createProgressBar(progress);
      console.error(progressBar);

      // Generate strategic guidance (minimal)
      const guidance = this.provideStrategicGuidance(validatedInput).slice(0, 2);

      // Add guidance to console output (minimal)
      if (guidance.length > 0) {
        console.error(chalk.yellow('\nGuidance:'));
        guidance.forEach(g => console.error(`  • ${g}`));
      }

      // Return enhanced response (minimal)
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            thoughtNumber: validatedInput.thoughtNumber,
            totalThoughts: validatedInput.totalThoughts,
            nextThoughtNeeded: validatedInput.nextThoughtNeeded,
            branches: Object.keys(this.branches),
            phase: validatedInput.phase,
            complexity: validatedInput.complexity || this.estimateComplexity(),
            progress: `${Math.round(progress)}%`,
            // Include only the most essential guidance
            strategicGuidance: guidance.slice(0, 2),
            // Include only essential analytics data
            promptAlignment: validatedInput.promptAlignment,
            driftWarning: validatedInput.driftWarning,
            // Include only the most critical intelligence recommendations
            recommendations: validatedInput.intelligenceRecommendations ? {
              strategies: validatedInput.intelligenceRecommendations.strategies?.slice(0, 1),
              reasoningTypes: validatedInput.intelligenceRecommendations.reasoningTypes?.slice(0, 1),
              focusAreas: validatedInput.intelligenceRecommendations.focusAreas?.slice(0, 1)
            } : undefined
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  private createProgressBar(percentage: number): string {
    const width = 20; // Reduced from 30
    const completed = Math.floor(width * (percentage / 100));
    const remaining = width - completed;
    
    const bar = '█'.repeat(completed) + '░'.repeat(remaining);
    return `\n${chalk.cyan('Progress:')} [${chalk.green(bar)}] ${Math.round(percentage)}%`;
  }

  private generateDependencyGraph(): string {
    // Skip if we have fewer than 2 thoughts
    if (this.thoughtHistory.length < 2) {
      return '';
    }
    
    const graphLines: string[] = [];
    graphLines.push(chalk.cyan('\n=== Thought Dependency Graph ==='));
    
    // Create a map for quick lookup
    const thoughtMap = new Map(
      this.thoughtHistory.map(t => [t.thoughtNumber, t])
    );
    
    // Phase colors
    const phaseColors: Record<string, Function> = {
      'Planning': chalk.blue,
      'Analysis': chalk.yellow,
      'Execution': chalk.green,
      'Verification': chalk.magenta,
    };
    
    // Build adjacency list
    const adjacencyList: Record<number, number[]> = {};
    
    for (const thought of this.thoughtHistory) {
      if (thought.dependencies && thought.dependencies.length > 0) {
        // Create reversed dependencies (for drawing arrows from dependencies to current thought)
        for (const dep of thought.dependencies) {
          if (!adjacencyList[dep]) {
            adjacencyList[dep] = [];
          }
          adjacencyList[dep].push(thought.thoughtNumber);
        }
      }
    }
    
    // Generate ASCII representation of graph
    for (let i = 1; i <= this.thoughtHistory.length; i++) {
      const thought = thoughtMap.get(i);
      if (!thought) continue;
      
      // Skip thoughts that are revisions
      if (thought.isRevision) continue;
      
      const phase = thought.phase || 'Execution';
      const colorFn = phaseColors[phase] || chalk.white;
      
      // Get connections
      const connections = adjacencyList[i] || [];
      
      // Format thought node
      const nodeLabel = `T${i}`;
      const nodeWithPhase = `${nodeLabel}(${phase[0]})`;
      const qualityIndicator = thought.quality ? 
        ` [Q:${thought.quality.qualityScore}]` : '';
      
      graphLines.push(colorFn(`${nodeWithPhase.padEnd(10)}${qualityIndicator} ${connections.length ? '→' : ''} ${connections.map(c => `T${c}`).join(', ')}`));
    }
    
    // Add branch information
    if (Object.keys(this.branches).length > 0) {
      graphLines.push(chalk.yellow('\nBranches:'));
      for (const [branchId, thoughts] of Object.entries(this.branches)) {
        const branchInfo = thoughts.map(t => {
          const phase = t.phase || 'Execution';
          const colorFn = phaseColors[phase] || chalk.white;
          return colorFn(`T${t.thoughtNumber}(${phase[0]})`);
        }).join(' → ');
        
        graphLines.push(`  ${branchId}: ${branchInfo}`);
      }
    }
    
    // Add legend
    graphLines.push('\nLegend:');
    Object.entries(phaseColors).forEach(([phase, colorFn]) => {
      graphLines.push(`  ${colorFn(`${phase[0]}`)} - ${phase}`);
    });
    
    return graphLines.join('\n') + '\n';
  }

  private getRecentThoughts(count: number): Array<{number: number, summary: string}> {
    return this.thoughtHistory
      .slice(-count)
      .map(t => ({
        number: t.thoughtNumber,
        summary: t.thought.length > 50 ? 
          t.thought.substring(0, 50) + '...' : 
          t.thought
      }));
  }

  private estimateComplexity(): 'simple' | 'medium' | 'complex' {
    // Estimate complexity based on thought history patterns
    const thoughtCount = this.thoughtHistory.length;
    const revisionCount = this.thoughtHistory.filter(t => t.isRevision).length;
    const branchCount = Object.keys(this.branches).length;
    
    if (thoughtCount > 10 || branchCount > 2) {
      return 'complex';
    } else if (thoughtCount > 5 || revisionCount > 1 || branchCount > 0) {
      return 'medium';
    }
    return 'simple';
  }

  private suggestNextPhase(currentThought: ThoughtData): string {
    // Suggest next phase based on current phase and progress
    const { phase, thoughtNumber, totalThoughts } = currentThought;
    const progress = thoughtNumber / totalThoughts;
    
    if (phase === 'Planning' && progress > 0.2) {
      return 'Analysis';
    } else if (phase === 'Analysis' && progress > 0.4) {
      return 'Execution';
    } else if (phase === 'Execution' && progress > 0.8) {
      return 'Verification';
    }
    
    return phase || 'Execution';
  }

  private detectSemanticRelationships(newThought: ThoughtData): void {
    // Skip if we have fewer than 2 thoughts
    if (this.thoughtHistory.length < 2) return;
    
    // Extract keywords from the current thought
    const keywords = this.extractKeywords(newThought.thought);
    newThought.keywords = keywords;
    
    // Look for semantic connections with previous thoughts
    const semanticConnections: number[] = [];
    
    for (let i = 0; i < this.thoughtHistory.length; i++) {
      const previousThought = this.thoughtHistory[i];
      if (!previousThought.keywords) continue;
      
      // Check for keyword overlap
      const overlap = previousThought.keywords.filter(kw => 
        keywords.includes(kw)
      );
      
      // If significant overlap found, add as implicit dependency
      if (overlap.length >= 2 && !newThought.dependencies?.includes(previousThought.thoughtNumber)) {
        semanticConnections.push(previousThought.thoughtNumber);
      }
    }
    
    // Add semantic connections to dependencies
    if (semanticConnections.length > 0) {
      newThought.dependencies = [
        ...(newThought.dependencies || []),
        ...semanticConnections
      ];
      
      console.error(chalk.magenta(`\nDetected semantic connections with thoughts: ${semanticConnections.join(', ')}`));
    }
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '') 
      .split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !['about', 'above', 'across', 'after', 'again'].includes(word));
    
    // Count word frequency
    const wordCounts: Record<string, number> = {};
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
    
    // Return top 5 keywords by frequency
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Calculates the coverage of prompt goals by the thoughts
   */
  private calculateGoalCoverage(): Record<string, number> {
    if (!this.promptContext.isInitialized() || !this.promptContext.getMetadata()) {
      return {};
    }
    
    const promptMetadata = this.promptContext.getMetadata()!;
    const coverage: Record<string, number> = {};
    
    promptMetadata.goals.forEach((goal, index) => {
      // Calculate coverage for this goal based on thought relevance
      const relevantThoughts = this.thoughtHistory.filter(t => 
        t.promptRelevance && 
        t.promptRelevance[`goal_${index}`] !== undefined && 
        t.promptRelevance[`goal_${index}`] > 0.5
      );
      
      const coveragePercentage = Math.min(100, Math.round((relevantThoughts.length / Math.max(2, promptMetadata.complexity === 'simple' ? 3 : promptMetadata.complexity === 'medium' ? 5 : 8)) * 100));
      
      coverage[`goal_${index}`] = coveragePercentage;
    });
    
    return coverage;
  }
  
  /**
   * Calculates the trend of prompt alignment scores
   */
  private calculateAlignmentTrend(): string {
    // Get thoughts with alignment scores
    const alignedThoughts = this.thoughtHistory
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
      return 'Improving';
    } else if (difference < -1) {
      return 'Declining';
    } else {
      return 'Stable';
    }
  }

  /**
   * Calculates the overall progress based on various metrics
   */
  private calculateOverallProgress(): number {
    if (!this.promptContext.isInitialized() || !this.promptContext.getMetadata() || this.thoughtHistory.length === 0) {
      return 0;
    }
    
    const promptMetadata = this.promptContext.getMetadata()!;
    
    // Get the latest thought to determine current progress
    const latestThought = this.thoughtHistory.reduce((latest, current) => 
      current.thoughtNumber > latest.thoughtNumber ? current : latest, 
      this.thoughtHistory[0]
    );
    
    // Calculate progress percentage based on thought numbers
    const thoughtProgress = Math.min(100, (latestThought.thoughtNumber / latestThought.totalThoughts) * 100);
    
    // Calculate average alignment score (0-10)
    const alignmentScores = this.thoughtHistory
      .filter(t => t.promptAlignment !== undefined)
      .map(t => t.promptAlignment as number);
    
    const avgAlignment = alignmentScores.length > 0 
      ? alignmentScores.reduce((sum, score) => sum + score, 0) / alignmentScores.length
      : 5; // Default to middle if no alignment data
    
    // Calculate goal coverage (percentage of goals with at least one relevant thought)
    const goalCoverage = Object.values(this.calculateGoalCoverage())
      .reduce((sum, coverage) => sum + coverage, 0) / 
      Math.max(1, Object.keys(this.calculateGoalCoverage()).length);
    
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
  
  /**
   * Estimates the number of remaining thoughts needed
   */
  private estimateRemainingThoughts(): number {
    if (!this.promptContext.isInitialized() || !this.promptContext.getMetadata() || this.thoughtHistory.length === 0) {
      return 0;
    }
    
    const promptMetadata = this.promptContext.getMetadata()!;
    
    // Get the latest thought
    const latestThought = this.thoughtHistory.reduce((latest, current) => 
      current.thoughtNumber > latest.thoughtNumber ? current : latest, 
      this.thoughtHistory[0]
    );
    
    // Calculate overall progress
    const progress = this.calculateOverallProgress();
    
    // If progress is very low, estimate based on complexity
    if (progress < 10) {
      return promptMetadata.complexity === 'simple' ? 5 : 
             promptMetadata.complexity === 'medium' ? 8 : 12;
    }
    
    // Estimate remaining thoughts based on current progress and total thoughts
    const estimatedTotal = Math.ceil((latestThought.thoughtNumber * 100) / Math.max(1, progress));
    const remainingThoughts = Math.max(0, estimatedTotal - latestThought.thoughtNumber);
    
    return remainingThoughts;
  }

  /**
   * Initializes the prompt context with a new prompt
   * @param prompt The user's original prompt
   */
  public initializePromptContext(prompt: string): void {
    this.promptContext.initializeWithPrompt(prompt, this.promptAnalyzer);
    console.error(chalk.cyan('\nPrompt Analysis:'));
    const metadata = this.promptContext.getMetadata();
    if (metadata) {
      console.error(`  Goals: ${metadata.goals.join(', ')}`);
      console.error(`  Constraints: ${metadata.constraints.join(', ')}`);
      console.error(`  Domains: ${metadata.domains.join(', ')}`);
      console.error(`  Task Type: ${metadata.taskType}`);
      console.error(`  Complexity: ${metadata.complexity}`);
      console.error(`  Priority: ${metadata.priority}`);
      console.error(`  Keywords: ${metadata.keywords.join(', ')}`);
    }
  }
}

const SEQUENTIAL_THINKING_TOOL: Tool = {
  name: "sequentialthinking",
  description: `A powerful tool for dynamic and reflective problem-solving through structured thoughts.
This tool helps analyze problems through a flexible thinking process that can adapt and evolve.
Each thought can build on, question, or revise previous insights as understanding deepens.

When to use this tool:
- Breaking down complex problems into steps
- Planning and design with room for revision
- Analysis that might need course correction
- Problems where the full scope might not be clear initially
- Multi-step solutions requiring maintenance of context
- Filtering out irrelevant information
- Tasks that benefit from metacognition (thinking about thinking)

Key features:
- Adaptive: Adjusts total_thoughts as needed during problem-solving
- Reflective: Allows questioning and revising previous thoughts
- Extensible: Supports adding thoughts even after reaching what seemed like the end
- Flexible: Supports uncertainty and alternative approaches
- Non-linear: Enables branching and backtracking when helpful
- Structured: Divides thinking into phases (Planning, Analysis, Execution, Verification)
- Meta-cognitive: Tracks dependencies between thoughts and complexity
- Tool-aware: Can incorporate other tools in the thinking process

Parameters explained:
- thought: Your current thinking step
- next_thought_needed: True if more thinking is required
- thought_number: Current number in sequence
- total_thoughts: Current estimate of thoughts needed (adaptable)
- is_revision: Boolean indicating if this thought revises previous thinking
- revises_thought: If revising, which thought number is being reconsidered
- branch_from_thought: If branching, which thought number is the branching point
- branch_id: Identifier for the current branch (if any)
- needs_more_thoughts: If reaching end but realizing more thoughts needed
- phase: Current thinking phase (Planning, Analysis, Execution, Verification)
- dependencies: Thought numbers this thought depends on
- tools_used: Names of tools used in this thought
- complexity: Estimated complexity of the task (simple, medium, complex)
- status: Status of this thought (complete, in-progress, needs-revision)

Recommended approach:
1. Start with a planning phase to assess the task and break it down
2. Use about 8-12 thoughts for complex problems, 5-8 for medium, 3-5 for simple
3. Focus on a single sub-task or idea in each thought
4. Explicitly connect thoughts through dependencies
5. Track which tools were used in each thought
6. Revise thoughts when necessary
7. Branch only when exploring truly different approaches
8. End with verification to ensure solution quality
9. Set next_thought_needed to false only when truly complete`,
  inputSchema: {
    type: "object",
    properties: {
      thought: {
        type: "string",
        description: "Your current thinking step"
      },
      nextThoughtNeeded: {
        type: "boolean",
        description: "Whether another thought step is needed"
      },
      thoughtNumber: {
        type: "integer",
        description: "Current thought number",
        minimum: 1
      },
      totalThoughts: {
        type: "integer",
        description: "Estimated total thoughts needed",
        minimum: 1
      },
      isRevision: {
        type: "boolean",
        description: "Whether this revises previous thinking"
      },
      revisesThought: {
        type: "integer",
        description: "Which thought is being reconsidered",
        minimum: 1
      },
      branchFromThought: {
        type: "integer",
        description: "Branching point thought number",
        minimum: 1
      },
      branchId: {
        type: "string",
        description: "Branch identifier"
      },
      needsMoreThoughts: {
        type: "boolean",
        description: "If more thoughts are needed"
      },
      phase: {
        type: "string",
        description: "Current thinking phase",
        enum: ["Planning", "Analysis", "Execution", "Verification"]
      },
      dependencies: {
        type: "array",
        items: {
          type: "integer"
        },
        description: "Thought numbers this thought depends on"
      },
      toolsUsed: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Names of tools used in this thought"
      },
      complexity: {
        type: "string",
        description: "Estimated complexity of the task",
        enum: ["simple", "medium", "complex"]
      },
      status: {
        type: "string",
        description: "Status of this thought",
        enum: ["complete", "in-progress", "needs-revision"]
      }
    },
    required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
  }
};

const server = new Server(
  {
    name: "sequential-thinking-server",
    version: "0.3.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const thinkingServer = new SequentialThinkingServer();

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  // Store the tools available in the response for later reference
  const response = { tools: [SEQUENTIAL_THINKING_TOOL] };
  
  // Extract and store tool names for awareness
  if (response && response.tools) {
    thinkingServer.setAvailableTools(response.tools.map(tool => tool.name));
  }
  
  return response;
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "sequentialthinking") {
    // Extract the thought data
    const thoughtData = request.params.arguments as any;
    
    // Initialize prompt context with the first thought
    if (thoughtData && thoughtData.thoughtNumber === 1) {
      thinkingServer.initializePromptContext(thoughtData.thought);
    }
    
    return thinkingServer.processThought(request.params.arguments);
  }

  return {
    content: [{
      type: "text",
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sequential Thinking MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});