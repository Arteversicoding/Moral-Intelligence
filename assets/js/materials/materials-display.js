// Supabase integration disabled - using local data
// import { supabase } from '../../../config/supabase.js';

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
            const requiredElements = ['materialsList'];
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
            this.showError('Gagal memuat halaman. Silakan refresh halaman.');
        }
    }

    static setupEventListeners() {
        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterAndRenderMaterials();
            });
        }

        // Filter buttons
        this.elements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.filterButtons.forEach(btn => {
                    btn.classList.remove('bg-indigo-100', 'text-indigo-700');
                    btn.classList.add('text-gray-600', 'hover:bg-gray-100');
                });
                
                button.classList.remove('text-gray-600', 'hover:bg-gray-100');
                button.classList.add('bg-indigo-100', 'text-indigo-700');
                
                this.currentFilter = button.dataset.filter;
                this.filterAndRenderMaterials();
            });
        });
    }

    static async loadMaterials() {
        try {
            this.showLoading(true);
            
            // Load materials from Supabase
            const { data, error } = await supabase
                .storage
                .from('Mobile-Intelligence')
                .list('materi', { limit: 100 });

            if (error) throw error;

            // Filter out any invalid files and map to material objects
            this.materials = data
                .filter(file => file.name && file.name !== '.emptyFolderPlaceholder')
                .map(file => ({
                    id: file.id,
                    name: file.name,
                    type: this.getFileType(file.name),
                    size: file.metadata?.size || 0,
                    lastModified: file.metadata?.lastModified || new Date().toISOString(),
                    url: this.getFileUrl(file.name)
                }));
                
            console.log('Loaded materials:', this.materials);

            this.filterAndRenderMaterials();
            this.updateMaterialsCount();
            
        } catch (error) {
            console.error('Error loading materials:', error);
            this.showError('Gagal memuat daftar materi. Silakan coba lagi.');
        } finally {
            this.showLoading(false);
        }
    }

    static getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const types = {
            pdf: ['pdf'],
            document: ['doc', 'docx', 'txt', 'rtf'],
            video: ['mp4', 'mov', 'avi', 'mkv'],
            image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            archive: ['zip', 'rar', '7z']
        };

        for (const [type, exts] of Object.entries(types)) {
            if (exts.includes(extension)) return type;
        }
        
        return 'other';
    }

    static getFileUrl(filename) {
        // Gunakan format URL langsung yang konsisten
        const baseUrl = 'https://leqtvucfgxwukfgsvnei.supabase.co/storage/v1/object/public';
        const bucketName = 'Mobile-Intelligence';
        const folder = 'materi';
        
        // Encode nama file untuk URL yang aman
        const encodedFilename = encodeURIComponent(filename);
        
        return `${baseUrl}/${bucketName}/${folder}/${encodedFilename}`;
    }

    static filterAndRenderMaterials() {
        let filtered = [...this.materials];

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(material => 
                material.name.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply type filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(material => 
                material.type === this.currentFilter
            );
        }

        this.renderMaterials(filtered);
    }

    static renderMaterials(materials) {
        if (!materials || !materials.length) {
            this.elements.emptyState?.classList.remove('hidden');
            this.elements.materialsContainer?.classList.add('hidden');
            return;
        }

        this.elements.emptyState?.classList.add('hidden');
        this.elements.materialsContainer?.classList.remove('hidden');

        const html = materials
            .filter(material => material.name !== '.emptyFolderPlaceholder')
            .map(material => {
                const fileUrl = this.getFileUrl(material.name);
                
                return `
                <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div class="p-6">
                        <div class="flex items-center space-x-4 mb-4">
                            <div class="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                                ${this.getFileIcon(material.type)}
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3 class="text-base font-medium text-gray-900 truncate">${material.name}</h3>
                                <p class="text-sm text-gray-500">${this.formatFileSize(material.size)} • ${this.formatDate(material.lastModified)}</p>
                            </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <a href="${fileUrl}" 
                               download="${material.name}" 
                               class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Unduh
                            </a>
                            <a href="${fileUrl}" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Buka
                            </a>
                        </div>
                    </div>
                </div>`;
            })
            .join('');

        this.elements.materialsList.innerHTML = html;
        this.updateMaterialsCount(materials.length);
    }

    static getFileIcon(type) {
        const icons = {
            pdf: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>`,
            document: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>`,
            video: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>`,
            image: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>`,
            default: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>`
        };

        return icons[type] || icons.default;
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    static updateMaterialsCount(count) {
        if (!this.elements.materialsCount) return;
        
        const total = count ?? this.materials.length;
        this.elements.materialsCount.textContent = 
            `${total} ${total === 1 ? 'materi' : 'materi'}`;
    }

    static showLoading(show) {
        if (show) {
            this.elements.loading?.classList.remove('hidden');
            this.elements.materialsContainer?.classList.add('hidden');
            this.elements.emptyState?.classList.add('hidden');
        } else {
            this.elements.loading?.classList.add('hidden');
            this.elements.materialsContainer?.classList.remove('hidden');
        }
    }

    static showError(message) {
        console.error(message);
        // You can implement a more user-friendly error display here
        alert(message);
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    MaterialsDisplay.init();
});
