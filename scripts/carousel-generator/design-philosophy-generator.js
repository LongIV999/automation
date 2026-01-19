/**
 * Design Philosophy Generator
 * Automatically generates design philosophies based on topics and brand context
 * Inspired by canvas-design principles for artistic visual creation
 */

/**
 * Generate a design philosophy based on topic and brand
 * @param {string} topic - The content topic
 * @param {Object} brandConfig - Brand configuration
 * @returns {Object} - Design philosophy with name, philosophy text, and visual guidelines
 */
function generateDesignPhilosophy(topic, brandConfig) {
  const { brand, colors, typography } = analyzeTopic(topic, brandConfig);

  // Generate movement name
  const movementName = generateMovementName(topic, brand);

  // Generate philosophy paragraphs (4-6 paragraphs)
  const philosophy = generatePhilosophyText(topic, brand, colors, typography);

  // Generate visual guidelines
  const visualGuidelines = generateVisualGuidelines(topic, brand, colors);

  // Generate prompt hints for canvas creation
  const promptHints = generatePromptHints(topic, brand);

  return {
    movementName,
    philosophy,
    visualGuidelines,
    promptHints,
    metadata: {
      topic,
      brandId: brandConfig.brandId,
      generatedAt: new Date().toISOString()
    }
  };
}

/**
 * Analyze topic to extract key themes and visual direction
 */
function analyzeTopic(topic, brandConfig) {
  const topicLower = topic.toLowerCase();

  // Detect topic category
  let category = 'general';
  let mood = 'professional';
  let visualApproach = 'geometric';

  // Real estate keywords
  if (topicLower.match(/real estate|property|house|land|bds|bất động sản/i)) {
    category = 'real-estate';
    mood = 'trustworthy';
    visualApproach = 'architectural';
  }

  // AI/Tech keywords
  if (topicLower.match(/ai|automation|tech|coding|prompt|workflow/i)) {
    category = 'tech';
    mood = 'innovative';
    visualApproach = 'futuristic';
  }

  // Beauty/Nail keywords
  if (topicLower.match(/nail|beauty|salon|manicure|gel|powder/i)) {
    category = 'beauty';
    mood = 'elegant';
    visualApproach = 'organic';
  }

  // Recruitment keywords
  if (topicLower.match(/recruit|hiring|job|tuyển dụng|career/i)) {
    category = 'recruitment';
    mood = 'inviting';
    visualApproach = 'humanistic';
  }

  return {
    brand: brandConfig.brandId,
    category,
    mood,
    visualApproach,
    colors: brandConfig.colors,
    typography: brandConfig.typography
  };
}

/**
 * Generate movement name (1-2 words)
 */
function generateMovementName(topic, brand) {
  const movements = {
    'real-estate': [
      'Architectural Clarity',
      'Urban Serenity',
      'Spatial Harmony',
      'Concrete Poetry',
      'Metropolitan Stillness'
    ],
    'tech': [
      'Digital Minimalism',
      'Algorithmic Beauty',
      'Chromatic Logic',
      'Systematic Grace',
      'Geometric Intelligence'
    ],
    'beauty': [
      'Elegant Simplicity',
      'Organic Refinement',
      'Minimalist Luxury',
      'Chromatic Elegance',
      'Refined Naturalism'
    ],
    'recruitment': [
      'Humanist Geometry',
      'Inviting Structure',
      'Welcoming Clarity',
      'Professional Warmth',
      'Structured Openness'
    ],
    'general': [
      'Visual Silence',
      'Geometric Meditation',
      'Chromatic Balance',
      'Spatial Poetry',
      'Minimalist Expression'
    ]
  };

  const category = analyzeTopic(topic, { brandId: brand }).category;
  const options = movements[category] || movements['general'];

  // Pick based on topic hash for consistency
  const index = Math.abs(hashCode(topic)) % options.length;
  return options[index];
}

/**
 * Generate philosophy text (4-6 paragraphs)
 */
