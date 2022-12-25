import hljs from 'highlight.js'

export const md = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {
        /* empty */
      }
    }
    return ''
  }
})
md.linkify.tlds('.py', false).tlds('.cpp', false)
