import Text from './Text'

// Text.install = Vue => Vue.component(Text.name,Text);

const components = {
  install(Vue){
    Vue.component(Text.name,Text)
  }
}

export default components