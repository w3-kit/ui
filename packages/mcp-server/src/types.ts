export interface PropDefinition {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
}

export interface ComponentInfo {
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  props: PropDefinition[];
  sourceFiles: { path: string; content: string }[];
  examples: { basic: string; full: string };
}

export interface DesignTokens {
  colors: Record<string, string | Record<string, string>>;
  spacing: Record<string, string>;
  typography: {
    fontSizes: Record<string, string>;
    fontFamily: Record<string, string>;
    letterSpacing: Record<string, string>;
  };
}

export interface GuidelineSection {
  topic: string;
  content: string;
}

export interface CompositionTemplate {
  name: string;
  description: string;
  components: string[];
  template: string;
}

export interface Metadata {
  version: string;
  generatedAt: string;
  components: ComponentInfo[];
  designTokens: DesignTokens;
  guidelines: GuidelineSection[];
  compositions: CompositionTemplate[];
}
