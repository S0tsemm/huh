import { ThoughtData } from '../types/ThoughtData.js';
import { SemanticAnalyzer } from './semanticAnalyzer.js';
import { PromptMetadata } from './promptAnalyzer.js';

export class ContradictionDetector {
  private semanticAnalyzer: SemanticAnalyzer;

  constructor() {
    this.semanticAnalyzer = new SemanticAnalyzer();
  }

  /**
   * Checks for contradictions between a new thought and existing thoughts
   */
  public checkContradictions(newThought: ThoughtData, existingThoughts: ThoughtData[]): {
    hasContradictions: boolean;
    details: { thoughtNumber: number; explanation: string }[];
  } {
    const contradictions: { thoughtNumber: number; explanation: string }[] = [];

    // Skip if the new thought is a revision
    if (newThought.isRevision) {
      return { hasContradictions: false, details: [] };
    }

    existingThoughts.forEach(existingThought => {
      // Skip comparing with revisions or the same thought
      if (existingThought.isRevision || existingThought.thoughtNumber === newThought.thoughtNumber) {
        return;
      }

      const contradiction = this.detectContradiction(newThought, existingThought);
      if (contradiction) {
        contradictions.push({
          thoughtNumber: existingThought.thoughtNumber,
          explanation: contradiction
        });
      }
    });

    return {
      hasContradictions: contradictions.length > 0,
      details: contradictions
    };
  }

  /**
   * Analyzes potential contradictions in assumptions
   */
  public analyzeAssumptionContradictions(thoughts: ThoughtData[]): {
    thoughtNumber: number;
    conflictingAssumptions: string[];
  }[] {
    const conflicts: {
      thoughtNumber: number;
      conflictingAssumptions: string[];
    }[] = [];

    thoughts.forEach(thought => {
      if (!thought.assumptions || thought.assumptions.length === 0) return;

      const conflictingAssumptions = this.findConflictingAssumptions(
        thought,
        thoughts.filter(t => t.thoughtNumber !== thought.thoughtNumber)
      );

      if (conflictingAssumptions.length > 0) {
        conflicts.push({
          thoughtNumber: thought.thoughtNumber,
          conflictingAssumptions
        });
      }
    });

    return conflicts;
  }

  /**
   * Checks for contradictions between a thought and prompt requirements
   * @param thought The thought to analyze
   * @param promptMetadata The prompt metadata for context
   * @returns Object with contradiction information
   */
  public checkPromptContradictions(thought: ThoughtData, promptMetadata: PromptMetadata): {
    hasContradictions: boolean;
    details: Array<{
      type: 'goal' | 'constraint' | 'domain';
      element: string;
      explanation: string;
    }>;
    resolutionStrategies: string[];
  } {
    const contradictions: Array<{
      type: 'goal' | 'constraint' | 'domain';
      element: string;
      explanation: string;
    }> = [];
    
    // Check for contradictions with goals
    promptMetadata.goals.forEach(goal => {
      const contradiction = this.detectPromptElementContradiction(thought.thought, goal);
      if (contradiction) {
        contradictions.push({
          type: 'goal',
          element: goal,
          explanation: contradiction
        });
      }
    });
    
    // Check for contradictions with constraints
    promptMetadata.constraints.forEach(constraint => {
      const contradiction = this.detectPromptElementContradiction(thought.thought, constraint);
      if (contradiction) {
        contradictions.push({
          type: 'constraint',
          element: constraint,
          explanation: contradiction
        });
      }
    });
    
    // Generate resolution strategies
    const resolutionStrategies = this.generateResolutionStrategies(contradictions, thought, promptMetadata);
    
    return {
      hasContradictions: contradictions.length > 0,
      details: contradictions,
      resolutionStrategies
    };
  }

