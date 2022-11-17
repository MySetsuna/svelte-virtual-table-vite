<script>
  import VirtualList from "../lib/VirtualList";
  import { onMount } from "svelte";

  let virtuallTableDom;
  onMount(() => {
    const virtuallTable = new VirtualList({
      rowHeight: 42,
      height: 600,
      dataList: Array(600)
        .fill(0)
        .map((item, index) => ({ id: `${index}` })),
    });
    virtuallTable.mount();
    document.getElementById("table").appendChild(virtuallTable.domRef);
  });
</script>

<div id="table" />
