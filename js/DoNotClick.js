export default [
  {
    name: '0#页面旋转动画',
    warning: true,
    run() {
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
    name: '1#Y轴翻转效果',
    run() {
      document.body.style.cssText = 'transform: rotateY(180deg); transition: transform 0.6s;';
    }
  },
  {
    name: '2#X轴翻转效果',
    run() {
      document.body.style.cssText = 'transform: rotateX(180deg); transition: transform 0.6s;';
    }
  },
  {
    name: '3#随机字体大小',
    run() {
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
    name: '4#随机背景闪烁',
    warning: true,
    run() {
      setInterval(() => {
        document.body.style.backgroundColor =
          `#${Math.floor(Math.random()*16777215).toString(16)}`;
      }, 300);
    }
  },
  {
    name: '5#元素抖动效果',
    warning: true,
    run() {
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
    name: '6#颜色反转滤镜',
    run() {
      document.body.style.filter = 'invert(1)';
    }
  },
  {
    name: '7#随机缩放效果',
    run() {
      setInterval(() => {
        document.body.style.transform =
          `scale(${Math.random() * 2 + 0.5})`;
      }, 1000);
    }
  },
  {
    name: '8#3D文字阴影',
    warning: true,
    run() {
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
    name: '9#随机模糊效果',
    run() {
      document.body.style.filter = 'blur(5px)';
      document.body.style.transition = 'filter 0.3s';
      setInterval(() => {
        document.body.style.filter = `blur(${Math.random() * 10}px)`;
      }, 500);
    }
  },
  {
    name: '10#彩虹文字动画',
    warning: true,
    run() {
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
    name: '11#元素漂浮效果',
    run() {
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
    name: '12#钢管落地',
    run() {
      const audio = new Audio('./file/sound/钢管落地.mp3');
      audio.volume = 1.0;
      audio.play().catch(e => {
        console.error("千万别点：钢管落地：自动播放被阻止：", e);
      });
      
      if (!audio.paused) {
        audio.remove();
      }
    }
  },
  {
    name: '13#代码雨',
    warning: true,
    run() {
      const chars = '01';
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      document.body.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      const fontSize = 16;
      const columns = canvas.width / fontSize;
      const drops = [];
      
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
      
      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      
      setInterval(draw, 33);
    }
  },
  {
    name: '14#你屏幕上有根毛',
    run() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const hairId = "hair-" + Math.random().toString(36).substr(2, 5);
      
      const length = 250 + Math.random() * 150;
      const startX = Math.random() * (window.innerWidth - length * 0.8);
      const startY = Math.random() * (window.innerHeight * 0.8);
      const color = `#402010`;
      
      // 生成3个随机控制点创建自然曲线
      const points = [];
      for (let i = 0; i < 3; i++) {
        points.push({
          x: i * (length / 2),
          y: (Math.random() - 0.5) * 30
        });
      }
      
      // 构建二次贝塞尔曲线路径
      const pathData = `M0,0 Q${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
      
      svg.innerHTML = `
      <path 
        d="${pathData}" 
        stroke="${color}" 
        stroke-width="${0.8 + Math.random() * 0.7}" 
        fill="none"
        stroke-linecap="round"
      />
    `;
      
      svg.setAttribute("style", `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${length}px;
      height: 40px;
      overflow: visible;
      pointer-events: none;
      z-index: 9999;
      transform: rotate(${Math.random() * 360}deg);
      opacity: ${0.8 + Math.random() * 0.2};
    `);
      
      document.body.appendChild(svg);
    }
  },
  {
    name: '15#中文乱码',
    run() {
      document.body.innerHTML = document.body.innerHTML.replace(/[\u4e00-\u9fa5]/g, function(c) {
        return String.fromCharCode(c.charCodeAt(0) ^ 0xA5);
      });
    }
  },
  
];