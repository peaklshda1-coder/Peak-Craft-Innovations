// ============================================
// script.js - PeakCraft Innovations
// Enhanced EmailJS Integration with Image Support, 
// Toast Notifications, Form Auto-Save, & Analytics
// Service ID: service_xjrsbg8
// Template ID: template_2hcybjz
// ============================================

// ============================================
// 1. Configuration
// ============================================
const CONFIG = {
    EMAILJS: {
        PUBLIC_KEY: 'lJvZLakX5Di_kxhdG',
        SERVICE_ID: 'service_xjrsbg8',
        TEMPLATE_ID: 'template_2hcybjz'
    },
    TOAST: {
        DURATION: 4500,
        SUCCESS_DURATION: 6000,
        ERROR_DURATION: 7000
    },
    FORM: {
        STORAGE_KEY: 'peakcraft_form_data',
        AUTO_SAVE_DELAY: 500
    },
    VALIDATION: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
};

// ============================================
// 2. Utility Functions
// ============================================

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Debounce function for performance
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
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file type is allowed
 */
function isAllowedFileType(file) {
    return CONFIG.VALIDATION.ALLOWED_FILE_TYPES.includes(file.type) || 
           file.type.startsWith('image/');
}

/**
 * Get file extension
 */
function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

// ============================================
// 3. Initialize EmailJS
// ============================================
(function initEmailJS() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ 
                publicKey: CONFIG.EMAILJS.PUBLIC_KEY 
            });
            console.log('✅ PeakCraft Innovations - EmailJS Ready');
        } else {
            console.warn('⚠️ EmailJS library not loaded - check your internet');
        }
    } catch (e) {
        console.warn('⚠️ EmailJS init error:', e.message);
    }
})();

// ============================================
// 4. Toast Notification System (Enhanced)
// ============================================
function showToast(message, type = 'info', duration = null) {
    // Set duration based on type if not specified
    if (!duration) {
        switch (type) {
            case 'success': duration = CONFIG.TOAST.SUCCESS_DURATION; break;
            case 'error': duration = CONFIG.TOAST.ERROR_DURATION; break;
            default: duration = CONFIG.TOAST.DURATION;
        }
    }

    // Remove existing toast
    const existing = document.getElementById('pc-toast');
    if (existing) existing.remove();

    const colors = {
        success: { bg: '#1A7A3A', border: '#2E8B57', icon: '✅' },
        error: { bg: '#C62828', border: '#E53935', icon: '❌' },
        warning: { bg: '#E65100', border: '#FF6D00', icon: '⚠️' },
        info: { bg: '#1565C0', border: '#1976D2', icon: 'ℹ️' }
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.id = 'pc-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    // Add icon to message if not already present
    const displayMessage = message.match(/^[✅❌⚠️ℹ️]/) ? message : `${c.icon} ${message}`;

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(80px)',
        background: c.bg,
        color: '#fff',
        padding: '0.9rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: '99999',
        maxWidth: '90vw',
        width: 'max-content',
        minWidth: '280px',
        fontSize: '0.95rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: '1.5',
        border: '2px solid ' + c.border,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        opacity: '0',
        textAlign: 'center',
        pointerEvents: 'none',
        maxHeight: 'calc(100vh - 4rem)',
        overflow: 'auto',
        wordBreak: 'break-word'
    });

    toast.textContent = displayMessage;
    document.body.appendChild(toast);

    // Animate in with better timing
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        });
    });

    // Auto-dismiss with cleanup
    const dismissTimeout = setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(80px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 350);
    }, duration);

    // Allow manual dismissal on click
    toast.addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        toast.style.transform = 'translateX(-50%) translateY(80px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 350);
    });

    return toast;
}

