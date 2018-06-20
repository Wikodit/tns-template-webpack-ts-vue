import Vue from 'nativescript-vue'
import Component from 'lib/decorator'
import { mapGetters } from 'store'
import Post from 'models/post'

import './post-list.scss'

@Component({
  template: require('./post-list.pug'),
  computed: mapGetters({
    findAllPost: 'entities/posts/all',
    findPost: 'entities/posts/find'
  })
})
export default class PostListPage extends Vue {
  findAllPost: () => Post[]
  findPost: (id: number) => Post

  get post() {
    const post = this.findAllPost()
    return post && post[0]
  }
}
