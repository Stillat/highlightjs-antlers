/*
Language: Antlers
Requires: php.js, xml.js, yaml.js
Author: John Koster <john@stillat.com>
Description: Provides syntax highlighting for Antlers, Statamic's templating language.
*/
export default function (hljs) {
    const regex = hljs.regex;

    const keywords = [
        'if',
        'elseif',
        'else',
        'endif',
        'unless',
    ];

    const coreTags = [
        'asset',
        'assets',
        'cache',
        'collection',
        'can',
        'cookie',
        'dd', 'ddd', 'dump',
        'get_content',
        'get_error', 'get_errors',
        'get_files',
        'glide',
        'in',
        'increment',
        'installed',
        'is',
        'iterate', 'foreach',
        'locales',
        'markdown',
        'member',
        'mix',
        'mount_url',
        'nav',
        'not_found',
        '404',
        'obfuscate',
        'parent',
        'partial',
        'path',
        'query',
        'range', 'loop',
        'redirect',
        'relate',
        'rotate', 'switch',
        'route',
        'scope',
        'section',
        'session',
        'set',
        'structure',
        'svg',
        'theme',
        'trans',
        'trans_choice',
        'user_groups',
        'user_roles',
        'users',
        'vite',
        'widont',
        'yields',
    ];

    const MODIFIER_TITLE = {
        begin: '\\|\\s*',
        end: '(\\s|\\(|:)',
        excludeEnd: true,
        returnBegin: false,
        relevance: 0,
        contains: [
            {
                scope: 'title',
                match: /[a-zA-Z_][a-zA-Z0-9_-]*/
            }
        ]
    };

    const VARIABLE = {
        scope: 'variable',
        relevance: 0,
        match: '\\$?[_a-zA-Z][_a-zA-Z0-9-]*',
    };

    const NUMBER = {
        scope: "number",
        relevance: 0,
        match: /\d+/
    };

    const shortTagNamed = (tagnames, { relevance }) => {
        return {
            beginScope: {
                1: 'name',
            },
            relevance: relevance || 0,
            endScope: 'template-tag',
            begin: [
                regex.either(...tagnames),
                '(?=\\s|:)'
            ],
            end: '\\s*',
            keywords: "in",
            contains: [
                VARIABLE,
                NUMBER,
                MODIFIER_TITLE,
            ]
        };
    };

    const ANTLERS_TAG_NAMES = coreTags.concat(coreTags.map(s => '%' + s));
    const ANTLERS_KEYWORDS = keywords.concat(ANTLERS_TAG_NAMES);

    const SUBST = {
        scope: 'substr',
        variants: [
            {

                beginScope: 'template-tag',
                endScope: 'template-tag',
                begin: /\{/,
                end: /\}/,
                contains: [
                    shortTagNamed(ANTLERS_TAG_NAMES, 0),
                    VARIABLE,
                    NUMBER,
                    MODIFIER_TITLE,
                    'self'
                ]
            }
        ]
    };

    const STRING = {
        scope: 'string',
        relevance: 0,
        variants: [
            {
                begin: /'/,
                end: /'/
            },
            {
                begin: /"/,
                end: /"/
            },
        ],
        contains: [
            SUBST
        ]
    };


    const antlersTag = (tagnames, { relevance }) => {
        return {
            beginScope: {
                1: 'template-tag',
                2: 'name'
            },
            relevance: relevance || 0,
            endScope: 'template-tag',
            begin: [
                '\\{\\{\\s*\/?',
                tagnames.join('|'),
                '(?=\\s|:)'
            ],
            end: '\\s*\\}\\}',
            keywords: "in",
            contains: [
                STRING,
                VARIABLE,
                NUMBER,
                SUBST,
                MODIFIER_TITLE,
                'self'
            ]
        };
    };

    const nonCoreAntlersTag = (tagnames, { relevance }) => {
        return {
            beginScope: {
                1: 'template-tag',
                3: 'variable'
            },
            relevance: relevance || 0,
            endScope: 'template-tag',
            begin: [
                '\\{\\{\\s*\/?',
            ],
            end: '\\s*\\}\\}',
            keywords: "in",
            contains: [
                STRING,
                VARIABLE,
                NUMBER,
                SUBST,
                MODIFIER_TITLE
            ]
        };
    };

    const CUSTOM_TAG_RE = /[a-z_]+/;
    const TAG = antlersTag(ANTLERS_KEYWORDS, { relevance: 5 });
    const TAG_VAR = nonCoreAntlersTag(ANTLERS_KEYWORDS, { relevance: 5 });
    const CUSTOM_TAG = antlersTag([CUSTOM_TAG_RE], { relevance: 1 });

    return {
        name: 'Antlers',
        keywords: 'statamic antlers',
        case_insensitive: false,
        subLanguage: 'xml',
        contains: [
            hljs.COMMENT('\\{\\{#', '#\\}\\}'),
            {
                begin: '^\\-{3}(?=\\s|$)',
                end: '^\\-{3}(?=\\s|$)',
                subLanguage: 'yaml',
                relevance: 10
            },
            {
                begin: /<\?(php)?/,
                end: /\?>/,
                subLanguage: 'php',
                relevance: 0
            },
            TAG,
            TAG_VAR,
            {
                beginScope: 'template-tag',
                endScope: 'template-tag',
                begin: '\\{\\{\\$',
                end: '\\$\\}\\}',
                subLanguage: 'php',
                relevance: 1
            },
            {
                beginScope: 'template-tag',
                endScope: 'template-tag',
                begin: '\\{\\{\\?',
                end: '\\?\\}\\}',
                subLanguage: 'php',
                relevance: 1
            },
            {
                begin: '{\\{',
                end: '\\}',
                contains: [
                    'self',
                    TAG,
                ]
            }
        ]
    }
}
