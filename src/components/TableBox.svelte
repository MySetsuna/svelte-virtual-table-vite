<script>
  import VirtualList from "../lib/VirtualList";
  import { onMount } from "svelte";

  /**
   * @type {HTMLElement}
   */
  let virtuallTableDom;
  let virtuallTable;
  let scrollTop = 0;
  let scrollLeft = 0;
  let scrollHeight = 0;
  let scrolling = false;

  /**
   *
   * @param e
   */
  const handleScroll = (e) => {
    scrollTop = e.target.scrollTop;
    scrollLeft = e.target.scrollLeft;
    if (!scrolling) {
      window.requestAnimationFrame(() => {
        virtuallTable.scroll(scrollTop, scrollLeft);
        scrolling = false;
      });
    }
    scrolling = true;
  };

  onMount(() => {
    virtuallTable = new VirtualList({
      domRef: virtuallTableDom,
      rowHeight: 42,
      height: 600,
      dataList: Array(600)
        .fill(0)
        .map((item, index) => ({ id: `${index}` })),
    });
    virtuallTable.domRef.addEventListener("scroll", handleScroll);
    scrollHeight =
      virtuallTable.domRef.scrollHeight - virtuallTable.domRef.clientHeight;
  });
  $: {
    if (virtuallTableDom) {
      virtuallTableDom.scrollTop = scrollTop;
    }
  }
</script>

scrollTop: {scrollTop}
scrollLeft: {scrollLeft}
<div bind:this={virtuallTableDom} />
<input
  type="range"
  bind:value={scrollTop}
  max={scrollHeight}
  style="width: 1000px;"
/>
