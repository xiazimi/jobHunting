{
  /*
  我们知道打印函数时会自动调用 toString()方法，函数 add(a) 返回一个闭包 sum(b)，函数 sum() 中累加计算 a = a + b，只需要重写sum.toString()方法返回变量 a 就可以了。
*/
  let add = function(a) {
    function sum(b) {
      a = a + b;
      return sum;
    }
    sum.toString = function() {
      return a;
    };
    return sum;
  };
}
{
  // 数组扁平化去重排序
  let flatAndQuChong = function(arr) {
    while (arr.some(ele => Array.isArray(ele))) {
      arr = [].concat(...arr);
    }
    arr.sort(function(a, b) {
      return a - b;
    });
    return Array.from(new Set(arr));
  };
}
{
  // 函数科里化
  let currying = function(fn, length) {
    length = length || fn.length; // 第一次调用获取函数 fn 参数的长度，后续调用获取 fn 剩余参数的长度
    return function(...args) {
      // currying 包裹之后返回一个新函数，接收参数为 ...args
      return args.length >= length // 新函数接收的参数长度是否大于等于 fn 剩余参数需要接收的长度
        ? fn.apply(this, args) // 满足要求，执行 fn 函数，传入新函数的参数
        : currying(fn.bind(this, ...args), length - args.length); //不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数（bind 绑定了 ...args 参数，未执行），新的 length 为 fn 剩余参数的长度
    };
  };

  const fn = currying(function(a, b, c) {
    console.log([a, b, c]);
  });

  // fn("a", "b", "c"); // ["a", "b", "c"]
  // fn("a", "b")("c"); // ["a", "b", "c"]
  // fn("a")("b")("c"); // ["a", "b", "c"]
  // fn("a")("b", "c"); // ["a", "b", "c"]
}
{
  // map原生实现
  Array.prototype.map = function(callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    // Step 1. 转成数组对象，有 length 属性和 K-V 键值对
    let O = Object(this);
    // Step 2. 无符号右移 0 位，左侧用 0 填充，结果非负
    let len = O.length >>> 0;
    // Step 3. callbackfn 不是函数时抛出异常
    if (typeof callbackfn !== "function") {
      throw new TypeError(callbackfn + " is not a function");
    }
    // Step 4.
    let T = thisArg;
    // Step 5.
    let A = new Array(len);
    // Step 6.
    let k = 0;
    // Step 7.
    while (k < len) {
      // Step 7.1、7.2、7.3
      // 检查 O 及其原型链是否包含属性 k
      if (k in O) {
        // Step 7.3.1
        let kValue = O[k];
        // Step 7.3.2 执行 callbackfn 函数
        // 传入 this, 当前元素 element, 索引 index, 原数组对象 O
        let mappedValue = callbackfn.call(T, kValue, k, O);
        // Step 7.3.3 返回结果赋值给新生成数组
        A[k] = mappedValue;
      }
      // Step 7.4
      k++;
    }
    // Step 8. 返回新数组
    return A;
  };
}
{
  // filter函数原生实现
  Array.prototype.filter = function(callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== "function") {
      throw new TypeError(callbackfn + " is not a function");
    }

    let O = Object(this),
      len = O.length >>> 0,
      T = thisArg,
      A = new Array(len),
      k = 0;
    // 新增，返回数组的索引
    let to = 0;

    while (k < len) {
      if (k in O) {
        let kValue = O[k];
        // 新增
        if (callbackfn.call(T, kValue, k, O)) {
          A[to++] = kValue;
        }
      }
      k++;
    }

    // 新增，修改 length，初始值为 len
    A.length = to;
    return A;
  };
}
{
  // reduce原生实现
  Array.prototype.reduce = function(callbackfn, initialValue) {
    // 异常处理
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== "function") {
      throw new TypeError(callbackfn + " is not a function");
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let k = 0,
      accumulator;

    // 新增
    if (initialValue) {
      accumulator = initialValue;
    } else {
      // Step 4.
      if (len === 0) {
        throw new TypeError("Reduce of empty array with no initial value");
      }
      // Step 8.
      let kPresent = false;
      while (!kPresent && k < len) {
        kPresent = k in O;
        if (kPresent) {
          accumulator = O[k];
        }
        k++;
      }
    }

    while (k < len) {
      if (k in O) {
        let kValue = O[k];
        accumulator = callbackfn.call(undefined, accumulator, kValue, k, O);
      }
      k++;
    }
    return accumulator;
  };
}
{
  // 节流函数原生实现
  const throttle = (fn, wait = 50) => {
    // 上一次执行 fn 的时间
    let previous = 0;
    // 将 throttle 处理结果当作函数返回
    return function(...args) {
      // 获取当前时间，转换成时间戳，单位毫秒
      let now = +new Date();
      // 将当前时间和上一次执行函数的时间进行对比
      // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
      if (now - previous > wait) {
        previous = now;
        fn.apply(this, args);
      }
    };
  };
}
{
/*
new 操作符具体干了什么呢？如何实现？
  （1）首先创建了一个新的空对象
 （2）设置原型，将对象的原型设置为函数的 prototype 对象。
 （3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
 （4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。
 
 实现:

*/

function objectFactory() {

  let newObject = null,
    constructor = Array.prototype.shift.call(arguments),
    result = null;
  
  // 参数判断
  if (typeof constructor !== "function") {
    console.error("type error");
    return;
  };

  // 新建一个空对象，对象的原型为构造函数的 prototype 对象
  newObject = Object.create(constructor.prototype);

  // 将 this 指向新建对象，并执行函数
  result = constructor.apply(newObject, arguments);
  
  // 判断返回对象
  let flag = result && (typeof result === "object" || typeof result === "function");

  // 判断返回结果
  return flag ? result : newObject;
}

// 使用方法
// objectFactory(构造函数,初始化参数)
}
