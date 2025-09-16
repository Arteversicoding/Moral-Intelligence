import { MaterialsService } from './materials-service.js';
import { supabase } from './supabase-config.js';

export class MaterialsDisplay {
    static init() {
        try {
            // Initialize elements with null checks
            this.elements = {
                loading: document.getElementById('loading-state'),
                emptyState: document.getElementById('empty-state'),
                featuredContainer: document.getElementById('featured-container'),
                featuredList: document.getElementById('featured-materials'),
                materialsContainer: document.getElementById('materials-container'),
                materialsList: document.getElementById('materials-list'),
                materialsCount: document.getElementById('materials-count'),
                searchInput: document.getElementById('search-input'),
                filterButtons: document.querySelectorAll('.filter-btn'),
                refreshBtn: document.getElementById('refresh-btn')
            };
            
            // Verify required elements exist
            const requiredElements = ['materialsList', 'featuredList'];
            for (const elem of requiredElements) {
                if (!this.elements[elem]) {
                    console.error(`Required element not found: ${elem}`);
                    return;
                }
            }
            
            this.materials = [];
            this.featuredMaterials = [];
            this.currentFilter = 'all';
            this.searchQuery = '';
            
            this.setupEventListeners();
            this.loadMaterials();
        } catch (error) {
            console.error('Error initializing MaterialsDisplay:', error);
            alert('Gagal memuat halaman. Silakan refresh halaman.');
        }
    }

