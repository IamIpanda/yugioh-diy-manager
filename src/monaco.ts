import { loader } from "@monaco-editor/react";

interface CompletionField {
    name: string;
    type: string;
}

interface CompletionMethod {
    name: string;
    description: string;
    params: { name: string; type: string }[];
    returns: string[];
}

interface CompletionClass {
    fields: CompletionField[];
    methods: CompletionMethod[];
}

type CompletionData = Record<string, CompletionClass>;

interface ConstantItem {
    name: string;
    value: string;
    description: string | null;
}

let completions_cache: CompletionData | null = null;
let completions_promise: Promise<CompletionData> | null = null;

function fetch_completions(): Promise<CompletionData> {
    if (completions_cache) return Promise.resolve(completions_cache);
    if (!completions_promise)
        completions_promise = fetch(import.meta.env.BASE_URL + 'assets/completions.json')
            .then(r => r.json())
            .then(data => { completions_cache = data; return data; });
    return completions_promise;
}

let constants_cache: ConstantItem[] | null = null;
let constants_promise: Promise<ConstantItem[]> | null = null;

function fetch_constants(): Promise<ConstantItem[]> {
    if (constants_cache) return Promise.resolve(constants_cache);
    if (!constants_promise)
        constants_promise = fetch(import.meta.env.BASE_URL + 'assets/constants.json')
            .then(r => r.json())
            .then(data => { constants_cache = data; return data; });
    return constants_promise;
}

function resolve_class(variable: string): string | null {
    if (variable === 'Card' || variable === 'Duel' || variable === 'Effect' || variable === 'Group' || variable === 'Debug')
        return variable;
    if (/^(?:e|ge)\d*$/.test(variable))
        return 'Effect';
    if (variable.endsWith('g'))
        return 'Group';
    if (variable.endsWith('c'))
        return 'Card';
    return null;
}

function build_field_item(field: CompletionField, className: string, range: any, monaco: any): any {
    return {
        label: field.name,
        kind: monaco.languages.CompletionItemKind.Field,
        detail: `(field) ${className}.${field.name}: ${field.type}`,
        insertText: field.name,
        range,
    };
}

function build_method_item(method: CompletionMethod, className: string, range: any, monaco: any, skipFirstParam: boolean): any {
    const displayParams = method.params.map(p => p.name + ': ' + p.type).join(',')
    const returnsStr = method.returns.length > 0 ? method.returns.join(' | ') : 'void'

    const snippetParams = method.params
        .slice(skipFirstParam ? 1 : 0)
        .map((p, i) => '${' + (i + 1) + ':' + p.name + '}')
        .join(',')

    return {
        label: method.name,
        kind: monaco.languages.CompletionItemKind.Method,
        detail: `(method) ${className}:${method.name}(${displayParams}): ${returnsStr}`,
        documentation: { value: method.description },
        insertText: method.name + '(' + snippetParams + ')',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    };
}

function build_hover(className: string, variable: string, methodName: string, completions: CompletionData): any | null {
    const classData = completions[className];
    if (!classData) return null;

    const method = classData.methods.find(m => m.name === methodName);
    if (method) {
        const paramsStr = method.params.map(p => p.name + ': ' + p.type).join(', ');
        const returnsStr = method.returns.length > 0 ? method.returns.join(' | ') : 'void';
        return {
            contents: [
                { value: `**${variable}:${methodName}**(${paramsStr}): ${returnsStr}` },
                { value: method.description },
            ],
        };
    }

    const field = classData.fields.find(f => f.name === methodName);
    if (field)
        return { contents: [{ value: `**${variable}.${methodName}**: ${field.type}` }] };

    return null;
}

let completion_disposable: any = null;
let hover_disposable: any = null;
let constant_disposable: any = null;

Promise.all([loader.init(), fetch_completions(), fetch_constants()]).then(([monaco, completions, constants]) => {
    if (completion_disposable) completion_disposable.dispose()
    completion_disposable = monaco.languages.registerCompletionItemProvider('lua', {
        triggerCharacters: ['.', ':'],
        provideCompletionItems: (model: any, position: any, _context: any) => {
            const line = model.getLineContent(position.lineNumber)
            const prefix = line.substring(0, position.column - 1)
            const match = prefix.match(/(\w+)([\.:])(\w*)$/)
            if (!match) return

            const variable = match[1]
            const separator = match[2]
            const partial = match[3]
            const className = resolve_class(variable)
            if (!className) return

            const classData = completions[className]
            if (!classData) return

            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column - partial.length,
                endColumn: position.column,
            }

            const isColon = separator === ':'
            const items: any[] = []

            for (const field of classData.fields)
                if (field.name.startsWith(partial))
                    items.push(build_field_item(field, className, range, monaco))

            for (const method of classData.methods)
                if (method.name.startsWith(partial))
                    items.push(build_method_item(method, className, range, monaco, isColon))

            return { suggestions: items }
        }
    })

    if (hover_disposable) hover_disposable.dispose()
    hover_disposable = monaco.languages.registerHoverProvider('lua', {
        provideHover: (model: any, position: any) => {
            const word = model.getWordAtPosition(position)
            if (!word) return

            const line = model.getLineContent(position.lineNumber)
            const beforeWord = line.substring(0, word.startColumn - 1)
            const contextMatch = beforeWord.match(/(\w+)[\.:]$/)
            if (contextMatch) {
                const variable = contextMatch[1]
                const className = resolve_class(variable)
                if (className)
                    return build_hover(className, variable, word.word, completions)
            }

            for (const c of constants) {
                if (c.name === word.word) {
                    return {
                        contents: [
                            { value: `**${c.name}** = ${c.value}` },
                            ...(c.description ? [{ value: c.description }] : []),
                        ],
                    }
                }
            }
        }
    })

    if (constant_disposable) constant_disposable.dispose()
    constant_disposable = monaco.languages.registerCompletionItemProvider('lua', {
        provideCompletionItems: (model: any, position: any) => {
            const word = model.getWordAtPosition(position)
            if (!word || word.word.length === 0) return

            const items: any[] = []
            for (const c of constants) {
                if (!c.name.startsWith(word.word)) continue
                items.push({
                    label: c.name,
                    kind: monaco.languages.CompletionItemKind.Constant,
                    detail: c.description ? `${c.value} — ${c.description}` : c.value,
                    documentation: c.description,
                    insertText: c.name,
                    range: {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn,
                    },
                })
            }

            return items.length > 0 ? { suggestions: items } : undefined
        }
    })
}).catch(() => {})
