export default [
  {
    name: '页面旋转动画',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 6s linear infinite;
        }`;
      document.head.appendChild(style);
      document.body.classList.add('spin');
    }
  },
  {
    name: 'Y轴翻转效果',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      document.body.style.cssText = 'transform: rotateY(180deg); transition: transform 0.6s;';
    }
  },
  {
    name: 'X轴翻转效果',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      document.body.style.cssText = 'transform: rotateX(180deg); transition: transform 0.6s;';
    }
  },
  {
    name: '随机字体大小',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      const style = document.createElement('style');
      style.innerHTML = '.random-size {font-size: var(--random-size, 16px);}';
      document.head.appendChild(style);
      
      function randomSize() { return Math.floor(Math.random() * 50) + 10 }
      
      for (const el of document.querySelectorAll('*')) {
        el.classList.add('random-size');
        el.style.setProperty('--random-size', `${randomSize()}px`);
      }
    }
  },
  {
    name: '随机背景闪烁',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      setInterval(() => {
        document.body.style.backgroundColor =
          `#${Math.floor(Math.random()*16777215).toString(16)}`;
      }, 300);
    }
  },
  {
    name: '元素抖动效果',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes shake {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .element-shake { animation: shake 0.3s infinite; }`;
      document.head.appendChild(style);
      document.querySelectorAll('*').forEach(el => el.classList.add('element-shake'));
    }
  },
  {
    name: '颜色反转滤镜',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      document.body.style.filter = 'invert(1)';
    }
  },
  {
    name: '随机缩放效果',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      setInterval(() => {
        document.body.style.transform =
          `scale(${Math.random() * 2 + 0.5})`;
      }, 1000);
    }
  },
  {
    name: '3D文字阴影',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      const style = document.createElement('style');
      style.innerHTML = `
        .text-shadow {
          text-shadow: 2px 2px 0 cyan, 
                      -2px -2px 0 magenta;
        }`;
      document.head.appendChild(style);
      document.querySelectorAll('*').forEach(el => el.classList.add('text-shadow'));
    }
  },
  {
    name: '随机模糊效果',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      document.body.style.filter = 'blur(5px)';
      document.body.style.transition = 'filter 0.3s';
      setInterval(() => {
        document.body.style.filter = `blur(${Math.random() * 10}px)`;
      }, 500);
    }
  },
  {
    name: '彩虹文字动画',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes rainbow {
          0% { color: red; }
          20% { color: orange; }
          40% { color: yellow; }
          60% { color: green; }
          80% { color: blue; }
          100% { color: purple; }
        }
        .rainbow-text {
          animation: rainbow 1s infinite;
        }`;
      document.head.appendChild(style);
      document.querySelectorAll('*').forEach(el => el.classList.add('rainbow-text'));
    }
  },
  {
    name: '元素漂浮效果',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random()*20-10}px, ${Math.random()*20-10}px); }
          100% { transform: translate(0, 0); }
        }
        .floating-element {
          animation: float 2s ease-in-out infinite;
        }`;
      document.head.appendChild(style);
      document.querySelectorAll('*').forEach(el => el.classList.add('floating-element'));
    }
  },
  {
    name: '禁用鼠标事件',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      document.body.style.pointerEvents = 'none';
    }
  },
  {
    name: '随机键盘干扰',
    run() {
      console.log(`千万别点：${this.name}`);
      mdui.snackbar({
        message: `千万别点：${this.name}`,
        position: 'right-bottom',
      });

      document.addEventListener('keydown', (e) => {
        if (Math.random() > 0.5) {
          e.preventDefault();
          document.body.innerHTML += String.fromCharCode(65 + Math.floor(Math.random() * 58));
        }
      });
    }
  }
];