// ============================================
// 5. Read Files as HTML (Enhanced)
// ============================================
function readFilesAsHTML(filesInput) {
    return new Promise(function(resolve) {
        if (!filesInput || !filesInput.files || filesInput.files.length === 0) {
            resolve('<em style="color:#94a3b8;">No files attached.</em>');
            return;
        }

        const files = Array.from(filesInput.files);
        const results = new Array(files.length);
        let done = 0;
        let hasError = false;

        // Validate files
        for (const file of files) {
            if (file.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
                showToast(`⚠️ ${file.name} is too large (max 10MB)`, 'warning');
                hasError = true;
            }
            if (!isAllowedFileType(file)) {
                showToast(`⚠️ ${file.name} is not an allowed file type`, 'warning');
                hasError = true;
            }
        }

        if (hasError) {
            resolve('<em style="color:#dc2626;">Some files were rejected. Please check file types and sizes.</em>');
            return;
        }

        if (files.length === 0) {
            resolve('<em style="color:#94a3b8;">No files attached.</em>');
            return;
        }

        files.forEach(function(file, idx) {
            const isImage = file.type.startsWith('image/');
            const sizeFormatted = formatFileSize(file.size);

            if (isImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    results[idx] =
                        '<div style="margin:8px 0;padding:8px;background:#f8fafc;border-radius:6px;">' +
                            '<div style="font-size:11px;color:#64748b;margin-bottom:4px;">' +
                            '📷 ' + escapeHtml(file.name) + ' (' + sizeFormatted + ')' +
                            '</div>' +
                            '<img src="' + e.target.result + '" ' +
                            'alt="' + escapeHtml(file.name) + '" ' +
                            'style="max-width:100%;max-height:300px;border-radius:6px;' +
                            'border:1px solid #e2e8f0;display:block;" />' +
                        '</div>';
                    done++;
                    if (done === files.length) resolve(results.join(''));
                };
                reader.onerror = function() {
                    results[idx] =
                        '<div style="color:#dc2626;font-size:12px;padding:8px;">' +
                        '❌ Could not read: ' + escapeHtml(file.name) +
                        '</div>';
                    done++;
                    if (done === files.length) resolve(results.join(''));
                };
                reader.readAsDataURL(file);
            } else {
                // Non-image files with icon based on extension
                const ext = getFileExtension(file.name);
                const icons = {
                    'pdf': '📄',
                    'doc': '📝',
                    'docx': '📝',
                    'txt': '📃',
                    'zip': '📦',
                    'rar': '📦',
                    'exe': '⚙️',
                    'mp4': '🎬',
                    'mp3': '🎵',
                    'wav': '🎵'
                };
                const icon = icons[ext] || '📎';

                results[idx] =
                    '<div style="margin:4px 0;padding:6px 8px;background:#f1f5f9;border-radius:4px;font-size:12px;color:#475569;">' +
                    icon + ' ' + escapeHtml(file.name) +
                    ' <span style="color:#94a3b8;">(' + sizeFormatted + ')</span>' +
                    '</div>';
                done++;
                if (done === files.length) resolve(results.join(''));
            }
        });
    });
}

// ============================================
// 6. Form Auto-Save (Local Storage)
// ============================================
function saveFormData() {
    try {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            whatsapp: document.getElementById('whatsapp')?.value || '',
            projectType: document.getElementById('projectType')?.value || '',
            startDate: document.getElementById('startDate')?.value || '',
            endDate: document.getElementById('endDate')?.value || '',
            budget: document.getElementById('budget')?.value || '',
            timeline: document.getElementById('timeline')?.value || '',
            description: document.getElementById('description')?.value || '',
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(CONFIG.FORM.STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
        // Silently fail - storage may not be available
    }
}

function restoreFormData() {
    try {
        const saved = localStorage.getItem(CONFIG.FORM.STORAGE_KEY);
        if (!saved) return;

        const data = JSON.parse(saved);
        const fields = {
            'name': data.name,
            'email': data.email,
            'phone': data.phone,
            'whatsapp': data.whatsapp,
            'projectType': data.projectType,
            'startDate': data.startDate,
            'endDate': data.endDate,
            'budget': data.budget,
            'timeline': data.timeline,
            'description': data.description
        };

        let hasData = false;
        for (const [id, value] of Object.entries(fields)) {
            if (value) {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value;
                    hasData = true;
                }
            }
        }

        if (hasData) {
            const savedTime = new Date(data.savedAt);
            const timeAgo = Math.round((Date.now() - savedTime.getTime()) / 60000);
            showToast(`💾 Form data restored from ${timeAgo} minutes ago`, 'info', 3000);
        }

        return hasData;
    } catch (e) {
        return false;
    }
}

