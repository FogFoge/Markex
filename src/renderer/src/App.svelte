<script lang="ts">
  import SideBar from './components/SideBar.svelte'
  import MarkdownEditor from './components/MarkdownEditor.svelte'
  import MarkdownRender from './components/MarkdownRender.svelte'
  import Footer from './components/Footer.svelte'
  import type { IpcRendererEvent } from 'electron'
  import { createUntitledFile, FileInfo } from '../../main/interface'
  import { activeFile } from './store'
  import { onMount } from 'svelte'

  let untitledNumber = 1

  onMount(() => {
    activeFile.set(createUntitledFile('untitled' + untitledNumber.toString()))
  })

  window.api['onEventRegister']('file:openFile', (_event: IpcRendererEvent, file: FileInfo) => {
    activeFile.set(file)
  })
</script>

<div class="container">
  <SideBar />
  <div class="editor-container">
    <MarkdownEditor />
    <MarkdownRender />
  </div>
  <Footer />
</div>

<style>
  .container {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template: 97.5vh 2.5vh / 10em 1fr;
    border-top: 1px solid gray;
  }

  .editor-container {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    display: grid;
    grid-template-columns: 50% 50%;
  }
</style>
