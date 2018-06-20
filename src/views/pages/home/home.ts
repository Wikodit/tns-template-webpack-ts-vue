import Vue from 'nativescript-vue'
import Component from 'lib/decorator'
import { mapGetters } from 'store'

import './home.scss'
import Post from 'models/post';

@Component({
  template: require('./home.pug'),
})
export default class HomePage extends Vue {
  surprise: boolean = false
}