function clearSavedFormData() {
    try {
        localStorage.removeItem(CONFIG.FORM.STORAGE_KEY);
    } catch (e) {
        // Silently fail
    }
}

// Create debounced version of save function
const debouncedSave = debounce(saveFormData, CONFIG.FORM.AUTO_SAVE_DELAY);

// ============================================
// 7. Form Submission Handler (Main)
// ============================================
function sendMail(event) {
    if (event) event.preventDefault();

    // Check EmailJS availability
    if (typeof emailjs === 'undefined') {
        showToast('📧 Email service unavailable. Please contact us directly at peaklshda1@gmail.com', 'error');
        return;
    }

    const form = document.getElementById('contact-form');
    if (!form) {
        console.error('❌ Form with id "contact-form" not found');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn ? submitBtn.innerHTML : 'Submit Request';

    // Helper to get values safely
    const getVal = (id) => document.getElementById(id)?.value?.trim() || '';

    // Collect all form data
    const params = {
        // Client Information
        name: getVal('name'),
        email: getVal('email'),
        phone: getVal('phone'),
        whatsapp: getVal('whatsapp'),

        // Project Details
        project_type: document.getElementById('projectType')?.value || '',
        start_date: document.getElementById('startDate')?.value || 'Not specified',
        end_date: document.getElementById('endDate')?.value || 'Not specified',
        budget: document.getElementById('budget')?.value || 'Not specified',
        timeline: document.getElementById('timeline')?.value || 'Not specified',
        description: getVal('description'),

        // Attachments (will be processed separately)
        attachments_html: '',

        // System Info
        to_email: 'peaklshda1@gmail.com',
        submitted_date: new Date().toLocaleString('en-ZM', {
            timeZone: 'Africa/Lusaka',
            dateStyle: 'full',
            timeStyle: 'medium'
        }),
        // Additional metadata
        user_agent: navigator.userAgent,
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'Direct'
    };

    // ============================================
    // 8. Validation - Required Fields
    // ============================================
    const requiredFields = {
        'Full Name': 'name',
        'Email': 'email',
        'Phone': 'phone',
        'WhatsApp': 'whatsapp',
        'Project Type': 'projectType',
        'Project Description': 'description'
    };

    const missing = [];
    for (const [label, id] of Object.entries(requiredFields)) {
        if (!params[id]) missing.push(label);
    }

    if (missing.length > 0) {
        showToast('⚠️ Please fill in: ' + missing.join(', '), 'warning');
        const fieldMap = {
            'Full Name': 'name',
            'Email': 'email',
            'Phone': 'phone',
            'WhatsApp': 'whatsapp',
            'Project Type': 'projectType',
            'Project Description': 'description'
        };
        const firstField = document.getElementById(fieldMap[missing[0]]);
        if (firstField) {
            firstField.focus();
            firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
        showToast('⚠️ Please enter a valid email address.', 'warning');
        document.getElementById('email')?.focus();
        return;
    }

    // Validate phone numbers (Zambia format)
    const phoneRegex = /^(\+260|0)[97]\d{8}$/;
    if (!phoneRegex.test(params.phone)) {
        showToast('⚠️ Please enter a valid Zambian phone number (e.g., +260971234567)', 'warning');
        document.getElementById('phone')?.focus();
        return;
    }

    if (!phoneRegex.test(params.whatsapp)) {
        showToast('⚠️ Please enter a valid WhatsApp number (e.g., +260971234567)', 'warning');
        document.getElementById('whatsapp')?.focus();
        return;
    }

    // ============================================
    // 9. Process Attachments (Images + Files)
    // ============================================
    const fileInput = document.getElementById('attachments');

    // Show loading state immediately
    if (submitBtn) {
        submitBtn.innerHTML = '⏳ Processing...';
        submitBtn.disabled = true;
    }

    // Process files and send email
    readFilesAsHTML(fileInput)
        .then(function(attachmentsHTML) {
            params.attachments_html = attachmentsHTML;

            // Update button to sending
            if (submitBtn) {
                submitBtn.innerHTML = '📤 Sending...';
            }

            // Optional: Track analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': params.project_type || 'General'
                });
            }

            return emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID, 
                CONFIG.EMAILJS.TEMPLATE_ID, 
                params
            );
        })
        .then(function(response) {
            // Success!
            showToast(
                '✅ Thank you! We\'ll get back to you within 24 hours.',
                'success'
            );

            // Clear saved form data
            clearSavedFormData();
            
            // Reset form
            form.reset();
            
            // Reset button
            if (submitBtn) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }

            // Optional: Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-XXXXXX/YYYYYY'
                });
            }

            console.log('✅ Email sent successfully:', response);
        })
        .catch(function(error) {
            // Error handling with detailed messaging
            console.error('❌ EmailJS Error:', error);

            let msg = '❌ Something went wrong. ';
            let logDetails = true;

            if (error.status === 400) {
                msg += 'Please check all fields and try again.';
            } else if (error.status === 429) {
                msg += 'Too many requests - please wait a moment.';
            } else if (error.status === 403) {
                msg += 'Access denied. Please contact us directly.';
            } else if (error.status === 0 || error.message?.includes('network')) {
                msg += 'Network error. Please check your internet connection.';
                logDetails = false;
            } else if (error.text) {
                // Try to get more details from the error response
                try {
                    const errorData = JSON.parse(error.text);
                    if (errorData.message) {
                        msg += errorData.message;
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            } else {
                msg += 'Please try again or email us at peaklshda1@gmail.com';
            }

            showToast(msg, 'error');

            if (submitBtn) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }

            // Log detailed error for debugging
            if (logDetails) {
                console.error('Error details:', {
                    status: error.status,
                    message: error.message,
                    text: error.text
                });
            }
        });
}