  /**
   * Analyzes prompt-based consistency across multiple thoughts
   * @param thoughts Array of thoughts to analyze
   * @param promptMetadata The prompt metadata for context
   * @returns Analysis of prompt-based consistency
   */
  public analyzePromptConsistency(thoughts: ThoughtData[], promptMetadata: PromptMetadata): {
    overallConsistency: number;
    inconsistentThoughts: Array<{
      thoughtNumber: number;
      inconsistencyReason: string;
    }>;
    consistencyTrend: 'improving' | 'declining' | 'stable';
    recommendations: string[];
  } {
    // Track consistency scores for each thought
    const consistencyScores: Array<{
      thoughtNumber: number;
      score: number;
      reason?: string;
    }> = [];
    
    // Analyze each thought for prompt consistency
    thoughts.forEach(thought => {
      const contradictions = this.checkPromptContradictions(thought, promptMetadata);
      const alignmentScore = this.calculatePromptAlignmentScore(thought, promptMetadata);
      
      // Calculate consistency score (0-1, where 1 is fully consistent)
      const consistencyScore = Math.max(0, 1 - (contradictions.details.length * 0.2)) * alignmentScore;
      
      // Add to scores with reason if inconsistent
      if (consistencyScore < 0.7 && contradictions.details.length > 0) {
        consistencyScores.push({
          thoughtNumber: thought.thoughtNumber,
          score: consistencyScore,
          reason: contradictions.details[0].explanation
        });
      } else {
        consistencyScores.push({
          thoughtNumber: thought.thoughtNumber,
          score: consistencyScore
        });
      }
    });
    
    // Calculate overall consistency
    const overallConsistency = consistencyScores.reduce((sum, item) => sum + item.score, 0) / 
                              Math.max(1, consistencyScores.length);
    
    // Identify inconsistent thoughts
    const inconsistentThoughts = consistencyScores
      .filter(item => item.score < 0.7 && item.reason)
      .map(item => ({
        thoughtNumber: item.thoughtNumber,
        inconsistencyReason: item.reason!
      }));
    
    // Analyze trend (are later thoughts more consistent?)
    let consistencyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (consistencyScores.length >= 3) {
      const firstHalf = consistencyScores.slice(0, Math.floor(consistencyScores.length / 2));
      const secondHalf = consistencyScores.slice(Math.floor(consistencyScores.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.score, 0) / secondHalf.length;
      
      if (secondHalfAvg > firstHalfAvg + 0.1) {
        consistencyTrend = 'improving';
      } else if (firstHalfAvg > secondHalfAvg + 0.1) {
        consistencyTrend = 'declining';
      }
    }
    
    // Generate recommendations
    const recommendations = this.generateConsistencyRecommendations(
      inconsistentThoughts, 
      consistencyTrend,
      promptMetadata
    );
    
    return {
      overallConsistency,
      inconsistentThoughts,
      consistencyTrend,
      recommendations
    };
  }

  private detectContradiction(thought1: ThoughtData, thought2: ThoughtData): string | null {
    // Check for semantic similarity first
    const similarity = this.semanticAnalyzer.analyzeSemanticSimilarity(thought1, thought2);
    
    if (similarity > 0.5) { // Only check similar thoughts for contradictions
      // Check for opposing classifications
      if (this.hasOpposingClassifications(thought1, thought2)) {
        return `Opposing classifications: ${thought1.classification} vs ${thought2.classification}`;
      }

      // Check for conflicting conclusions
      if (this.hasConflictingConclusions(thought1, thought2)) {
        return 'Conflicting conclusions detected';
      }

      // Check for assumption conflicts
      const assumptionConflicts = this.checkAssumptionConflicts(thought1, thought2);
      if (assumptionConflicts) {
        return `Conflicting assumptions: ${assumptionConflicts}`;
      }
    }

    return null;
  }

  private hasOpposingClassifications(thought1: ThoughtData, thought2: ThoughtData): boolean {
    const opposingPairs = new Set([
      'hypothesis:conclusion',
      'question:solution',
      'observation:conclusion'
    ]);

    if (thought1.classification && thought2.classification) {
      const pair = `${thought1.classification}:${thought2.classification}`;
      return opposingPairs.has(pair) || opposingPairs.has(pair.split(':').reverse().join(':'));
    }

    return false;
  }

  private hasConflictingConclusions(thought1: ThoughtData, thought2: ThoughtData): boolean {
    if (thought1.classification !== 'conclusion' || thought2.classification !== 'conclusion') {
      return false;
    }

    // Simple negation detection
    const negationWords = new Set(['not', 'never', 'no', 'cannot', "don't", "doesn't"]);
    const hasNegation1 = this.containsNegation(thought1.thought, negationWords);
    const hasNegation2 = this.containsNegation(thought2.thought, negationWords);

    return hasNegation1 !== hasNegation2;
  }

  private containsNegation(text: string, negationWords: Set<string>): boolean {
    return text.toLowerCase().split(' ').some(word => negationWords.has(word));
  }

  private checkAssumptionConflicts(thought1: ThoughtData, thought2: ThoughtData): string | null {
    if (!thought1.assumptions || !thought2.assumptions) return null;

    const conflicts = thought1.assumptions.filter(assumption1 =>
      thought2.assumptions!.some(assumption2 =>
        this.areAssumptionsConflicting(assumption1, assumption2)
      )
    );

    return conflicts.length > 0 ? conflicts.join(', ') : null;
  }

  private findConflictingAssumptions(
    thought: ThoughtData,
    otherThoughts: ThoughtData[]
  ): string[] {
    if (!thought.assumptions) return [];

    const conflictingAssumptions: string[] = [];

    thought.assumptions.forEach(assumption => {
      otherThoughts.forEach(otherThought => {
        if (!otherThought.assumptions) return;

        otherThought.assumptions.forEach(otherAssumption => {
          if (this.areAssumptionsConflicting(assumption, otherAssumption)) {
            conflictingAssumptions.push(
              `"${assumption}" conflicts with "${otherAssumption}" in thought ${otherThought.thoughtNumber}`
            );
          }
        });
      });
    });

    return conflictingAssumptions;
  }

  private areAssumptionsConflicting(assumption1: string, assumption2: string): boolean {
    // Simple negation check
    const negated1 = assumption1.toLowerCase().startsWith('not ');
    const negated2 = assumption2.toLowerCase().startsWith('not ');
    const base1 = negated1 ? assumption1.slice(4) : assumption1;
    const base2 = negated2 ? assumption2.slice(4) : assumption2;

    return base1.toLowerCase() === base2.toLowerCase() && negated1 !== negated2;
  }

  /**
   * Detects contradictions between a thought and a prompt element
   */
  private detectPromptElementContradiction(thoughtText: string, promptElement: string): string | null {
    // Convert to lowercase for comparison
    const thought = thoughtText.toLowerCase();
    const element = promptElement.toLowerCase();
    
    // Check for direct negation of the prompt element
    const negationWords = new Set(['not', 'never', 'no', 'cannot', "don't", "doesn't", "won't", "shouldn't"]);
    
    // Extract key phrases from the prompt element
    const keyPhrases = element.split(/[,.]/).map(phrase => phrase.trim()).filter(phrase => phrase.length > 0);
    
    for (const phrase of keyPhrases) {
      // Skip very short phrases
      if (phrase.length < 4) continue;
      
      // Check if the thought contains the phrase
      if (thought.includes(phrase)) {
        // Look for negations near the phrase
        const words = thought.split(/\s+/);
        const phraseIndex = words.findIndex(word => word.includes(phrase.split(/\s+/)[0]));
        
        if (phraseIndex >= 0) {
          // Check for negation words within 3 words before the phrase
          const startIndex = Math.max(0, phraseIndex - 3);
          const contextWords = words.slice(startIndex, phraseIndex);
          
          if (contextWords.some(word => negationWords.has(word))) {
            return `Thought negates the prompt element: "${phrase}"`;
          }
        }
      }
      
      // Check for statements that directly contradict the element
      if (this.containsContradictoryStatement(thought, phrase)) {
        return `Thought contains a statement contradicting: "${phrase}"`;
      }
    }
    
    return null;
  }

  /**
   * Checks if a text contains statements contradicting a given phrase
   */
  private containsContradictoryStatement(text: string, phrase: string): boolean {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated NLP techniques
    
    // Check for opposite meaning phrases
    const oppositePairs = [
      ['increase', 'decrease'],
      ['more', 'less'],
      ['high', 'low'],
      ['good', 'bad'],
      ['positive', 'negative'],
      ['include', 'exclude'],
      ['allow', 'prevent'],
      ['enable', 'disable'],
      ['start', 'stop'],
      ['begin', 'end'],
      ['create', 'destroy'],
      ['add', 'remove'],
      ['accept', 'reject']
    ];
    
    for (const [term1, term2] of oppositePairs) {
      if (phrase.includes(term1) && text.includes(term2)) {
        // Check that they're referring to the same subject
        const phraseWords = phrase.split(/\s+/);
        const textWords = text.split(/\s+/);
        
        // Find common words (potential subjects)
        const commonWords = phraseWords.filter(word => 
          word.length > 3 && textWords.includes(word) && word !== term1 && word !== term2
        );
        
        if (commonWords.length > 0) {
          return true;
        }
      }
      
      if (phrase.includes(term2) && text.includes(term1)) {
        // Same check for the reverse case
        const phraseWords = phrase.split(/\s+/);
        const textWords = text.split(/\s+/);
        
        const commonWords = phraseWords.filter(word => 
          word.length > 3 && textWords.includes(word) && word !== term1 && word !== term2
        );
        
        if (commonWords.length > 0) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Generates strategies to resolve contradictions
   */
  private generateResolutionStrategies(
    contradictions: Array<{
      type: 'goal' | 'constraint' | 'domain';
      element: string;
      explanation: string;
    }>,
    thought: ThoughtData,
    promptMetadata: PromptMetadata
  ): string[] {
    if (contradictions.length === 0) {
      return [];
    }
    
    const strategies: string[] = [];
    
    // Generate specific strategies based on contradiction types
    contradictions.forEach(contradiction => {
      if (contradiction.type === 'goal') {
        strategies.push(`Revise thought to align with the goal: "${contradiction.element}"`);
        strategies.push(`Consider how to achieve the goal while maintaining your current approach`);
      } else if (contradiction.type === 'constraint') {
        strategies.push(`Modify approach to respect the constraint: "${contradiction.element}"`);
        strategies.push(`Find alternative solutions that don't violate this constraint`);
      } else if (contradiction.type === 'domain') {
        strategies.push(`Incorporate knowledge from the domain: "${contradiction.element}"`);
      }
    });
    
    // Add general strategies
    strategies.push(`Review the original prompt to ensure alignment with all requirements`);
    
    // Add thought-specific strategies
    if (thought.phase === 'Planning') {
      strategies.push(`Adjust your planning to incorporate the prompt requirements`);
    } else if (thought.phase === 'Execution') {
      strategies.push(`Modify your implementation approach to resolve these contradictions`);
    } else if (thought.phase === 'Verification') {
      strategies.push(`Verify your solution against all prompt requirements`);
    }
    
    return [...new Set(strategies)]; // Remove duplicates
  }

  /**
   * Calculates a prompt alignment score for consistency analysis
   */
  private calculatePromptAlignmentScore(thought: ThoughtData, promptMetadata: PromptMetadata): number {
    // This is a simplified implementation
    // In a real system, this would use the full prompt alignment calculation
    
    const thoughtText = thought.thought.toLowerCase();
    let score = 0;
    
    // Check for goal alignment
    const goalMatches = promptMetadata.goals.filter(goal => 
      thoughtText.includes(goal.toLowerCase())
    ).length;
    
    score += (goalMatches / Math.max(1, promptMetadata.goals.length)) * 0.5;
    
    // Check for constraint alignment
    const constraintMatches = promptMetadata.constraints.filter(constraint => 
      thoughtText.includes(constraint.toLowerCase())
    ).length;
    
    score += (constraintMatches / Math.max(1, promptMetadata.constraints.length)) * 0.3;
    
    // Check for domain alignment
    const domainMatches = promptMetadata.domains.filter(domain => 
      thoughtText.includes(domain.toLowerCase())
    ).length;
    
    score += (domainMatches / Math.max(1, promptMetadata.domains.length)) * 0.2;
    
    return score;
  }

  /**
   * Generates recommendations for improving prompt consistency
   */
  private generateConsistencyRecommendations(
    inconsistentThoughts: Array<{
      thoughtNumber: number;
      inconsistencyReason: string;
    }>,
    trend: 'improving' | 'declining' | 'stable',
    promptMetadata: PromptMetadata
  ): string[] {
    const recommendations: string[] = [];
    
    // Add recommendations based on inconsistent thoughts
    if (inconsistentThoughts.length > 0) {
      recommendations.push(`Revise thoughts ${inconsistentThoughts.map(t => t.thoughtNumber).join(', ')} to align with prompt requirements`);
      
      // Group by common reasons
      const reasonGroups: Record<string, number[]> = {};
      inconsistentThoughts.forEach(thought => {
        if (!reasonGroups[thought.inconsistencyReason]) {
          reasonGroups[thought.inconsistencyReason] = [];
        }
        reasonGroups[thought.inconsistencyReason].push(thought.thoughtNumber);
      });
      
      // Add specific recommendations for each reason group
      Object.entries(reasonGroups).forEach(([reason, thoughtNumbers]) => {
        if (reason.includes('negates')) {
          recommendations.push(`Thoughts ${thoughtNumbers.join(', ')} contradict prompt requirements - consider alternative approaches`);
        } else if (reason.includes('contradicting')) {
          recommendations.push(`Thoughts ${thoughtNumbers.join(', ')} contain statements that conflict with prompt goals`);
        }
      });
    }
    
    // Add recommendations based on trend
    if (trend === 'declining') {
      recommendations.push('Recent thoughts are becoming less aligned with the prompt - refocus on the original requirements');
    } else if (trend === 'improving') {
      recommendations.push('Continue the improving trend of prompt alignment in future thoughts');
    }
    
    // Add general recommendations
    recommendations.push(`Ensure all thoughts address the primary goals: ${promptMetadata.goals.slice(0, 3).join(', ')}`);
    
    if (promptMetadata.constraints.length > 0) {
      recommendations.push(`Maintain awareness of key constraints: ${promptMetadata.constraints.slice(0, 3).join(', ')}`);
    }
    
    return recommendations;
  }

  /**
   * Detects logical contradictions between statements
   * @param statement1 The first statement
   * @param statement2 The second statement
   * @returns Contradiction details if found, null otherwise
   */
  private detectLogicalContradiction(statement1: string, statement2: string): string | null {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated logical analysis
    
    // Normalize statements
    const norm1 = this.normalizeStatement(statement1);
    const norm2 = this.normalizeStatement(statement2);
    
    // Check for direct negation
    if (this.isDirectNegation(norm1, norm2)) {
      return 'Direct logical negation detected';
    }
    
    // Check for quantifier contradictions (all vs. some)
    if (this.hasQuantifierContradiction(norm1, norm2)) {
      return 'Quantifier contradiction detected (all vs. some)';
    }
    
    // Check for temporal contradictions
    if (this.hasTemporalContradiction(norm1, norm2)) {
      return 'Temporal contradiction detected (before vs. after)';
    }
    
    // Check for mutually exclusive categories
    if (this.hasMutuallyExclusiveCategories(norm1, norm2)) {
      return 'Mutually exclusive categories detected';
    }
    
    return null;
  }

  /**
   * Normalizes a statement for logical comparison
   */
  private normalizeStatement(statement: string): string {
    return statement
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with space
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  /**
   * Checks if two statements are direct negations of each other
   */
  private isDirectNegation(statement1: string, statement2: string): boolean {
    // Check for "not" negation
    if (statement1.includes(' not ') && statement2.includes(statement1.replace(' not ', ' '))) {
      return true;
    }
    if (statement2.includes(' not ') && statement1.includes(statement2.replace(' not ', ' '))) {
      return true;
    }
    
    // Check for "no" vs "some/all" negation
    if ((statement1.startsWith('no ') || statement1.includes(' no ')) && 
        statement2.replace(/\b(some|all)\b/g, 'no').includes(statement1)) {
      return true;
    }
    if ((statement2.startsWith('no ') || statement2.includes(' no ')) && 
        statement1.replace(/\b(some|all)\b/g, 'no').includes(statement2)) {
      return true;
    }
    
    // Check for common negation pairs
    const negationPairs = [
      ['always', 'never'],
      ['everyone', 'no one'],
      ['everything', 'nothing'],
      ['all', 'none'],
      ['must', 'must not'],
      ['can', 'cannot'],
      ['is', 'is not'],
      ['will', 'will not'],
      ['should', 'should not']
    ];
    
    for (const [pos, neg] of negationPairs) {
      // Check if statement1 contains positive and statement2 contains negative
      if (statement1.includes(` ${pos} `) && statement2.includes(` ${neg} `)) {
        // Extract context around the terms to ensure they're talking about the same thing
        const context1 = this.extractContext(statement1, pos);
        const context2 = this.extractContext(statement2, neg);
        
        if (this.contextOverlap(context1, context2)) {
          return true;
        }
      }
      
      // Check the reverse
      if (statement2.includes(` ${pos} `) && statement1.includes(` ${neg} `)) {
        const context1 = this.extractContext(statement1, neg);
        const context2 = this.extractContext(statement2, pos);
        
        if (this.contextOverlap(context1, context2)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Extracts context around a term in a statement
   */
  private extractContext(statement: string, term: string): string[] {
    const words = statement.split(' ');
    const termIndex = words.findIndex(word => word === term);
    if (termIndex === -1) return [];
    
    // Extract 3 words before and after the term
    const startIndex = Math.max(0, termIndex - 3);
    const endIndex = Math.min(words.length - 1, termIndex + 3);
    
    return words.slice(startIndex, endIndex + 1).filter(word => word !== term);
  }

  /**
   * Checks if two context arrays have significant overlap
   */
  private contextOverlap(context1: string[], context2: string[]): boolean {
    // Count overlapping words
    const overlap = context1.filter(word => context2.includes(word));
    
    // If more than 30% of words overlap, consider it significant
    return overlap.length >= Math.min(context1.length, context2.length) * 0.3;
  }

  /**
   * Checks for contradictions involving quantifiers (all, some, none)
   */
  private hasQuantifierContradiction(statement1: string, statement2: string): boolean {
    // Check for "all" vs "none" contradictions
    if ((statement1.includes(' all ') || statement1.startsWith('all ')) && 
        (statement2.includes(' none ') || statement2.startsWith('none ') || 
         statement2.includes(' no ') || statement2.startsWith('no '))) {
      
      // Extract the subject being quantified
      const subject1 = this.extractSubjectAfterQuantifier(statement1, 'all');
      const subject2 = this.extractSubjectAfterQuantifier(statement2, 'none') || 
                      this.extractSubjectAfterQuantifier(statement2, 'no');
      
      if (subject1 && subject2 && this.areSubjectsSimilar(subject1, subject2)) {
        return true;
      }
    }
    
    // Check the reverse
    if ((statement2.includes(' all ') || statement2.startsWith('all ')) && 
        (statement1.includes(' none ') || statement1.startsWith('none ') || 
         statement1.includes(' no ') || statement1.startsWith('no '))) {
      
      const subject1 = this.extractSubjectAfterQuantifier(statement2, 'all');
      const subject2 = this.extractSubjectAfterQuantifier(statement1, 'none') || 
                      this.extractSubjectAfterQuantifier(statement1, 'no');
      
      if (subject1 && subject2 && this.areSubjectsSimilar(subject1, subject2)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Extracts the subject after a quantifier
   */
  private extractSubjectAfterQuantifier(statement: string, quantifier: string): string | null {
    const regex = new RegExp(`\\b${quantifier}\\s+([\\w\\s]+?)\\b`, 'i');
    const match = statement.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Checks if two subjects are similar
   */
  private areSubjectsSimilar(subject1: string, subject2: string): boolean {
    // Simple check for exact match or substring
    if (subject1 === subject2) return true;
    if (subject1.includes(subject2) || subject2.includes(subject1)) return true;
    
    // Check for word overlap
    const words1 = subject1.split(' ');
    const words2 = subject2.split(' ');
    
    // If they share significant words (nouns), consider them similar
    const significantOverlap = words1.filter(word => 
      word.length > 3 && words2.includes(word)
    );
    
    return significantOverlap.length > 0;
  }

  /**
   * Checks for temporal contradictions
   */
  private hasTemporalContradiction(statement1: string, statement2: string): boolean {
    // Check for "before" vs "after" contradictions
    if ((statement1.includes(' before ') && statement2.includes(' after ')) ||
        (statement1.includes(' after ') && statement2.includes(' before '))) {
      
      // Extract events being temporally related
      const events1 = this.extractTemporalEvents(statement1);
      const events2 = this.extractTemporalEvents(statement2);
      
      // Check if the same events are mentioned in reverse order
      if (events1 && events2 && 
          events1.event1 === events2.event2 && 
          events1.event2 === events2.event1) {
        return true;
      }
    }
    
    // Check for other temporal contradictions (first/last, start/end)
    const temporalPairs = [
      ['first', 'last'],
      ['start', 'end'],
      ['begin', 'finish'],
      ['earlier', 'later']
    ];
    
    for (const [term1, term2] of temporalPairs) {
      if ((statement1.includes(` ${term1} `) && statement2.includes(` ${term2} `)) ||
          (statement1.includes(` ${term2} `) && statement2.includes(` ${term1} `))) {
        
        // Extract context to check if they're referring to the same event
        const context1 = statement1.includes(term1) ? 
          this.extractContext(statement1, term1) : 
          this.extractContext(statement1, term2);
        
        const context2 = statement2.includes(term1) ? 
          this.extractContext(statement2, term1) : 
          this.extractContext(statement2, term2);
        
        if (this.contextOverlap(context1, context2)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Extracts events from a temporal statement
   */
  private extractTemporalEvents(statement: string): { event1: string; event2: string } | null {
    // Extract "X before Y" or "X after Y"
    const beforeMatch = statement.match(/(.+?)\s+before\s+(.+)/i);
    if (beforeMatch) {
      return { event1: beforeMatch[1].trim(), event2: beforeMatch[2].trim() };
    }
    
    const afterMatch = statement.match(/(.+?)\s+after\s+(.+)/i);
    if (afterMatch) {
      return { event1: afterMatch[1].trim(), event2: afterMatch[2].trim() };
    }
    
    return null;
  }

  /**
   * Checks for mutually exclusive categories
   */
  private hasMutuallyExclusiveCategories(statement1: string, statement2: string): boolean {
    // Define pairs of mutually exclusive categories
    const exclusivePairs = [
      ['required', 'optional'],
      ['mandatory', 'voluntary'],
      ['always', 'sometimes'],
      ['never', 'sometimes'],
      ['all', 'some'],
      ['none', 'some'],
      ['true', 'false'],
      ['correct', 'incorrect'],
      ['right', 'wrong'],
      ['success', 'failure'],
      ['increase', 'decrease'],
      ['higher', 'lower'],
      ['more', 'less'],
      ['add', 'remove'],
      ['include', 'exclude'],
      ['enable', 'disable'],
      ['start', 'stop']
    ];
    
    for (const [cat1, cat2] of exclusivePairs) {
      // Check if statements contain opposing categories
      if ((statement1.includes(` ${cat1} `) && statement2.includes(` ${cat2} `)) ||
          (statement1.includes(` ${cat2} `) && statement2.includes(` ${cat1} `))) {
        
        // Extract context to check if they're referring to the same subject
        const context1 = statement1.includes(cat1) ? 
          this.extractContext(statement1, cat1) : 
          this.extractContext(statement1, cat2);
        
        const context2 = statement2.includes(cat1) ? 
          this.extractContext(statement2, cat1) : 
          this.extractContext(statement2, cat2);
        
        if (this.contextOverlap(context1, context2)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Detects factual inconsistencies across multiple thoughts
   * @param thoughts Array of thoughts to analyze
   * @returns Array of factual inconsistencies
   */
  public detectFactualInconsistencies(thoughts: ThoughtData[]): Array<{
    fact1: { thoughtNumber: number; statement: string };
    fact2: { thoughtNumber: number; statement: string };
    explanation: string;
  }> {
    const inconsistencies: Array<{
      fact1: { thoughtNumber: number; statement: string };
      fact2: { thoughtNumber: number; statement: string };
      explanation: string;
    }> = [];
    
    // Extract factual statements from thoughts
    const factualStatements: Array<{
      thoughtNumber: number;
      statement: string;
      entities: string[];
    }> = [];
    
    // Extract factual statements from each thought
    thoughts.forEach(thought => {
      const statements = this.extractFactualStatements(thought);
      factualStatements.push(...statements.map(statement => ({
        thoughtNumber: thought.thoughtNumber,
        statement,
        entities: this.extractEntities(statement)
      })));
    });
    
    // Compare factual statements for inconsistencies
    for (let i = 0; i < factualStatements.length; i++) {
      for (let j = i + 1; j < factualStatements.length; j++) {
        const fact1 = factualStatements[i];
        const fact2 = factualStatements[j];
        
        // Skip if statements are from the same thought
        if (fact1.thoughtNumber === fact2.thoughtNumber) continue;
        
        // Check if statements refer to the same entities
        const sharedEntities = fact1.entities.filter(entity => 
          fact2.entities.includes(entity)
        );
        
        if (sharedEntities.length > 0) {
          // Check for logical contradictions
          const contradiction = this.detectLogicalContradiction(fact1.statement, fact2.statement);
          if (contradiction) {
            inconsistencies.push({
              fact1: { thoughtNumber: fact1.thoughtNumber, statement: fact1.statement },
              fact2: { thoughtNumber: fact2.thoughtNumber, statement: fact2.statement },
              explanation: `${contradiction} regarding ${sharedEntities.join(', ')}`
            });
          }
        }
      }
    }
    
    return inconsistencies;
  }

  /**
   * Extracts factual statements from a thought
   */
  private extractFactualStatements(thought: ThoughtData): string[] {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated NLP
    
    // Split thought into sentences
    const sentences = thought.thought.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Filter for factual statements (declarative sentences without hedging)
    const factualStatements = sentences.filter(sentence => {
      // Skip questions
      if (sentence.endsWith('?')) return false;
      
      // Skip sentences with hedging language
      const hedgingWords = [
        'might', 'may', 'could', 'possibly', 'perhaps', 'probably',
        'seems', 'appears', 'likely', 'unlikely', 'sometimes',
        'often', 'rarely', 'usually', 'generally', 'typically'
      ];
      
      if (hedgingWords.some(word => sentence.toLowerCase().includes(` ${word} `))) {
        return false;
      }
      
      // Skip opinions
      const opinionIndicators = [
        'i think', 'i believe', 'in my opinion', 'i feel',
        'i would', 'i suggest', 'i recommend', 'i prefer'
      ];
      
      if (opinionIndicators.some(phrase => sentence.toLowerCase().includes(phrase))) {
        return false;
      }
      
      return true;
    });
    
    return factualStatements;
  }

  /**
   * Extracts entities from a statement
   */
  private extractEntities(statement: string): string[] {
    // This is a simplified implementation
    // In a real system, this would use named entity recognition
    
    // Look for capitalized words as potential entities
    const words = statement.split(/\s+/);
    const entities: string[] = [];
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^\w]/g, '');
      
      // Check if word starts with capital letter and isn't at the beginning of the sentence
      if (word.length > 0 && 
          word[0] === word[0].toUpperCase() && 
          word[0] !== word[0].toLowerCase() &&
          i > 0) {
        entities.push(word);
      }
    }
    
    // Add noun phrases (simplified)
    const nounPhrases = this.extractNounPhrases(statement);
    entities.push(...nounPhrases);
    
    return [...new Set(entities)]; // Remove duplicates
  }

  /**
   * Extracts noun phrases from a statement (simplified)
   */
  private extractNounPhrases(statement: string): string[] {
    // This is a very simplified implementation
    // In a real system, this would use part-of-speech tagging
    
    const nounPhrases: string[] = [];
    const words = statement.split(/\s+/);
    
    // Look for adjective + noun patterns
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i].replace(/[^\w]/g, '').toLowerCase();
      const word2 = words[i + 1].replace(/[^\w]/g, '').toLowerCase();
      
      // Check if word2 is likely a noun (ends with common noun endings)
      const likelyNoun = /(?:tion|ment|ity|ness|ance|ence|er|or|ism|ist|ing|ology|graphy)$/.test(word2);
      
      if (likelyNoun) {
        nounPhrases.push(`${word1} ${word2}`);
      }
    }
    
    return nounPhrases;
  }
} 