import { createApp } from 'vue';

createApp({
	template: `<div class="mdui-card" v-for="contributor in contributors" :key="contributor.id" class="___contributor_card">
		<div class="mdui-card-media">
			<img class="___avatar" :src="contributor.avatar_url" alt="Avatar" />
			<div class="mdui-card-media-covered">
				<div class="mdui-card-primary">
					<div class="mdui-card-primary-title">{{ contributor.name }}</div>
					<div v-if="contributor.name_eng" class="mdui-card-primary-subtitle">{{ contributor.name_eng }}</div>
					<div class="mdui-card-content" v-html="contributor.content"></div>
				</div>
		</div>
		<div class="mdui-card-actions">
			<a v-if="contributor.homepage_url" :href="contributor.homepage_url" target="_blank" class="mdui-btn mdui-btn-icon"><ion-icon name="home-outline" class="mdui-icon"></ion-icon></a>
			<a v-if="contributor.github_url" :href="contributor.github_url" target="_blank" class="mdui-btn mdui-btn-icon"><ion-icon name="logo-github" class="mdui-icon"></ion-icon></a>
			<a v-if="contributor.bilibili_url" :href="contributor.bilibili_url" target="_blank" class="mdui-btn mdui-btn-icon"><img class="mdui-icon" src="https://static.hdslb.com/images/favicon.ico" alt="Bilibili" /></a>
		</div>
	</div>`,
	data() {
		return {
			contributors: [
				{
					id: 1,
					name: '洛狐',
					name_eng: 'XiaoluoFoxington',
					avatar_url: '/file/avatar/XiaoluoFoxington.png',
					content: `<ul><li>网站编写</li><li>提供直链</li><li>提供下载链接</li></ul><br>`,
					github_url: 'https://github.com/XiaoluoFoxington',
					bilibili_url: 'https://space.bilibili.com/1561166904'
				},
				{
					id: 2,
					name: '柠枺',
					name_eng: 'Lemonwood',
					avatar_url: '/file/avatar/ning-g-mo.jpg',
					content: `<ul><li>提供foldcraftlauncher.cn域名</li><li>提供意见</li><li>提供资金支持</li></ul><br>`,
					github_url: 'https://github.com/ning-g-mo',
					bilibili_url: 'https://space.bilibili.com/3537106787896067'
				},
				{
					id: 3,
					name: '晚梦',
					name_eng: 'LateDream',
					avatar_url: '/file/avatar/LateDream.webp',
					content: `<ul><li>提供代码贡献</li><li>提供意见</li></ul><br>`,
					github_url: 'https://github.com/LateDreamXD',
					bilibili_url: 'https://space.bilibili.com/1988506301',
					homepage_url: 'https://about.latedream.cn/'
				},
				{
					id: 4,
					name: '梦泽',
					avatar_url: 'https://mzurl.xyz/b4efsr',
					content: `<ul><li>提供CDN加速</li><li>提供意见</li></ul><br>`,
					github_url: 'https://github.com/YShenZe',
					bilibili_url: false
				}
			]
		}
	}
}).mount('#contributors');