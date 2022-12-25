<script lang="ts">
  import { activeFile } from "../store"


  let innerText: string = ''
  let render: Element

  activeFile.subscribe((file) => {
    if(file != undefined) {
      innerText = file.fileContent
    }
  })

  $: {
    if (render != undefined) {
      render.innerHTML = window.api['markdown'](innerText)
    }
  }
</script>

<div class="render" bind:this={render} />

<style>
  .render {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    padding: 1em;

    white-space: nowrap;
    overflow-x: auto;
    overflow-y: auto;
  }
</style>
