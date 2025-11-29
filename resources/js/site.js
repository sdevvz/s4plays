// This is all you.
/**
 * AppVault - Main JavaScript
 * Consolidated from all templates and components
 */

/* ========================================
   Import CSS
   ======================================== */
   import '../css/site.css';

   /* ========================================
      Global Configuration
      ======================================== */
   const AppVault = {
       config: {
           notificationInterval: { min: 10000, max: 20000 }, // 10-20 seconds
           modalTransitionDelay: { step1: 1500, step2: 3500 },
           searchDebounceDelay: 300,
       },
       
       // User names for social proof notifications
       userNames: ['Alex99', 'SarahK', 'GamerX', 'ProDev', 'MikeT', 'Anna_B', 'DevMaster', 'TechSavvy'],
       
       // Store references to DOM elements
       elements: {},
       
       // Active timers
       timers: {},
   };
   
   /* ========================================
      Utility Functions
      ======================================== */
   
   /**
    * Debounce function to limit function calls
    */
   function debounce(func, wait) {
       let timeout;
       return function executedFunction(...args) {
           const later = () => {
               clearTimeout(timeout);
               func(...args);
           };
           clearTimeout(timeout);
           timeout = setTimeout(later, wait);
       };
   }
   
   /**
    * Get random item from array
    */
   function getRandomItem(array) {
       return array[Math.floor(Math.random() * array.length)];
   }
   
   /**
    * Get random number between min and max
    */
   function getRandomNumber(min, max) {
       return Math.floor(Math.random() * (max - min + 1) + min);
   }
   
   /**
    * Smooth scroll to element
    */
   function smoothScrollTo(elementId) {
       const element = document.querySelector(elementId);
       if (element) {
           element.scrollIntoView({ 
               behavior: 'smooth', 
               block: 'start' 
           });
       }
   }
   
   /* ========================================
      Mobile Menu Module
      ======================================== */
   const MobileMenu = {
       init() {
           const btn = document.getElementById('mobile-menu-btn');
           const menu = document.getElementById('mobile-menu');
   
           if (!btn || !menu) return;
   
           btn.addEventListener('click', () => {
               menu.classList.toggle('hidden');
               
               // Update aria attributes for accessibility
               const isExpanded = !menu.classList.contains('hidden');
               btn.setAttribute('aria-expanded', isExpanded);
               
               // Animate icon
               const icon = btn.querySelector('i');
               if (icon) {
                   icon.classList.toggle('fa-bars');
                   icon.classList.toggle('fa-xmark');
               }
           });
   
           // Close menu when clicking outside
           document.addEventListener('click', (e) => {
               if (!btn.contains(e.target) && !menu.contains(e.target)) {
                   menu.classList.add('hidden');
                   btn.setAttribute('aria-expanded', 'false');
               }
           });
   
           // Close menu on escape key
           document.addEventListener('keydown', (e) => {
               if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                   menu.classList.add('hidden');
                   btn.setAttribute('aria-expanded', 'false');
               }
           });
       }
   };
   
   /* ========================================
      App Search Module
      ======================================== */
   const AppSearch = {
       init() {
           const searchInput = document.getElementById('search-input') || 
                             document.getElementById('app-search');
           
           if (!searchInput) return;
   
           const debouncedSearch = debounce((term) => {
               this.performSearch(term);
           }, AppVault.config.searchDebounceDelay);
   
           searchInput.addEventListener('input', (e) => {
               debouncedSearch(e.target.value.toLowerCase());
           });
       },
   
       performSearch(term) {
           const cards = document.querySelectorAll('.glass-card');
           let visibleCount = 0;
   
           cards.forEach(card => {
               const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
               const description = card.querySelector('p')?.innerText.toLowerCase() || '';
               
               const matches = title.includes(term) || description.includes(term);
               
               card.style.display = matches ? 'block' : 'none';
               if (matches) visibleCount++;
           });
   
           // Update results count if element exists
           const resultsCount = document.getElementById('results-count');
           if (resultsCount) {
               resultsCount.textContent = visibleCount;
           }
   
           // Show/hide empty state
           this.toggleEmptyState(visibleCount === 0);
       },
   
       toggleEmptyState(show) {
           const emptyState = document.getElementById('empty-state');
           const appsGrid = document.getElementById('apps-grid') || document.getElementById('app-grid');
           
           if (emptyState) {
               emptyState.classList.toggle('hidden', !show);
           }
           if (appsGrid) {
               appsGrid.classList.toggle('hidden', show);
           }
       }
   };
   
   /* ========================================
      Category Filter Module
      ======================================== */
   const CategoryFilter = {
       currentCategory: 'all',
   
       init() {
           const filterBtns = document.querySelectorAll('.filter-btn, .category-filter');
           
           if (filterBtns.length === 0) return;
   
           filterBtns.forEach(btn => {
               btn.addEventListener('click', () => {
                   this.handleFilterClick(btn, filterBtns);
               });
           });
       },
   
       handleFilterClick(clickedBtn, allBtns) {
           // Update active state
           allBtns.forEach(btn => {
               btn.classList.remove('bg-orange-500', 'text-white', 'shadow-md', 'active');
               btn.classList.add('bg-white', 'text-gray-600');
           });
   
           clickedBtn.classList.remove('bg-white', 'text-gray-600');
           clickedBtn.classList.add('bg-orange-500', 'text-white', 'shadow-md', 'active');
   
           // Get filter value
           this.currentCategory = clickedBtn.getAttribute('data-filter') || 
                                  clickedBtn.getAttribute('data-category') || 
                                  'all';
   
           // Apply filter
           this.applyFilter();
       },
   
       applyFilter() {
           const cards = document.querySelectorAll('.glass-card');
           let visibleCount = 0;
   
           cards.forEach(card => {
               const category = card.getAttribute('data-category');
               const matches = this.currentCategory === 'all' || category === this.currentCategory;
               
               card.style.display = matches ? 'block' : 'none';
               if (matches) visibleCount++;
           });
   
           // Update results count
           const resultsCount = document.getElementById('results-count');
           if (resultsCount) {
               resultsCount.textContent = visibleCount;
           }
   
           // Show/hide empty state
           AppSearch.toggleEmptyState(visibleCount === 0);
       },
   
       reset() {
           this.currentCategory = 'all';
           const firstBtn = document.querySelector('.filter-btn, .category-filter');
           if (firstBtn) {
               const allBtns = document.querySelectorAll('.filter-btn, .category-filter');
               this.handleFilterClick(firstBtn, allBtns);
           }
       }
   };
   
   /* ========================================
      Sort Module
      ======================================== */
   const Sort = {
       init() {
           const sortSelect = document.getElementById('sort-select');
           if (!sortSelect) return;
   
           sortSelect.addEventListener('change', (e) => {
               this.sortApps(e.target.value);
           });
       },
   
       sortApps(sortType) {
           const grid = document.getElementById('apps-grid') || document.getElementById('app-grid');
           if (!grid) return;
   
           const cards = Array.from(grid.querySelectorAll('.glass-card'));
           
           cards.sort((a, b) => {
               switch(sortType) {
                   case 'name':
                       const nameA = a.querySelector('h3').textContent;
                       const nameB = b.querySelector('h3').textContent;
                       return nameA.localeCompare(nameB);
                   
                   case 'rating':
                       const ratingA = parseFloat(a.querySelector('.text-yellow-400').textContent.match(/[\d.]+/)?.[0] || 0);
                       const ratingB = parseFloat(b.querySelector('.text-yellow-400').textContent.match(/[\d.]+/)?.[0] || 0);
                       return ratingB - ratingA;
                   
                   case 'downloads':
                       const downloadsA = this.parseDownloads(a.querySelector('.text-gray-400').textContent);
                       const downloadsB = this.parseDownloads(b.querySelector('.text-gray-400').textContent);
                       return downloadsB - downloadsA;
                   
                   default:
                       return 0;
               }
           });
   
           // Re-append sorted cards
           cards.forEach(card => grid.appendChild(card));
       },
   
       parseDownloads(text) {
           const match = text.match(/([\d.]+)([KMB]?)/);
           if (!match) return 0;
           
           const num = parseFloat(match[1]);
           const multiplier = { K: 1000, M: 1000000, B: 1000000000 }[match[2]] || 1;
           
           return num * multiplier;
       }
   };
   
   /* ========================================
      Download Modal Module
      ======================================== */
   const DownloadModal = {
       modal: null,
       step1: null,
       step2: null,
       step3: null,
       modalTitle: null,
       progressBar: null,
   
       init() {
           this.modal = document.getElementById('download-modal');
           this.step1 = document.getElementById('step-1');
           this.step2 = document.getElementById('step-2');
           this.step3 = document.getElementById('step-3');
           this.modalTitle = document.getElementById('modal-app-title');
           this.progressBar = document.getElementById('progress-bar');
   
           if (!this.modal) return;
   
           // Make functions globally accessible
           window.openModal = (appName) => this.open(appName);
           window.closeModal = () => this.close();
           window.triggerOffer = () => this.triggerOffer();
   
           // Close on backdrop click
           this.modal.addEventListener('click', (e) => {
               if (e.target === this.modal) {
                   this.close();
               }
           });
   
           // Close on escape key
           document.addEventListener('keydown', (e) => {
               if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                   this.close();
               }
           });
       },
   
       open(appName) {
           if (!this.modal) return;
   
           this.modalTitle.innerText = `Installing: ${appName}`;
           this.modal.classList.remove('hidden');
           document.body.style.overflow = 'hidden'; // Prevent background scroll
   
           // Reset steps
           this.step1.classList.remove('hidden');
           this.step2.classList.add('hidden');
           this.step3.classList.add('hidden');
           this.progressBar.style.width = '0%';
           this.progressBar.classList.remove('progress-animate');
   
           // Simulate installation process
           setTimeout(() => {
               this.step1.classList.add('hidden');
               this.step2.classList.remove('hidden');
               this.progressBar.classList.add('progress-animate');
   
               setTimeout(() => {
                   this.step2.classList.add('hidden');
                   this.step3.classList.remove('hidden');
               }, AppVault.config.modalTransitionDelay.step2);
           }, AppVault.config.modalTransitionDelay.step1);
       },
   
       close() {
           if (!this.modal) return;
           
           this.modal.classList.add('hidden');
           document.body.style.overflow = ''; // Restore scroll
       },
   
       triggerOffer() {
           // Replace with actual CPA Locker integration
           console.log('CPA Locker triggered');
           alert('This is where your CPA Locker script would trigger (e.g., CPAGrip, OGAds).');
           
           // Example: Redirect to offer page
           // window.location.href = 'your-cpa-offer-url';
           
           // Example: Open in new window
           // window.open('your-cpa-offer-url', '_blank');
       }
   };
   
   /* ========================================
      Notification Toast Module
      ======================================== */
   const NotificationToast = {
       toast: null,
       userElement: null,
       appElement: null,
       appNames: [],
   
       init(appNames = []) {
           this.toast = document.getElementById('notification-toast');
           this.userElement = document.getElementById('notify-user');
           this.appElement = document.getElementById('notify-app');
   
           if (!this.toast) return;
   
           this.appNames = appNames.length > 0 ? appNames : [
               'Spotify Premium',
               'Netflix Unlocked',
               'Clash of Clans Mod',
               'VSCO Pro',
               'NordVPN Premium'
           ];
   
           // Start showing notifications
           this.scheduleNext();
       },
   
       show() {
           if (!this.toast) return;
   
           const randomUser = getRandomItem(AppVault.userNames);
           const randomApp = getRandomItem(this.appNames);
   
           this.userElement.innerText = randomUser;
           this.appElement.innerText = randomApp;
   
           this.toast.classList.remove('translate-y-full');
   
           setTimeout(() => {
               this.toast.classList.add('translate-y-full');
           }, 4000);
       },
   
       scheduleNext() {
           const delay = getRandomNumber(
               AppVault.config.notificationInterval.min,
               AppVault.config.notificationInterval.max
           );
   
           setTimeout(() => {
               this.show();
               this.scheduleNext();
           }, delay);
       }
   };
   
   /* ========================================
      Smooth Scroll Module
      ======================================== */
   const SmoothScroll = {
       init() {
           document.querySelectorAll('a[href^="#"]').forEach(anchor => {
               anchor.addEventListener('click', (e) => {
                   const href = anchor.getAttribute('href');
                   
                   // Ignore empty anchors
                   if (href === '#' || href === '#!') {
                       e.preventDefault();
                       return;
                   }
   
                   const target = document.querySelector(href);
                   if (target) {
                       e.preventDefault();
                       target.scrollIntoView({
                           behavior: 'smooth',
                           block: 'start'
                       });
   
                       // Update URL without scrolling
                       if (history.pushState) {
                           history.pushState(null, null, href);
                       }
                   }
               });
           });
       }
   };
   
   /* ========================================
      Navbar Scroll Effect Module
      ======================================== */
   const NavbarScroll = {
       init() {
           const navbar = document.getElementById('navbar');
           if (!navbar) return;
   
           let lastScroll = 0;
   
           window.addEventListener('scroll', () => {
               const currentScroll = window.pageYOffset;
   
               // Add shadow on scroll
               if (currentScroll > 50) {
                   navbar.classList.add('shadow-md');
               } else {
                   navbar.classList.remove('shadow-md');
               }
   
               // Hide/show navbar on scroll (optional)
               // if (currentScroll > lastScroll && currentScroll > 500) {
               //     navbar.style.transform = 'translateY(-100%)';
               // } else {
               //     navbar.style.transform = 'translateY(0)';
               // }
   
               lastScroll = currentScroll;
           });
       }
   };
   
   /* ========================================
      Reset Filters Function (Global)
      ======================================== */
   window.resetFilters = function() {
       // Reset search
       const searchInput = document.getElementById('search-input') || 
                          document.getElementById('app-search');
       if (searchInput) {
           searchInput.value = '';
       }
   
       // Reset sort
       const sortSelect = document.getElementById('sort-select');
       if (sortSelect) {
           sortSelect.value = 'name';
       }
   
       // Reset category filter
       CategoryFilter.reset();
   };
   
   /* ========================================
      Initialize Everything on DOM Ready
      ======================================== */
   document.addEventListener('DOMContentLoaded', () => {
       console.log('🚀 AppVault initialized');
   
       // Initialize all modules
       MobileMenu.init();
       AppSearch.init();
       CategoryFilter.init();
       Sort.init();
       DownloadModal.init();
       SmoothScroll.init();
       NavbarScroll.init();
   
       // Initialize notifications with app names from page
       const appTitles = Array.from(document.querySelectorAll('.glass-card h3'))
           .map(el => el.textContent.trim());
       NotificationToast.init(appTitles);
   
       // Lazy loading for images (if needed)
       if ('IntersectionObserver' in window) {
           const imageObserver = new IntersectionObserver((entries, observer) => {
               entries.forEach(entry => {
                   if (entry.isIntersecting) {
                       const img = entry.target;
                       img.src = img.dataset.src;
                       img.classList.remove('lazy');
                       observer.unobserve(img);
                   }
               });
           });
   
           document.querySelectorAll('img[data-src]').forEach(img => {
               imageObserver.observe(img);
           });
       }
   });
   
   /* ========================================
      Export for use in Antlers templates
      ======================================== */
   export { AppVault, smoothScrollTo };