// ============================================
// 10. File Input Enhancement
// ============================================
function setupFileInput() {
    const fileInput = document.getElementById('attachments');
    if (!fileInput) return;

    // Create file info display
    const fileInfo = document.createElement('div');
    fileInfo.id = 'file-info';
    fileInfo.style.cssText = `
        margin-top: -0.5rem;
        margin-bottom: 1rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    `;
    fileInput.parentNode.insertBefore(fileInfo, fileInput.nextSibling);

    // Update file info on change
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(this.files);
        if (files.length === 0) {
            fileInfo.innerHTML = '';
            return;
        }

        let html = '<span>📎 Selected files:</span>';
        files.forEach(file => {
            const isAllowed = isAllowedFileType(file) && file.size <= CONFIG.VALIDATION.MAX_FILE_SIZE;
            const status = isAllowed ? '✅' : '⚠️';
            html += `<span style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:0.8rem;">
                ${status} ${escapeHtml(file.name)} (${formatFileSize(file.size)})
            </span>`;
        });
        fileInfo.innerHTML = html;

        // Auto-save when files are selected
        debouncedSave();
    });

    // Drag and drop support
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileInput.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop zone
    ['dragenter', 'dragover'].forEach(eventName => {
        fileInput.addEventListener(eventName, () => {
            fileInput.style.borderColor = 'var(--primary-green)';
            fileInput.style.boxShadow = '0 0 0 3px rgba(26, 122, 58, 0.2)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileInput.addEventListener(eventName, () => {
            fileInput.style.borderColor = '#d0e8d8';
            fileInput.style.boxShadow = 'none';
        }, false);
    });

    // Handle dropped files
    fileInput.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.files = files;
        this.dispatchEvent(new Event('change'));
    }, false);
}

