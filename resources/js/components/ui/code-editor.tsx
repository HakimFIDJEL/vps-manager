"use client"
import React from "react"
import { Save } from "lucide-react"
// import { IconCheck, IconCopy, IconEdit, IconEye } from "@tabler/icons-react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { yaml } from "@codemirror/lang-yaml"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { python } from "@codemirror/lang-python"
import { rust } from "@codemirror/lang-rust"
import { sql } from "@codemirror/lang-sql"
import { xml } from "@codemirror/lang-xml"
import { dracula } from "@uiw/codemirror-theme-dracula"

type CodeBlockProps = {
  language: string
  filename: string
  highlightLines?: number[]
  defaultValue?: string
  onCodeChange?: (code: string) => void
  onSave?: (code: string) => void
} & (
  | {
      code: string
      tabs?: never
    }
  | {
      code?: never
      tabs: Array<{
        name: string
        code: string
        language?: string
        highlightLines?: number[]
      }>
    }
)

// Helper function to get the appropriate language extension for CodeMirror
const getLanguageExtension = (lang: string) => {
  const languageMap: Record<string, any> = {
    javascript: javascript(),
    js: javascript(),
    jsx: javascript({ jsx: true }),
    typescript: javascript({ typescript: true }),
    ts: javascript({ typescript: true }),
    tsx: javascript({ jsx: true, typescript: true }),
    yaml: yaml(),
    yml: yaml(),
    html: html(),
    css: css(),
    json: json(),
    md: markdown(),
    markdown: markdown(),
    python: python(),
    py: python(),
    rust: rust(),
    sql: sql(),
    xml: xml(),
  }

  return languageMap[lang.toLowerCase()] || javascript()
}

export const CodeBlock = ({
  language,
  filename,
  code: initialCode = "",
  highlightLines = [],
  tabs = [],
  defaultValue = "",
  onCodeChange,
  onSave,
}: CodeBlockProps) => {
  // const [copied, setCopied] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState(0)
  const [code, setCode] = React.useState(initialCode || defaultValue)
  const [tabsContent, setTabsContent] = React.useState(tabs)

  const tabsExist = tabsContent.length > 0

  /* Commented out copy functionality as requested
  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabsContent[activeTab].code : code
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  */

  const handleCodeChange = (newCode: string) => {
    if (tabsExist) {
      const newTabs = [...tabsContent]
      newTabs[activeTab].code = newCode
      setTabsContent(newTabs)
    } else {
      setCode(newCode)
    }

    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }

  const handleSave = () => {
    const currentCode = tabsExist ? tabsContent[activeTab].code : code
    if (onSave) {
      onSave(currentCode)
    }
  }

  const activeCode = tabsExist ? tabsContent[activeTab].code : code
  const activeLanguage = tabsExist ? tabsContent[activeTab].language || language : language

  return (
    <div className="relative w-full rounded-lg bg-slate-900 p-4 font-mono text-sm">
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex overflow-x-auto">
            {tabsContent.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 !py-2 text-xs transition-colors font-sans ${
                  activeTab === index ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center py-2">
          <div className="text-xs text-zinc-400">{filename}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
            >
              <Save size={14} />
              Sauvegarder
            </button>

            {/* Commented out copy button as requested
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
            */}
          </div>
        </div>
      </div>

      <div className="border border-slate-700 rounded">
        <CodeMirror
          value={activeCode}
          height="300px"
          theme={dracula}
          extensions={[getLanguageExtension(activeLanguage)]}
          onChange={handleCodeChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            crosshairCursor: true,
            foldGutter: true,
            indentOnInput: true,
            syntaxHighlighting: true,
          }}
        />
      </div>
    </div>
  )
}
