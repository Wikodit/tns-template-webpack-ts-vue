import Vue from 'vue'
import Component from 'components/decorator'

@Component({
  template: require('./contact.pug'),
  style: require('./contact.scss'),
})
export default class ContactComponent extends Vue {
  
}