// ============================================
// 11. Form Auto-Save Event Listeners
// ============================================
function setupAutoSave() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = ['name', 'email', 'phone', 'whatsapp', 'projectType', 
                    'startDate', 'endDate', 'budget', 'timeline', 'description'];

    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.addEventListener('input', debouncedSave);
            element.addEventListener('change', debouncedSave);
        }
    });

    // Restore saved data on page load
    const hasSaved = restoreFormData();

    // Show restore indicator
    if (hasSaved) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = '✕ Clear saved data';
        clearBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 0.8rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            text-decoration: underline;
        `;
        clearBtn.addEventListener('click', function() {
            clearSavedFormData();
            showToast('🗑️ Saved form data cleared', 'info', 2000);
            this.remove();
        });

        const note = document.createElement('div');
        note.style.cssText = `
            margin-top: -0.5rem;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
        `;
        note.innerHTML = `<span>💾 Form data automatically restored</span>`;
        note.appendChild(clearBtn);

        const formFirstChild = form.firstChild;
        form.insertBefore(note, formFirstChild);
    }
}

// ============================================
// 12. Initialize Everything on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Setup form submission
    const form = document.getElementById('contact-form');
    if (form) {
        // Remove any existing listeners to prevent duplicates
        form.removeEventListener('submit', sendMail);
        form.addEventListener('submit', sendMail);
        console.log('✅ Contact form ready - Service: service_xjrsbg8, Template: template_2hcybjz');
    } else {
        console.warn('⚠️ Contact form not found - ensure id="contact-form" exists');
    }

    // Setup file input enhancements
    setupFileInput();

    // Setup auto-save
    setupAutoSave();

    // Setup navigation
    setupNavigation();
});

// ============================================
// 13. Navigation Functions (extracted)
// ============================================
function setupNavigation() {
    const pages = {
        services: document.getElementById('page-services'),
        portfolio: document.getElementById('page-portfolio'),
        'how-it-works': document.getElementById('page-how-it-works'),
        pricing: document.getElementById('page-pricing'),
        contact: document.getElementById('page-contact')
    };
    const navLinks = document.querySelectorAll('.nav-link');

    window.navigateTo = function(pageId) {
        Object.values(pages).forEach(p => { if (p) p.classList.remove('active'); });
        if (pages[pageId]) pages[pageId].classList.add('active');
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.dataset.page === pageId) link.classList.add('active-link');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) window.navigateTo(page);
        });
    });

    // Keyboard nav for logo wrapper
    const logoWrapper = document.querySelector('.logo-wrapper');
    if (logoWrapper) {
        logoWrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.navigateTo('services');
            }
        });
    }

    // Contact with pre-selected service
    window.contactWithService = function(serviceType) {
        window.navigateTo('contact');
        setTimeout(() => {
            const select = document.getElementById('projectType');
            if (select) {
                const opt = Array.from(select.options).find(o => o.value === serviceType);
                if (opt) {
                    select.value = serviceType;
                    select.focus();
                } else {
                    select.focus();
                }
            }
        }, 200);
    };
}

// ============================================
// 14. Console Helpers
// ============================================
console.log('📧 PeakCraft Innovations - EmailJS Integration');
console.log('🔑 Service ID: service_xjrsbg8');
console.log('📄 Template ID: template_2hcybjz');
console.log('📋 Functions available:');
console.log('   - sendMail() - Submit contact form');
console.log('   - showToast(message, type, duration) - Display notifications');
console.log('   - readFilesAsHTML(fileInput) - Process file attachments');
console.log('   - saveFormData() / restoreFormData() - Form auto-save');
console.log('   - clearSavedFormData() - Clear saved form data');