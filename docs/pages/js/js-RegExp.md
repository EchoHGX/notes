# 正则表达式必知必会
正式表达式基础可阅读[菜鸟教程-js正则](https://www.runoob.com/jsref/jsref-obj-regexp.html)

## 匹配过程
匹配字符\(str\)：'acdcabab'  
表达式\(reg\)：/ab/g  
首先由正式表达式reg的'a'获得控制权,从str的位置1开始重试匹配，匹配到字符串'a'成功，控制权交给reg的b。开始从位置1开始匹配，匹配到字符'c'失败，控制权交还给a。
开始从位置3开始匹配，匹配到字符'd'失败，继续向后位置4匹配到'c'失败。再继续向后位置5匹配到字符'a'成功，控制权交个reg的b,从位置6继续匹配到'b'成功（因为这里/g全局匹配，需要匹配完整个字符串。如果没有g全局匹配，此时匹配结束）。控制权交还给a，继续向后位置7匹配到a成功。控制权再次交给b,继续向后位置8匹配到b成功。已经匹配到最后一个字符，匹配结束。


## 贪婪模式，惰性模式
- 贪婪模式：尽可能多匹配，有多少匹配多少
- 惰性模式：尽可能少匹配，能不匹配就不匹配

> 在量词后面加上?就变成惰性模式

**惰性限定符列表:**

语法结构|	语义解释
--|--
*?|  可以重复任意次，但是尽可能重复少的次数。
+?|  可以重复1次或者任意多次，但是尽可能重复少的次数，不过最少次数是1。
??|  可以重复0次或1次，但尽可能少重复。
{n,m}?|  可以重复n到m此，但尽可能少重复，最少匹配次数是n。
{n,}?|  可以重复n次以上，但尽可能少重复，最少匹配n次。

示例：  
待匹配字符串: abbbbb  
贪婪模式：/ab\*/  ->  abbbbb    (\*表示可批量0个或多个，所有这里会匹配尽可能多的b)  
惰性模式(量词后加?)：/ab*?/  ->  a      (惰性模式下，尽可能少的匹配，所有这里匹配了0个b)

**虽然惰性模式会尽量少匹配，但并不会跳过匹配**
例如 'bbba'.match(/b*?a/)会匹配bbba而不是ba，这是因为匹配是从第一个开始匹配，而不会跳过匹配

## 分组
用一对括号()包裹起来的内容就代表了分组，每一对括号就是一个分组，分组可以分为**捕获型分组**和**非捕获型分组**，以及**正向前瞻型分组**和**反向前瞻型分组**
- 捕获型分组  
捕获型分组会在 比如 match exec这样的函数中以第二项，第三项的形式得到相应分组的结果
> 顺道说下match exec函数的区别。match是字符串的方法，语法str.match(regexp)；exec是正则表达式的方法,语法regexp.exec(str)，同时exec的regexp有没有g都无影响。  
```js
var str = 'ab12cd34ef'
console.log(str.match(/(\d+)/)) //["12", "12", index: 2, input: "ab12cd34ef", groups: undefined]
console.log(str.match(/(\d+)cd(\d+)/)) //["12cd34", "12", "34", index: 2, input: "ab12cd34ef", groups: undefined]
```
上面第一个打印的结果中的数组[0]就是就是匹配的结果，数组[1]就是第一个捕获分组的结果，第二个打印的结果中数组[2]就是第二个捕获分组的结果。依次类推，如果还有更多捕获分组，会在数组中以第四项([3]),第五项([4])...的形式返回  

- 非捕获型分组(?:)  
非捕获型分组也就是 有些地方需要用到一对括号，但是又不想让他成为一个捕获型分组也就是不想让这个分组被类似 macth exec 这样的函数所获取到通常在括号内部的前面加上?: 也就是 (?:pattern)这样就变成了一个非捕获型分组  
```js
var str = 'ab12cd34ef'
console.log(str.match(/(?:\d+)/)) //["12", index: 2, input: "ab12cd34ef", groups: undefined]
console.log(str.match(/(?:\d+)cd(?:\d+)/)) //["12cd34", index: 2, input: "ab12cd34ef", groups: undefined]
```
这样，就不会捕获()中所匹配的结果了  

- 正向前瞻型分组(?=)   
正向前瞻(?=表达式)表示后面要有什么
```js
// 匹配.jpg后缀文件名
var str = '123.jpg,456.gif,abc.jpg';
var regexp = /\w+(?=\.jpg)/g; 
console.log(str.match(regexp)); // ["123", "abc"]
```

- 反向前瞻型分组(?!)  
反向前瞻(?!表达式)表示后面不能有什么
```js
// 匹配不是.jpg后缀文件名
var str = '123.jpg,456.gif,abc.jpg';
var regexp = /\w+(?=\.(?!jpg))/g; 
console.log(str.match(regexp)); // ["456"]  
// 处理数字的千位分隔符,匹配的位置不可能是开头
var expreg = /(?!^)(?=(\d{3})+$)/g;
'123456789'.replace(expreg,','); // "123,456,789"
```  

> es6中新增了正向后顾(?<=表达式)和反（负）向后顾(?<!表达式)，正向后顾(?<=表达式)表示前面要有什么，反向后顾(?<!表达式)表示前面不能有什么。

```js
var str = 'abc1 def2'
str.match(/(?<=abc)\d+/) // 1
str.match(/(?<!abc)\d+/) // 2
```

**命名捕获分组**
我们可以通过在分组中前面加上(?\<name\>)给分组命名,match exec函数返回的groups中保存命名捕获分组的结果 
```js
var reg = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
var date = '2019-08-12'
let result = date.match(reg) //["2019-08-12", "2019", "08", "12", index: 0, input: "2019-08-12", groups: {year: "2019",month: "08",day: "12"}]
console.log(result.groups)  // {year: "2019",month: "08",day: "12"}
```
**引用捕获结果**  
被正则表达式匹配（捕获）到的字符串会被暂存起来。其中，由分组捕获的串会从1开始编号
```js
var reg = /(\d{4})-(\d{2})-(\d{2})/
var date = '2019-08-12'
reg.exec(date)
console.log(RegExp.$1) //2019
console.log(RegExp.$2) //08
console.log(RegExp.$3) //12
```
> *$1,$2...$9是RegExp对象的静态属性*。如果表达式模式中有括起来的子匹配，$1...$9表示第1个到第9个子匹配所捕获到的内容，如果有超过9个以上的子匹配，$1…$9属性分别对应最后的9个子匹配。


**反向引用**
可以引用前面捕获的分组，还需注意的是，如果引用了越界或者不存在的编号的话，就被被解析为普通的表达式
```js
//判断是否是对称的字符
var str = 'abcba'
var reg = /(\w)(\w)(\w)\3?\2\1/
console.log(reg.test(str)) // true
```
反向引用命名分组\k\<name\>
```js
var str = 'abcba'
var reg = /(?<first>\w)(?<two>\w)(?<three>\w?)\k<three>?\k<two>\k<first>/
console.log(reg.test(str)) // true
```


**嵌套捕获分组**  
嵌套分组就是括号里面嵌套着括号，个人理解嵌套捕获分组就是从左向右捕获的基础的再加上*先捕获大括号，再捕获小括号*
```js
var reg = /((\d{4})-(\d{2}))-(\d{2})/
var date = '2019-08-12'
reg.exec(date)
console.log(RegExp.$1) //2019-08
console.log(RegExp.$2) //2019
console.log(RegExp.$3) //08
console.log(RegExp.$4) //12
```

**与replace配合** 
String.prototype.replace方法的传参中可以直接引用被捕获的串，我们可以利用分组结合replace很方便的做一些替换  
```js
var reg = /(\d{4})-(\d{2})-(\d{2})/
var date = '2019-08-12'
// $1...$9就是对分组的引用
date.replace(reg,'$1.$2.$3')  //2019.08.12
```
还可以结合命名分组
```js
var reg = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
var date = '2019-08-12'
date.replace(reg,'$<month>/$<day>/$<year>')  //12/08/2019
```
结合方法
```js
var reg = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
var date = '2019-08-12'
date.replace(reg,(...args)=>{
  console.log(args) //["2019-08-12", "2019", "08", "12", 0, "2019-08-12", {year: "2019", month: "08", day: "12"}]
  let { year, month, day } = args.slice(-1)[0]
  return month + '/' + day + '/' + year
})  // 08/12/2019
```

**[笔记首页](http://localhost:3000/#/)**