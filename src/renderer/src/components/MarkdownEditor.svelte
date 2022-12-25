<script lang="ts">
  import type monaco from 'monaco-editor'
  import { onMount } from 'svelte'
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
  import { activeFile } from '../store'

  let divEle: HTMLDivElement = null
  let editor: monaco.editor.IStandaloneCodeEditor
  let Monaco 

  let innerText: string = ''
  activeFile.subscribe((value) => {
    if (value != undefined && editor != undefined && value.modifier != 'monaco') {
      let model = editor.getModel()
      model.setValue(value.fileContent)
    }
  })

  onMount(async () => {
    self.MonacoEnvironment = {
      getWorker: function (_moduleId: any) {
        return new editorWorker()
      }
    }

    Monaco = await import('monaco-editor')
    editor = Monaco.editor.create(divEle, {
      value: innerText,
      language: 'markdown',
      selectOnLineNumbers: true,
      roundedSelection: false,
      cursorStyle: 'line', // 光标样式
      automaticLayout: true, // 自动布局
      glyphMargin: true, // 字形边缘
      useTabStops: false,
      autoIndent: true, // 自动布局
      overviewRulerBorder: false
    })

    let model = editor.getModel()

    model.onDidChangeContent(() => {
      activeFile.update((f) => {
        f.fileContent = editor.getValue()
        f.modifier = 'monaco'
        return f
      })
    })

    return () => {
      editor.dispose()
    }
  })
</script>

<div bind:this={divEle} class="editor" />

<style>
  .editor {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    border-right: 1px solid gray;
    white-space: nowrap;
    outline: 0;
  }
</style>