function generatePhilosophyText(topic, brand, colors, typography) {
  const analysis = analyzeTopic(topic, { brandId: brand, colors, typography });
  const { category, mood, visualApproach } = analysis;

  let paragraphs = [];

  // Paragraph 1: Core Philosophy
  paragraphs.push(
    `This visual philosophy embraces ${visualApproach} precision as its foundation. ` +
    `Every element exists with purpose, meticulously crafted to communicate through form rather than words. ` +
    `The composition breathes with intentional negative space, allowing each visual gesture to resonate. ` +
    `This is not decoration—this is visual communication distilled to its essence, the product of deep expertise and painstaking attention to spatial relationships.`
  );

  // Paragraph 2: Color and Material
  const primaryColor = colors.primary || '#000000';
  const accentColor = colors.accent || '#4A7C59';
  paragraphs.push(
    `Color operates as a systematic language. The primary palette—anchored by sophisticated tones like ${primaryColor}—creates visual hierarchy through chromatic weight rather than size. ` +
    `Accent colors (${accentColor}) appear as deliberate punctuation marks, guiding the eye with the precision of a master conductor. ` +
    `Every hue is calibrated to work within a cohesive system, chosen through countless iterations to achieve perfect chromatic balance.`
  );

  // Paragraph 3: Typography and Text Treatment
  const headlineFont = typography.headline || 'sans-serif';
  paragraphs.push(
    `Typography serves the visual, never dominates it. Using ${headlineFont}, text appears as minimal anchors—small, precise labels that whisper rather than shout. ` +
    `Large type exists only as sculptural form, single words transformed into architectural elements. ` +
    `Paragraphs are forbidden; information lives in visual diagrams, spatial arrangements, and chromatic coding. ` +
    `Every letterform placement is the result of meticulous typographic refinement.`
  );

  // Paragraph 4: Composition and Scale
  paragraphs.push(
    `The composition follows ${mood === 'professional' ? 'grid-based precision' : 'organic flow principles'}, where scale creates meaning. ` +
    `Massive geometric blocks contrast with delicate details, establishing visual tension that holds attention. ` +
    `Elements cluster and breathe according to their semantic relationships—proximity communicates connection, space suggests pause. ` +
    `This spatial orchestration appears effortless but represents countless hours of compositional refinement at master-level execution.`
  );

  // Paragraph 5: Visual Expression Method
  if (category === 'tech') {
    paragraphs.push(
      `Visual elements borrow from systematic observation—repeated patterns, layered geometric shapes, and modular grids that suggest data visualization. ` +
      `Diagrams replace paragraphs. Icons function as a visual vocabulary. Abstract forms encode information spatially. ` +
      `The aesthetic feels analytical yet beautiful, as if documenting invisible systems with scientific precision and artistic grace.`
    );
  } else if (category === 'beauty') {
    paragraphs.push(
      `Visual expression emphasizes organic curves and flowing forms balanced by geometric precision. ` +
      `Soft gradients meet sharp edges. Negative space breathes like Japanese ma—intentional emptiness as powerful as filled areas. ` +
      `Photography and illustration dominate, with minimal text serving only to anchor what the visuals already communicate through their elegant, refined presence.`
    );
  } else if (category === 'real-estate') {
    paragraphs.push(
      `Architectural thinking defines the visual structure—clean lines, monumental forms, and spatial divisions that evoke built environments. ` +
      `Brutalist material honesty meets modernist clarity. Large blocks of solid color function as walls; negative space as windows. ` +
      `The composition feels substantial, trustworthy, permanent—qualities achieved through expert craftsmanship and structural integrity.`
    );
  } else {
    paragraphs.push(
      `Visual elements cluster in organic yet systematic arrangements. Shapes repeat with variation, creating rhythm without monotony. ` +
      `Geometric patterns provide structure; organic touches add humanity. The balance between order and warmth invites engagement while maintaining professional sophistication. ` +
      `Every detail refined through the lens of expert design judgment.`
    );
  }

  // Paragraph 6: Craftsmanship Philosophy
  paragraphs.push(
    `The final work must appear as though it took countless hours to create—because it should. ` +
    `Every alignment, every color choice, every spatial relationship demands meticulous attention. ` +
    `This is the work of someone at the absolute top of their field, labored over with deep expertise and unwavering commitment to craft. ` +
    `The result: a visual artifact that speaks volumes through silent, sophisticated design—art masquerading as communication, communication elevated to art.`
  );

  return paragraphs.join('\n\n');
}

