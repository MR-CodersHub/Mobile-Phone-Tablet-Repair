document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL: NAVIGATION SCROLL BLUR ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- GLOBAL: ACTIVE LINK HIGHLIGHTER ---
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Simple match for local dev relative paths
        if (currentPath.endsWith(linkPath) || (linkPath === 'index.html' && currentPath.endsWith('/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- GLOBAL: MOBILE SIDE DRAWER ---
    const hamburger = document.querySelector('.hamburger');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');

    if (hamburger && mobileDrawer) {
        // Create backdrop overlay for click-outside-to-close
        let backdrop = document.querySelector('.mobile-nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'mobile-nav-backdrop';
            document.body.appendChild(backdrop);
        }

        const openDrawer = () => {
            mobileDrawer.classList.add('open');
            hamburger.classList.add('active');
            backdrop.classList.add('active');
            document.body.classList.add('drawer-open');
        };

        const closeDrawer = () => {
            mobileDrawer.classList.remove('open');
            hamburger.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.classList.remove('drawer-open');
        };

        hamburger.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        // Close drawer on backdrop click
        backdrop.addEventListener('click', closeDrawer);

        // Close drawer on click of nav items
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        // Close drawer on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            }
        });

        // Auto-close drawer when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    // --- GLOBAL: SCROLL INTERSECTION OBSERVER ANIMATIONS ---
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- COMPONENT: FAQ ACCORDION ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- COMPONENT: REPAIR ESTIMATOR WIDGET (repairs.html) ---
    const deviceSelect = document.getElementById('estimator-device');
    const issueSelect = document.getElementById('estimator-issue');
    const priceDisplay = document.getElementById('estimate-price-value');

    if (deviceSelect && issueSelect && priceDisplay) {
        const calculateEstimate = () => {
            const deviceVal = deviceSelect.value;
            const issueVal = issueSelect.value;
            
            if (!deviceVal || !issueVal) {
                priceDisplay.textContent = '$0';
                return;
            }

            let base = 0;
            if (deviceVal.includes('iphone')) base = 100;
            else if (deviceVal.includes('ipad')) base = 140;
            else if (deviceVal.includes('samsung')) base = 95;
            else if (deviceVal.includes('pixel')) base = 85;
            else if (deviceVal.includes('tablet')) base = 110;
            else base = 90;

            let modifier = 0;
            switch(issueVal) {
                case 'screen': modifier = 119; break;
                case 'battery': modifier = 59; break;
                case 'charging': modifier = 49; break;
                case 'motherboard': modifier = 189; break;
                case 'water': modifier = 129; break;
                case 'unlocking': modifier = 39; break;
                case 'software': modifier = 29; break;
                default: modifier = 50;
            }

            priceDisplay.textContent = `$${base + modifier}`;
        };

        deviceSelect.addEventListener('change', calculateEstimate);
        issueSelect.addEventListener('change', calculateEstimate);
    }

    // --- COMPONENT: TRADE-IN VALUATION ESTIMATOR (devices.html) ---
    const tradeinDevice = document.getElementById('tradein-device');
    const tradeinCondition = document.getElementById('tradein-condition');
    const tradeinPrice = document.getElementById('tradein-value-price');

    if (tradeinDevice && tradeinCondition && tradeinPrice) {
        const calculateTradein = () => {
            const dev = tradeinDevice.value;
            const cond = tradeinCondition.value;

            if (!dev || !cond) {
                tradeinPrice.textContent = '$0';
                return;
            }

            let baseVal = 0;
            if (dev === 'iphone15pro') baseVal = 750;
            else if (dev === 'iphone14') baseVal = 480;
            else if (dev === 's24ultra') baseVal = 780;
            else if (dev === 's23') baseVal = 420;
            else if (dev === 'pixel8pro') baseVal = 460;
            else if (dev === 'ipadpro') baseVal = 620;
            else baseVal = 200;

            let multiplier = 1.0;
            if (cond === 'mint') multiplier = 1.0;
            else if (cond === 'excellent') multiplier = 0.88;
            else if (cond === 'good') multiplier = 0.72;
            else if (cond === 'fair') multiplier = 0.45;

            const finalPrice = Math.round(baseVal * multiplier);
            tradeinPrice.textContent = `$${finalPrice}`;
        };

        tradeinDevice.addEventListener('change', calculateTradein);
        tradeinCondition.addEventListener('change', calculateTradein);
    }

    // --- COMPONENT: TESTIMONIALS CAROUSEL SLIDER (testimonials.html & index.html) ---
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-controls');
    
    if (track && slides.length > 0 && dotsContainer) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Generate dot elements dynamically
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dot');

        const updateDots = () => {
            dots.forEach((dot, index) => {
                if (index === currentIndex) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        // Auto play slider
        let autoSlideInterval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        }, 5000);

        // Reset auto play on click
        dotsContainer.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % totalSlides;
                goToSlide(nextIndex);
            }, 5000);
        });
    }

    // --- COMPONENT: SEARCH & FILTER TABS (devices.html, services.html, accessories.html) ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const filterItems = document.querySelectorAll('.filterable-item');

    if (filterTabs.length > 0 && filterItems.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active classes
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filterVal = tab.getAttribute('data-filter');

                filterItems.forEach(item => {
                    const categories = item.getAttribute('data-category').split(' ');
                    if (filterVal === 'all' || categories.includes(filterVal)) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 200);
                    }
                });
            });
        });
    }

    // Search bar filtering logic
    const searchBar = document.querySelector('.search-input-wrap input');
    if (searchBar && filterItems.length > 0) {
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterItems.forEach(item => {
                const title = item.querySelector('h3, h4').textContent.toLowerCase();
                const desc = item.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (title.includes(query) || desc.includes(query)) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- COMPONENT: WRITE A REVIEW STAR RATING SELECTION (testimonials.html) ---
    const stars = document.querySelectorAll('.review-stars-select i');
    const ratingInput = document.getElementById('review-rating-value');

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rateValue = parseInt(star.getAttribute('data-rate'));
                if (ratingInput) ratingInput.value = rateValue;
                
                // Highlight star indices up to selected value
                stars.forEach((s, idx) => {
                    if (idx < rateValue) {
                        s.classList.add('active');
                        s.classList.replace('far', 'fas');
                    } else {
                        s.classList.remove('active');
                        s.classList.replace('fas', 'far');
                    }
                });
            });
        });
    }

    // --- COMPONENT: MULTI-STEP BOOKING WIZARD FORM (booking.html) ---
    const prevBtn = document.getElementById('booking-prev');
    const nextBtn = document.getElementById('booking-next');
    const submitBtn = document.getElementById('booking-submit');
    const panels = document.querySelectorAll('.booking-step-panel');
    const nodes = document.querySelectorAll('.wizard-step-node');
    const progressBar = document.querySelector('.wizard-progress-bar');

    if (panels.length > 0 && nodes.length > 0) {
        let currentStep = 0;
        const totalSteps = panels.length;

        const updateWizardUI = () => {
            // Update active panels
            panels.forEach((panel, idx) => {
                if (idx === currentStep) panel.classList.add('active');
                else panel.classList.remove('active');
            });

            // Update step node classes
            nodes.forEach((node, idx) => {
                if (idx < currentStep) {
                    node.classList.add('completed');
                    node.classList.remove('active');
                } else if (idx === currentStep) {
                    node.classList.add('active');
                    node.classList.remove('completed');
                } else {
                    node.classList.remove('active', 'completed');
                }
            });

            // Update Progress Bar width
            const progressPercent = (currentStep / (totalSteps - 1)) * 100;
            if (progressBar) progressBar.style.width = `${progressPercent}%`;

            // Button controls
            if (currentStep === 0) {
                if (prevBtn) prevBtn.style.display = 'none';
            } else {
                if (prevBtn) prevBtn.style.display = 'inline-flex';
            }

            if (currentStep === totalSteps - 2) {
                if (nextBtn) nextBtn.style.display = 'none';
                if (submitBtn) submitBtn.style.display = 'inline-flex';
            } else if (currentStep === totalSteps - 1) {
                // Success page - hide controls entirely
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (submitBtn) submitBtn.style.display = 'none';
            } else {
                if (nextBtn) nextBtn.style.display = 'inline-flex';
                if (submitBtn) submitBtn.style.display = 'none';
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Basic validation for Step 1 & 2 before proceeding
                if (currentStep === 0) {
                    const brand = document.getElementById('booking-brand').value;
                    const issue = document.getElementById('booking-issue').value;
                    if (!brand || !issue) {
                        alert("Please select your device brand and issue type.");
                        return;
                    }
                }
                if (currentStep === 1) {
                    const date = document.getElementById('booking-date').value;
                    if (!date) {
                        alert("Please select a preferred date for the repair.");
                        return;
                    }
                }
                currentStep++;
                updateWizardUI();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentStep--;
                updateWizardUI();
            });
        }

        // Mock Submission
        const bookingForm = document.getElementById('repair-booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Form validation for contact details
                const name = document.getElementById('booking-name').value;
                const email = document.getElementById('booking-email').value;
                const phone = document.getElementById('booking-phone').value;
                
                if (!name || !email || !phone) {
                    alert("Please fill in your contact information.");
                    return;
                }

                // Generate random ticket code
                const code = 'FIX-' + Math.floor(100000 + Math.random() * 900000);
                const codeDisplay = document.getElementById('generated-ticket-code');
                if (codeDisplay) codeDisplay.textContent = code;

                // Save mockup ticket data to localStorage for the tracker widget to lookup
                const trackingData = {
                    code: code,
                    device: document.getElementById('booking-brand').value + ' Device',
                    issue: document.getElementById('booking-issue').value,
                    status: 1, // 1 = Received/Checked-in
                    date: new Date().toLocaleDateString(),
                    cost: '$89 - $149'
                };
                localStorage.setItem(code, JSON.stringify(trackingData));

                currentStep++;
                updateWizardUI();
            });
        }

        updateWizardUI();
    }

    // --- COMPONENT: REPAIR TRACKING DASHBOARD (booking.html & index.html lookup) ---
    const trackInput = document.getElementById('tracker-code-input');
    const trackSearchBtn = document.getElementById('tracker-search-btn');
    const trackDetails = document.getElementById('tracker-details-wrapper');

    if (trackInput && trackSearchBtn && trackDetails) {
        const performSearch = () => {
            const code = trackInput.value.trim().toUpperCase();
            if (!code) {
                alert("Please enter a tracking ticket code.");
                return;
            }

            // Retrieve from localStorage or use a default mock
            let repairInfo = localStorage.getItem(code);
            if (repairInfo) {
                repairInfo = JSON.parse(repairInfo);
            } else {
                // If not found, simulate a mock ticket code details
                if (code.startsWith('FIX-') && code.length >= 8) {
                    // Generate pseudo-random stage based on ticket characters
                    const stage = (code.charCodeAt(5) % 4) + 1; // Stage 1 to 4
                    repairInfo = {
                        code: code,
                        device: "iPhone 15 Pro",
                        issue: "Screen Replacement",
                        status: stage,
                        date: "2026-05-24",
                        cost: "$180"
                    };
                } else {
                    alert("No record found for this ticket code. Try searching standard code format: 'FIX-123456'");
                    trackDetails.style.display = 'none';
                    return;
                }
            }

            // Populate dashboard fields
            document.getElementById('track-device-name').textContent = repairInfo.device;
            document.getElementById('track-issue-desc').textContent = repairInfo.issue;
            document.getElementById('track-est-cost').textContent = repairInfo.cost;
            document.getElementById('track-est-date').textContent = repairInfo.date;

            // Highlight progress steps in tracker timeline
            const trackerNodes = document.querySelectorAll('.tracker-node');
            const progressLine = document.querySelector('.tracker-timeline-bar');
            
            trackerNodes.forEach((node, index) => {
                const nodeStage = index + 1;
                node.classList.remove('completed', 'current');
                
                if (nodeStage < repairInfo.status) {
                    node.classList.add('completed');
                } else if (nodeStage === repairInfo.status) {
                    node.classList.add('current');
                }
            });

            // Adjust line height
            if (progressLine) {
                // heights mapping to step completion
                const percentages = [0, 15, 48, 80, 100];
                progressLine.style.height = `${percentages[repairInfo.status - 1]}%`;
            }

            // Make wrapper visible
            trackDetails.style.display = 'block';
            trackDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };

        trackSearchBtn.addEventListener('click', performSearch);
        trackInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // --- COMPONENT: SHOPPING CART SIDE DRAWER (accessories.html) ---
    const cartToggle = document.querySelectorAll('.cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.getElementById('cart-close');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');

    if (cartDrawer) {
        const toggleCart = () => cartDrawer.classList.toggle('open');

        cartToggle.forEach(btn => btn.addEventListener('click', toggleCart));
        if (cartClose) cartClose.addEventListener('click', toggleCart);

        // Simple mock cart add items logic
        let cartItemsCount = 0;
        const cartBadge = document.querySelectorAll('.cart-badge');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalDisplay = document.getElementById('cart-total-value');
        let currentTotal = 0;

        if (addToCartBtns.length > 0) {
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const card = btn.closest('.product-card');
                    const title = card.querySelector('h3').textContent;
                    const priceRaw = card.querySelector('.product-price').textContent;
                    const price = parseFloat(priceRaw.replace('$', ''));
                    const imageSrc = card.querySelector('.product-image-wrap img').src;

                    // Add items markup with remove button
                    const itemMarkup = `
                        <div class="cart-item">
                            <img src="${imageSrc}" alt="${title}">
                            <div class="cart-item-info">
                                <h4>${title}</h4>
                                <div class="cart-item-price">$${price}</div>
                            </div>
                            <button class="cart-item-remove" aria-label="Remove Item"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                    if (cartItemsContainer) {
                        // Remove "empty" placeholder if count is 0
                        if (cartItemsCount === 0) cartItemsContainer.innerHTML = '';
                        cartItemsContainer.insertAdjacentHTML('beforeend', itemMarkup);
                    }

                    cartItemsCount++;
                    cartBadge.forEach(badge => {
                        badge.style.display = 'flex';
                        badge.textContent = cartItemsCount;
                    });

                    currentTotal += price;
                    if (cartTotalDisplay) cartTotalDisplay.textContent = `$${currentTotal.toFixed(2)}`;

                    // Slide drawer open automatically to show added item
                    cartDrawer.classList.add('open');
                });
            });
        }

        // Handle item removal via event delegation
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.cart-item-remove');
                if (removeBtn) {
                    const cartItem = removeBtn.closest('.cart-item');
                    const priceText = cartItem.querySelector('.cart-item-price').textContent;
                    const price = parseFloat(priceText.replace('$', ''));

                    cartItem.remove();

                    cartItemsCount--;
                    cartBadge.forEach(badge => {
                        if (cartItemsCount > 0) {
                            badge.textContent = cartItemsCount;
                        } else {
                            badge.style.display = 'none';
                        }
                    });

                    currentTotal = Math.max(0, currentTotal - price);
                    if (cartTotalDisplay) cartTotalDisplay.textContent = `$${currentTotal.toFixed(2)}`;

                    if (cartItemsCount === 0) {
                        cartItemsContainer.innerHTML = `
                            <div style="text-align: center; color: var(--text-muted); font-size: 14px; margin-top: 50px;">
                                Your shopping bag is empty.<br>Add accessories to begin.
                            </div>
                        `;
                    }
                }
            });
        }
    }

    // --- GLOBAL: THEME TOGGLE LIGHT/DARK MODE ---
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    });

    // --- GLOBAL: RTL DIRECTION TOGGLE ---
    const rtlToggles = document.querySelectorAll('.btn-rtl');
    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const isRtl = html.getAttribute('dir') === 'rtl';
            html.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
            btn.classList.toggle('active');
            localStorage.setItem('rtl', isRtl ? 'ltr' : 'rtl');
        });
        const savedRtl = localStorage.getItem('rtl');
        if (savedRtl === 'rtl') {
            document.documentElement.setAttribute('dir', 'rtl');
            btn.classList.add('active');
        }
    });
});

