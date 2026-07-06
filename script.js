// ============================================
// script.js - PeakCraft Innovations
// EmailJS Integration with Image Support & Toast Notifications
// Service ID: service_xjrsbg8
// Template ID: template_2hcybjz
// ============================================

// ============================================
// 1. Initialize EmailJS (Faster loading)
// ============================================
(function() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init({ 
                publicKey: "lJvZLakX5Di_kxhdG" 
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
// 2. Escape HTML (Security)
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// 3. Read Files as HTML (Images + Other Files)
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

        if (files.length === 0) {
            resolve('<em style="color:#94a3b8;">No files attached.</em>');
            return;
        }

        files.forEach(function(file, idx) {
            const isImage = file.type.startsWith('image/');
            const sizeMB = (file.size / 1048576).toFixed(2);

            if (isImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    results[idx] =
                        '<div style="margin:8px 0;">' +
                            '<div style="font-size:11px;color:#64748b;margin-bottom:4px;">📷 ' +
                            escapeHtml(file.name) + ' (' + sizeMB + ' MB)</div>' +
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
                        '<div style="color:#dc2626;font-size:12px;">❌ Could not read: ' +
                        escapeHtml(file.name) + '</div>';
                    done++;
                    if (done === files.length) resolve(results.join(''));
                };
                reader.readAsDataURL(file);
            } else {
                // Non-image files
                results[idx] =
                    '<div style="margin:4px 0;font-size:12px;color:#475569;">' +
                    '📄 ' + escapeHtml(file.name) +
                    ' <span style="color:#94a3b8;">(' + sizeMB + ' MB)</span>' +
                    '</div>';
                done++;
                if (done === files.length) resolve(results.join(''));
            }
        });
    });
}

// ============================================
// 4. Toast Notification System
// ============================================
function showToast(message, type = 'info', duration = 4500) {
    // Remove existing toast
    const existing = document.getElementById('pc-toast');
    if (existing) existing.remove();

    const colors = {
        success: { bg: '#1A7A3A', border: '#2E8B57' },
        error: { bg: '#C62828', border: '#E53935' },
        warning: { bg: '#E65100', border: '#FF6D00' },
        info: { bg: '#1565C0', border: '#1976D2' }
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.id = 'pc-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(80px)',
        background: c.bg,
        color: '#fff',
        padding: '0.9rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        zIndex: '99999',
        maxWidth: '90vw',
        width: 'max-content',
        fontSize: '0.95rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: '1.5',
        border: '2px solid ' + c.border,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        opacity: '0',
        textAlign: 'center',
        pointerEvents: 'none',
        maxHeight: 'calc(100vh - 4rem)',
        overflow: 'auto',
        wordBreak: 'break-word'
    });

    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in - optimized for speed
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        });
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(80px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// ============================================
// 5. MAIN: sendMail() - Handles form submission
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
        })
    };

    // ============================================
    // 6. Validation - Required Fields
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

    // ============================================
    // 7. Process Attachments (Images + Files)
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

            const SERVICE_ID = 'service_xjrsbg8';
            const TEMPLATE_ID = 'template_2hcybjz';

            return emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
        })
        .then(function(response) {
            // Success!
            showToast(
                '✅ Request sent! We\'ll get back to you within 24 hours.',
                'success',
                6000
            );

            form.reset();
            if (submitBtn) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }

            console.log('✅ Email sent successfully:', response);
        })
        .catch(function(error) {
            // Error handling
            console.error('❌ EmailJS Error:', error);

            let msg = '❌ Something went wrong. ';
            if (error.status === 400) {
                msg += 'Please check all fields and try again.';
            } else if (error.status === 429) {
                msg += 'Too many requests - please wait a moment.';
            } else if (error.status === 403) {
                msg += 'Access denied. Please contact us directly.';
            } else if (error.status === 0 || error.message?.includes('network')) {
                msg += 'Network error. Please check your internet connection.';
            } else {
                msg += 'Please try again or email us at peaklshda1@gmail.com';
            }

            showToast(msg, 'error', 7000);

            if (submitBtn) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
}

// ============================================
// 8. Auto-attach form submission handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        // Remove any existing listeners to prevent duplicates
        form.removeEventListener('submit', sendMail);
        form.addEventListener('submit', sendMail);
        console.log('✅ Contact form ready - Service: service_xjrsbg8, Template: template_2hcybjz');
    } else {
        console.warn('⚠️ Contact form not found - ensure id="contact-form" exists');
    }
});

// ============================================
// 9. Debug Console Helpers
// ============================================
console.log('📧 PeakCraft Innovations - EmailJS Integration');
console.log('🔑 Service ID: service_xjrsbg8');
console.log('📄 Template ID: template_2hcybjz');
console.log('📋 Functions available: sendMail(), showToast(), readFilesAsHTML()');