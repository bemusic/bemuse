---
id: colors
title: Colors
---

These are the colors used throughout the project.

- **Cardinal red** is the main theme color, used in “Bemuse” text and as theme color of videos/images/sites in social media.
- **Crimson red** is used on the word “beat.”
- **Azure blue** is used on the word “music.”
- **Green** is used on the word “sequence.”
- **Gold** is used on the stars separating the words “beat”, “music” and “sequence.”

<div id="colors">

<div>
  <color-list :colors="colors"></color-list>
</div>

</div>

<script src="https://unpkg.com/vue@2.5.16/dist/vue.js"></script>
<script>
  Vue.component('color-list', {
    props: [ 'colors' ],
    template: `
      <ul
        :style="{
          paddingLeft: 0,
          listStyleType: 'none'
        }"
      >
        <li
          v-for="color in colors"
          :style="{
            marginBottom: '1em'
          }"
        >
          <strong
            :style="{
              background: color.color,
              color: color.dark ? 'white' : 'black'
            }"
            style="padding: 5px 8px"
          >
            {{ color.id }}
          </strong>
          &nbsp;
          <code>{{ color.color }}</code>
        </li>
      </ul>
    `
  })
  new Vue({
    el: '#colors',
    data: {
      colors: [
        { id: 'Cardinal100', color: '#FEE4ED' },
        { id: 'Cardinal200', color: '#E9A8BB' },
        { id: 'Cardinal300', color: '#DE809A' },
        { id: 'Cardinal400', color: '#E34E7A', dark: true },
        { id: 'Cardinal500', color: '#B61A44', dark: true },
        { id: 'Cardinal600', color: '#943C55', dark: true },
        { id: 'Cardinal700', color: '#7E1736', dark: true },
        { id: 'Crimson300', color: '#FE96B6' },
        { id: 'Crimson400', color: '#FB5E90' },
        { id: 'Azure300', color: '#9DEDFF' },
        { id: 'Azure400', color: '#31BCFA' },
        { id: 'Green300', color: '#D4FB7F' },
        { id: 'Green400', color: '#91CF00' },
        { id: 'Gold300', color: '#FAD765' },
        { id: 'Gold400', color: '#FFC601' }
      ]
    }
  })
</script>
