import { LintSource, Diagnostic } from "@codemirror/lint"
import yaml from "js-yaml"

export const yamlLinter: LintSource = (view) => {
  const content = view.state.doc.toString()
  const diagnostics: Diagnostic[] = []

  try {
    yaml.load(content)
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      const line = error.mark?.line || 0
      const column = error.mark?.column || 0
      
      diagnostics.push({
        from: view.state.doc.line(line + 1).from + column,
        to: view.state.doc.line(line + 1).from + column + 1,
        severity: "error" as const,
        message: error.message
      })
    }
  }

  return diagnostics
} 