import Vue from 'vue'
import { AboutComponent } from 'components'
import Component from 'components/decorator'

@Component({
  template: require('./home.pug'),
  style: require('./home.scss'),
})
export default class HomeComponent extends Vue {
  message: string = 'Hello!'
}
