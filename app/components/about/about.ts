import Vue from 'vue'
import Component from 'components/decorator'

@Component({
  template: require('./about.pug'),
  style: require('./about.scss'),
})
export default class AboutComponent extends Vue {
  // Initial data can be declared as instance properties
  val: string = 'About!'

  onTaptap () {
    console.log('lol')
    this.$router.push('contact')
  }
}
