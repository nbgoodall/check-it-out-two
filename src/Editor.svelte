<script>
  import {
    Settings,
    Tools,
    Display,
    FrameRate,
    Actions,
    Controls,
    Frames,
    Layers
  } from 'sections'

</script>

<div class="p-3 pt-16 flex justify-center">
  <div class="grid editor-grid gap-3">

    <!-- First row -->
    <div class="col-start-2">
      <Settings />
    </div>
    <!-- End first row -->

    <!-- Second row -->
    <div class="row-start-2 flex justify-end items-start">
      <Tools  />
    </div>

    <div class="col-start-2 row-start-2">
      <Display />
    </div>

    <div class="row-start-2 flex flex-col">
      <FrameRate />

      <Layers />
    </div>
    <!-- End second row -->

    <!-- Third row -->
    <div class="col-start-2">
      <Actions />

      <hr class="mt-3 pb-3 border-gray-400">

      <Controls />
    </div>
    <!-- End third row -->

    <!-- Fourth row -->
    <div class="col-span-3 flex justify-center">
      <Frames />
    </div>
    <!-- End fourth row -->
  </div>
</div>

<style>
  .editor-grid {
    grid-template-columns: 1fr auto 1fr;
  }
</style>