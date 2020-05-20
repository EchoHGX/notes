<template>
	<div>
		make vue of webpack {{name}}
		<img src="./assets/img/webpack-vue-ml.png">
		<hr/>
		<button @click="addfun">加一{{num3}}</button>
		<hr/>
		{{cadd}}
		<hr/>
		{{cadd}}
		<hr/>
		{{madd()}}
		<hr/>
		{{madd()}}
		<transition  name="fade" mode="out-in">
		  <div v-show="show" @click="show = false">toggled content</div>
		</transition>
		<child @childHander="handerChild" ref="child"></child>
	</div>
</template>

<script>


export default {
  name: 'app',
  data(){
  	return {
  		name: 'vue-cli',
  		num1: 1,
  		num2: 2,
  		num3: 3,
  		show: true
  	}
  },
  computed:{
  	cadd(){
  		console.log('computed')
  		return this.num1 + this.num2
  	}
  },
  components: {
  	'child': {
  		methods: {
  			hander: function(){
  				console.log('child---')
  				this.$emit('childHander',5)
  			}
  		},
  		template: '<div @click="hander">child</div>'
  	}
  },
  methods:{
  	madd(){
  		return this.num1 + this.num2
  	},
  	addfun: function(){
  		this.num3 += 1;
  		this.show = true
  	},
  	handerChild: function(e){
  		console.log(e)
  	}
  },
  watch: {
	  a: function (val) {
	    console.log('这是watch a 的处理')
	    this.c = Number(val) + this.b
	  },
	  b: function (val) {
	    console.log('这是watch  b  的处理')
	    this.c = Number(val) + this.a
	  }
	}
}
</script>

<style>
	div{
		color: #f00;
	}
</style>
