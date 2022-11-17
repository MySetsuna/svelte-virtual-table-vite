<script>
  export let content;
  export let width = '1000px';
  export let height = '100%'
  export let bachground ='pink'

</script>

<div style="height: {height};width:{width};bachground-color:{bachground}">
   {content}
   <slot></slot>
</div>