    static setupEventListeners() {
        // Search input
        this.elements.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterAndDisplayMaterials();
        });

        // Filter buttons
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setActiveFilter(btn.dataset.category));
        });

        // Refresh button
        this.elements.refreshBtn.addEventListener('click', () => this.loadMaterials());
    }

    static async loadMaterials() {
        try {
            this.showLoading(true);
            
            // Use the MaterialsService to fetch materials
            const materials = await MaterialsService.getMaterials();
            
            if (!materials) {
                throw new Error('Gagal memuat materi');
            }

            this.materials = Array.isArray(materials) ? materials : [];
            this.featuredMaterials = this.materials.filter(material => material.is_featured);
            
            if (this.elements.emptyState) {
                this.elements.emptyState.classList.toggle('hidden', this.materials.length > 0);
            }
            
            if (this.materials.length > 0) {
                this.filterAndDisplayMaterials();
            } else if (this.elements.materialsList) {
                this.elements.materialsList.innerHTML = '';
            }
            
            this.updateMaterialsCount(this.materials.length);
            
        } catch (error) {
            console.error('Error loading materials:', error);
            if (this.elements.emptyState) {
                this.elements.emptyState.classList.remove('hidden');
                this.elements.emptyState.innerHTML = `
                    <div class="text-center py-8">
                        <div class="text-red-500 text-4xl mb-2">⚠️</div>
                        <h3 class="text-lg font-medium text-gray-900">Gagal memuat materi</h3>
                        <p class="text-gray-500 mt-1">${error.message || 'Terjadi kesalahan'}</p>
                        <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Muat Ulang Halaman
                        </button>
                    </div>
                `;
            }
        } finally {
            this.showLoading(false);
        }
    }

    static filterAndDisplayMaterials() {
        // Filter materials based on search query and active filter
        const filtered = this.materials.filter(material => {
            const matchesSearch = material.title.toLowerCase().includes(this.searchQuery) ||
                               material.description.toLowerCase().includes(this.searchQuery);
            
            let matchesFilter = true;
            if (this.currentFilter !== 'all') {
                matchesFilter = material.type === this.currentFilter;
            }
            
            return matchesSearch && matchesFilter;
        });

        // Update UI
        this.displayMaterials(filtered);
        this.updateFeaturedMaterials();
        this.updateMaterialsCount(filtered.length);
        
        // Show/hide empty state with null checks
        if (this.elements.emptyState) {
            this.elements.emptyState.classList.toggle('hidden', filtered.length > 0 || this.materials.length > 0);
        }
        
        if (this.elements.materialsContainer) {
            this.elements.materialsContainer.classList.toggle('hidden', this.materials.length === 0);
        }
        
        if (this.elements.featuredContainer) {
            this.elements.featuredContainer.classList.toggle('hidden', this.featuredMaterials.length === 0);
        }
    }

    static updateFeaturedMaterials() {
        if (!this.elements.featuredContainer || !this.elements.featuredList) {
            console.warn('Featured container or list elements not found');
            return;
        }

        if (this.featuredMaterials.length === 0) {
            this.elements.featuredContainer.classList.add('hidden');
            return;
        }

        this.elements.featuredContainer.classList.remove('hidden');
        this.elements.featuredList.innerHTML = this.featuredMaterials
            .slice(0, 3) // Show max 3 featured materials
            .map(material => this.createMaterialCard(material, true))
            .join('');
    }

    static displayMaterials(materials) {
        if (materials.length === 0) {
            this.elements.materialsList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <p>Tidak ada materi yang ditemukan.</p>
                </div>
            `;
            return;
        }

        this.elements.materialsList.innerHTML = materials
            .map(material => this.createMaterialCard(material))
            .join('');
    }

    static createMaterialCard(material, isFeatured = false) {
        const icon = this.getMaterialIcon(material.type);
        const timeAgo = this.formatTimeAgo(material.created_at);
        
        return `
            <div class="material-card bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow ${isFeatured ? 'border-l-4 border-indigo-500' : ''}">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 ${this.getMaterialColor(material.type)} rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <i class="${icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-800 mb-1 truncate">${material.title}</h4>
                        <p class="text-gray-600 text-sm mb-2 line-clamp-2">${material.description || 'Tidak ada deskripsi'}</p>
                        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span>📅 ${timeAgo}</span>
                            ${material.duration ? `<span>⏱️ ${material.duration} min</span>` : ''}
                            ${material.level ? `<span>📊 ${material.level}</span>` : ''}
                        </div>
                    </div>
                    ${isFeatured ? '<span class="text-yellow-500 text-sm font-medium">⭐</span>' : ''}
                </div>
                ${this.getMaterialAction(material)}
            </div>
        `;
    }

    static getMaterialIcon(type) {
        const icons = {
            'pdf': 'far fa-file-pdf',
            'video': 'fas fa-video',
            'link': 'fas fa-link',
            'document': 'far fa-file-alt',
            'presentation': 'far fa-file-powerpoint',
            'spreadsheet': 'far fa-file-excel'
        };
        return icons[type] || 'far fa-file';
    }

    static getMaterialColor(type) {
        const colors = {
            'pdf': 'bg-gradient-to-r from-red-400 to-pink-500',
            'video': 'bg-gradient-to-r from-blue-400 to-cyan-500',
            'link': 'bg-gradient-to-r from-indigo-400 to-purple-500',
            'document': 'bg-gradient-to-r from-green-400 to-emerald-500',
            'presentation': 'bg-gradient-to-r from-orange-400 to-red-500',
            'spreadsheet': 'bg-gradient-to-r from-green-500 to-lime-500'
        };
        return colors[type] || 'bg-gradient-to-r from-gray-400 to-gray-600';
    }

    static getMaterialAction(material) {
        if (material.type === 'link') {
            return `
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <a href="${material.file_path}" target="_blank" 
                       class="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                        Kunjungi Link <i class="fas fa-external-link-alt ml-1 text-xs"></i>
                    </a>
                </div>
            `;
        }

        return `
            <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span class="text-xs text-gray-500">${this.formatFileSize(material.file_size)}</span>
                <a href="${this.getFileUrl(material.file_path)}" 
                   class="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                   download>
                    <i class="fas fa-download mr-1"></i> Unduh
                </a>
            </div>
        `;
    }

    static getFileUrl(path) {
        if (!path) return '#';
        if (path.startsWith('http')) return path;
        return supabase.storage.from(MaterialsService.BUCKET_NAME).getPublicUrl(path).data.publicUrl;
    }

    static formatFileSize(bytes) {
        if (!bytes) return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = parseFloat(bytes);
        let unit = 0;
        while (size >= 1024 && unit < units.length - 1) {
            size /= 1024;
            unit++;
        }
        return `${size.toFixed(1)} ${units[unit]}`;
    }

    static formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        const intervals = {
            tahun: 31536000,
            bulan: 2592000,
            minggu: 604800,
            hari: 86400,
            jam: 3600,
            menit: 60,
            detik: 1
        };
        
        for (const [unit, seconds] of Object.entries(intervals)) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                return `${interval} ${unit} yang lalu`;
            }
        }
        
        return 'Baru saja';
    }

    static setActiveFilter(filter) {
        this.currentFilter = filter;
        this.elements.filterButtons.forEach(btn => {
            const isActive = btn.dataset.category === filter;
            btn.classList.toggle('bg-indigo-100', isActive);
            btn.classList.toggle('text-indigo-800', isActive);
            btn.classList.toggle('bg-gray-100', !isActive);
            btn.classList.toggle('text-gray-700', !isActive);
        });
        this.filterAndDisplayMaterials();
    }

    static updateMaterialsCount(count) {
        this.elements.materialsCount.textContent = count;
    }

    static showLoading(show) {
        // Safely toggle loading state
        if (this.elements.loading) {
            this.elements.loading.classList.toggle('hidden', !show);
        }
        
        // Hide other containers when loading
        if (show) {
            if (this.elements.materialsContainer) {
                this.elements.materialsContainer.classList.add('hidden');
            }
            if (this.elements.emptyState) {
                this.elements.emptyState.classList.add('hidden');
            }
        }
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    MaterialsDisplay.init();
});