/**
 * Generate visual guidelines
 */
function generateVisualGuidelines(topic, brand, colors) {
  const analysis = analyzeTopic(topic, { brandId: brand, colors });

  return {
    colorPalette: {
      primary: colors.primary || '#0A2540',
      accent: colors.accent || '#4A7C59',
      background: colors.background || '#F4F3EE',
      text: colors.text || '#FFFFFF'
    },
    composition: {
      approach: analysis.visualApproach,
      textUsage: 'minimal-essential-only',
      visualDominance: '90% visual / 10% text',
      spacing: 'generous negative space'
    },
    styleKeywords: [
      analysis.mood,
      analysis.visualApproach,
      'minimalist',
      'sophisticated',
      'master-crafted'
    ]
  };
}

/**
 * Generate prompt hints for canvas creation
 */
function generatePromptHints(topic, brand) {
  const analysis = analyzeTopic(topic, { brandId: brand });

  const promptTemplates = {
    'real-estate': 'architectural photography, minimalist composition, brutalist aesthetic, geometric forms, professional trustworthy atmosphere',
    'tech': 'futuristic interface design, geometric patterns, systematic diagrams, data visualization aesthetic, sophisticated tech aesthetic',
    'beauty': 'elegant organic forms, soft lighting, refined minimalism, luxury spa aesthetic, sophisticated feminine touches',
    'recruitment': 'professional welcoming atmosphere, humanistic design, warm geometric composition, inviting corporate aesthetic',
    'general': 'minimalist sophisticated design, geometric precision, chromatic balance, professional aesthetic'
  };

  const base = promptTemplates[analysis.category] || promptTemplates['general'];

  return {
    base,
    styleModifiers: [
      'museum quality',
      'meticulously crafted',
      'expert level composition',
      'perfect spacing and alignment',
      'sophisticated color palette'
    ],
    avoidances: [
      'no cartoonish elements',
      'no amateur compositions',
      'no cluttered layouts',
      'no excessive text'
    ]
  };
}

/**
 * Simple hash function for consistent randomization
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Save design philosophy to markdown file
 */
function savePhilosophyToMarkdown(philosophy, outputPath) {
  const fs = require('fs');
  const path = require('path');

  const markdown = `# ${philosophy.movementName}

**Generated:** ${philosophy.metadata.generatedAt}
**Topic:** ${philosophy.metadata.topic}
**Brand:** ${philosophy.metadata.brandId}

---

## Philosophy

${philosophy.philosophy}

---

## Visual Guidelines

**Color Palette:**
- Primary: ${philosophy.visualGuidelines.colorPalette.primary}
- Accent: ${philosophy.visualGuidelines.colorPalette.accent}
- Background: ${philosophy.visualGuidelines.colorPalette.background}
- Text: ${philosophy.visualGuidelines.colorPalette.text}

**Composition Approach:** ${philosophy.visualGuidelines.composition.approach}
**Text Usage:** ${philosophy.visualGuidelines.composition.textUsage}
**Visual Dominance:** ${philosophy.visualGuidelines.composition.visualDominance}
**Spacing:** ${philosophy.visualGuidelines.composition.spacing}

**Style Keywords:**
${philosophy.visualGuidelines.styleKeywords.map(k => `- ${k}`).join('\n')}

---

## Canvas Creation Prompts

**Base Prompt:**
${philosophy.promptHints.base}

**Style Modifiers:**
${philosophy.promptHints.styleModifiers.map(m => `- ${m}`).join('\n')}

**Avoid:**
${philosophy.promptHints.avoidances.map(a => `- ${a}`).join('\n')}
`;

  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(`✓ Design philosophy saved to ${outputPath}`);

  return outputPath;
}

module.exports = {
  generateDesignPhilosophy,
  savePhilosophyToMarkdown,
  analyzeTopic,
  generateMovementName
};
