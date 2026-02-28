// AR眼镜应用下载中心 - JavaScript交互逻辑

(function() {
    'use strict';

    // 全局变量
    let appsData = [];
    let currentFilter = 'all';
    let searchQuery = '';

    // DOM元素
    const appsGrid = document.getElementById('appsGrid');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const filterChips = document.getElementById('filterChips');
    const noResults = document.getElementById('noResults');
    const appCount = document.getElementById('appCount');
    const brandCount = document.getElementById('brandCount');
    const clearFiltersBtn = document.getElementById('clearFilters');

    // 初始化
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        try {
            await loadAppsData();
            renderBrandFilters();
            renderApps();
            setupEventListeners();
        } catch (error) {
            console.error('初始化失败:', error);
            showError();
        }
    }

    // 加载应用数据
    async function loadAppsData() {
        const response = await fetch('data/apps.json');
        if (!response.ok) {
            throw new Error('无法加载应用数据');
        }
        appsData = await response.json();
        
        // 统计品牌数量
        const uniqueBrands = [...new Set(appsData.map(app => app.brand))];
        brandCount.textContent = uniqueBrands.length;
    }

    // 渲染品牌筛选标签
    function renderBrandFilters() {
        const brands = ['all', ...new Set(appsData.map(app => app.brand))];
        
        brands.forEach((brand, index) => {
            if (index === 0) return; // 跳过 'all'
            
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.dataset.brand = brand;
            chip.textContent = brand;
            filterChips.appendChild(chip);
        });
    }

    // 渲染应用卡片
    function renderApps() {
        const filteredApps = filterApps();
        
        // 更新统计
        appCount.textContent = filteredApps.length;
        
        // 清空网格
        appsGrid.innerHTML = '';
        
        // 显示/隐藏无结果状态
        if (filteredApps.length === 0) {
            noResults.style.display = 'block';
            appsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            appsGrid.style.display = 'grid';
            
            // 渲染卡片
            filteredApps.forEach((app, index) => {
                const card = createAppCard(app, index);
                appsGrid.appendChild(card);
            });
        }
    }

    // 筛选应用
    function filterApps() {
        return appsData.filter(app => {
            const matchesBrand = currentFilter === 'all' || app.brand === currentFilter;
            const matchesSearch = !searchQuery || 
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            
            return matchesBrand && matchesSearch;
        });
    }

    // 创建应用卡片
    function createAppCard(app, index) {
        const card = document.createElement('article');
        card.className = 'app-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        // 获取来源图标
        const sourceIcon = getSourceIcon(app.source);
        
        // 生成标签
        const tagsHtml = app.tags.map(tag => {
            const isOfficial = tag === '官方应用';
            const isGitHub = tag === 'GitHub' || app.source === 'GitHub';
            return `<span class="tag ${isOfficial ? 'official' : ''} ${isGitHub ? 'github' : ''}">${tag}</span>`;
        }).join('');
        
        // 网盘备用按钮
        const panButton = app.panUrl ? `
            <a href="${app.panUrl}" target="_blank" rel="noopener noreferrer" class="pan-btn" title="夸克网盘备用下载">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                网盘
            </a>
        ` : '';
        
        // 更新日期
        const updateDate = app.updateDate ? `<span class="update-date">更新: ${app.updateDate}</span>` : '';
        
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <span class="card-brand">${app.brand}</span>
                    <h3 class="card-title">${app.name}</h3>
                    <span class="card-version">${app.version}</span>
                </div>
            </div>
            <p class="card-description">${app.description}</p>
            <div class="card-tags">${tagsHtml}</div>
            <div class="card-footer">
                <div class="source-info">
                    <div class="source-badge">
                        ${sourceIcon}
                        <span>${app.source}</span>
                    </div>
                    ${updateDate}
                </div>
                <div class="download-actions">
                    ${panButton}
                    <a href="${app.downloadUrl}" target="_blank" rel="noopener noreferrer" class="download-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        下载
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    // 获取来源图标
    function getSourceIcon(source) {
        const icons = {
            'GitHub': `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>`,
            '官网': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>`,
            'APKPure': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>`
        };
        
        return icons[source] || icons['官网'];
    }

    // 设置事件监听
    function setupEventListeners() {
        // 搜索输入
        searchInput.addEventListener('input', handleSearch);
        
        // 清除搜索
        clearSearchBtn.addEventListener('click', clearSearch);
        
        // 品牌筛选
        filterChips.addEventListener('click', handleFilterClick);
        
        // 清除筛选
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // 处理搜索
    function handleSearch(e) {
        searchQuery = e.target.value.trim();
        
        // 显示/隐藏清除按钮
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
        
        // 重新渲染
        renderApps();
    }

    // 清除搜索
    function clearSearch() {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderApps();
    }

    // 处理筛选点击
    function handleFilterClick(e) {
        if (e.target.classList.contains('chip')) {
            // 移除所有活动状态
            document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
            
            // 添加活动状态
            e.target.classList.add('active');
            
            // 更新筛选
            currentFilter = e.target.dataset.brand;
            renderApps();
        }
    }

    // 清除所有筛选
    function clearAllFilters() {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        
        document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
        document.querySelector('.chip[data-brand="all"]').classList.add('active');
        
        currentFilter = 'all';
        renderApps();
    }

    // 显示错误
    function showError() {
        appsGrid.innerHTML = `
            <div class="no-results" style="display: block; grid-column: 1 / -1;">
                <svg viewBox="0 0 120 120" fill="none" class="no-results-icon">
                    <circle cx="60" cy="60" r="50" stroke="#ef4444" stroke-width="2"/>
                    <path d="M40 40h40v40H40z" stroke="#ef4444" stroke-width="2"/>
                    <path d="M50 70h20M60 55v15" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3 class="no-results-title">加载失败</h3>
                <p class="no-results-text">请刷新页面或检查网络连接</p>
            </div>
        `;
    }
})();