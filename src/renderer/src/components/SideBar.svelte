<script lang="ts">
  import rightArrow from '../assets/rightArrow.svg'
  import downArrow from '../assets/downArrow.svg'

  let fileSrc = rightArrow
  let folderSrc = downArrow

  function handleFileClick() {
    fileSrc = fileSrc == rightArrow ? downArrow : rightArrow
  }

  function handleFolderClick() {
    folderSrc = folderSrc == rightArrow ? downArrow : rightArrow
  }
</script>

<div class="sidebar">
  <div class="active-files" on:mousedown={handleFileClick}>
    <img class="icon" src={fileSrc} alt="Fold" />
    <span class="content">Active Files</span>
  </div>
  <hr />
  <div class="active-folder" on:mousedown={handleFolderClick}>
    <img class="icon" src={folderSrc} alt="Fold" />
    <span class="content">Active Folder</span>
  </div>
</div>

<style>
  .sidebar {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    padding: 0.5em;
    border-right: 1px solid gray;
    user-select: none;
  }

  .active-files,
  .active-folder {
    display: grid;
    grid-template: 1fr / 1em 1fr;
    grid-gap: 0.5em;
    padding: 0.5em;
  }

  .icon {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    height: 1em;
    margin-top: 0.25em;
  }
  .content {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
  }
</style>
