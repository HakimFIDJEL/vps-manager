"use client";
import React from "react";
import { Save } from "lucide-react";
// import { IconCheck, IconCopy, IconEdit, IconEye } from "@tabler/icons-react"
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { yaml } from "@codemirror/lang-yaml";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { properties } from "@codemirror/legacy-modes/mode/properties";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { githubLight } from "@uiw/codemirror-theme-github";
import { linter, lintGutter } from "@codemirror/lint";
import { yamlLinter } from "@/lib/docker/linter";
import { useAppearance } from "@/hooks/use-appearance";
import { autocompletion } from "@codemirror/autocomplete";
import { StreamLanguage } from "@codemirror/language";

type CodeBlockProps = {
	language: string;
	filename: string;
	highlightLines?: number[];
	defaultValue?: string;
	onCodeChange?: (code: string) => void;
	onSave?: (code: string) => void;
} & (
	| {
			code: string;
			tabs?: never;
	  }
	| {
			code?: never;
			tabs: Array<{
				name: string;
				code: string;
				language?: string;
				highlightLines?: number[];
			}>;
	  }
);

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
		shell: StreamLanguage.define(shell),
		env: StreamLanguage.define(properties),
	};

	return languageMap[lang.toLowerCase()] || javascript();
};

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
	const [activeTab, setActiveTab] = React.useState(0);
	const [code, setCode] = React.useState(initialCode || defaultValue);
	const [tabsContent, setTabsContent] = React.useState(tabs);

	const tabsExist = tabsContent.length > 0;

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

	const [theme, setTheme] =
		React.useState<ReactCodeMirrorProps["theme"]>("light");
	const { appearance } = useAppearance();

	React.useEffect(() => {
		if (appearance == "light") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	}, [appearance]);

	const handleCodeChange = (newCode: string) => {
		if (tabsExist) {
			const newTabs = [...tabsContent];
			newTabs[activeTab].code = newCode;
			setTabsContent(newTabs);
		} else {
			setCode(newCode);
		}

		if (onCodeChange) {
			onCodeChange(newCode);
		}
	};

	const handleSave = () => {
		const currentCode = tabsExist ? tabsContent[activeTab].code : code;
		if (onSave) {
			onSave(currentCode);
		}
	};

	const activeCode = tabsExist ? tabsContent[activeTab].code : code;
	const activeLanguage = tabsExist
		? tabsContent[activeTab].language || language
		: language;

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
									activeTab === index
										? "text-white"
										: "text-zinc-400 hover:text-zinc-200"
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
					height="auto"
					theme={theme}
					extensions={[
						getLanguageExtension(activeLanguage),
						lintGutter(),
						linter(yamlLinter),
					]}
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
	);
};

type CodeEditorProps = {
	comment?: string;
	value: string;
	onChange: (value: string) => void;
	onSave?: () => void;
	isSaved?: boolean;
	language?: string;
	className?: string;
	customVariables?: Array<{
		label: string;
		type?: string;
		detail?: string;
	}>;
	keywords?: Array<{
		label: string;
		type?: string;
		detail?: string;
	}>;
};

export const CodeEditor = ({
	comment,
	value,
	onChange,
	onSave,
	isSaved = true,
	language = "yaml",
	className = "",
	customVariables = [],
	keywords = [],
}: CodeEditorProps) => {
	const [theme, setTheme] =
		React.useState<ReactCodeMirrorProps["theme"]>(dracula);
	const { appearance } = useAppearance();

	// Création de l'extension d'autocomplétion personnalisée
	const customCompletion = React.useMemo(() => {
		return autocompletion({
			override: [
				(context) => {
					const word = context.matchBefore(/\w*/);
					if (!word) return null;

					// Combiner les variables personnalisées avec les mots-clés
					const allCompletions = [...customVariables, ...keywords];

					return {
						from: word.from,
						options: allCompletions.map((item) => ({
							label: item.label,
							type: item.type || "variable",
							detail: item.detail,
							apply: item.label,
						})),
					};
				},
			],
		});
	}, [customVariables, keywords]);

	React.useEffect(() => {
		if (appearance === "dark") {
			setTheme(dracula);
		} else {
			setTheme(githubLight);
		}
	}, [appearance]);

	const handleKeyDown = React.useCallback(
		(event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "s") {
				event.preventDefault();
				if (!isSaved && onSave) {
					onSave();
				}
			}
		},
		[isSaved, onSave],
	);

	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<>
			<div className={`relative w-full rounded-lg overflow-auto border ${className}`}>
				<CodeMirror
					value={value}
					height="auto"
					className="bg-background rounded-lg overflow-hidden"
					theme={theme}
					extensions={[
						getLanguageExtension(language),
						lintGutter(),
						linter(yamlLinter),
						customCompletion,
					]}
					onChange={onChange}
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
				{comment && <p className="mt-1 text-xs text-muted-foreground">{comment}</p>}
		</>
	);
};
