// ============================================
// script.js - PeakCraft Innovations
// EmailJS Integration with YOUR credentials
// Service ID: service_xjrsbg8
// Template ID: template_2hcybjz
// ============================================

// Initialize EmailJS with your public key
(function() {
    emailjs.init({
        publicKey: "lJvZLakX5Di_kxhdG",
    });
})();

/**
 * sendMail - Main function to send project requests via EmailJS
 * Uses Service ID: service_xjrsbg8
 * Uses Template ID: template_2hcybjz
 */
function sendMail(event) {
    // Prevent default form submission
    if (event) {
        event.preventDefault();
    }

    // Get form and button elements
    const form = document.getElementById('contact-form');
    if (!form) {
        console.error('Form with id "contact-form" not found');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';

    // Collect ALL form data
    let params = {
        // Client Information
        name: document.getElementById("name")?.value?.trim() || '',
        email: document.getElementById("email")?.value?.trim() || '',
        phone: document.getElementById("phone")?.value?.trim() || '',
        whatsapp: document.getElementById("whatsapp")?.value?.trim() || '',
        
        // Project Details
        project_type: document.getElementById("projectType")?.value || '',
        start_date: document.getElementById("startDate")?.value || 'Not specified',
        end_date: document.getElementById("endDate")?.value || 'Not specified',
        budget: document.getElementById("budget")?.value || 'Not specified',
        timeline: document.getElementById("timeline")?.value || 'Not specified',
        description: document.getElementById("description")?.value?.trim() || '',
        
        // Additional Info
        to_email: 'peaklshda1@gmail.com',
        submitted_date: new Date().toLocaleString('en-ZM', {
            timeZone: 'Africa/Lusaka',
            dateStyle: 'full',
            timeStyle: 'medium'
        })
    };

    // Validate required fields
    if (!params.name || !params.email || !params.phone || 
        !params.whatsapp || !params.project_type || !params.description) {
        alert('⚠️ Please fill in all required fields.\n\nRequired: Name, Email, Phone, WhatsApp, Project Type, Description');
        return;
    }

    // Show loading state if button exists
    if (submitBtn) {
        submitBtn.textContent = '⏳ Sending...';
        submitBtn.disabled = true;
    }

    // YOUR EmailJS credentials
    const SERVICE_ID = "service_xjrsbg8";
    const TEMPLATE_ID = "template_2hcybjz";

    // Send email using EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
        .then(function(response) {
            // Success
            alert('✅ Thank you for your request!\n\nWe will get back to you within 24 hours.\n\n📧 Confirmation sent to: ' + params.email);
            
            // Reset form
            form.reset();
            
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            
            console.log('Email sent successfully!', response);
        })
        .catch(function(error) {
            // Error handling
            console.error('❌ EmailJS Error:', error);
            
            let errorMsg = '❌ Oops! Something went wrong.\n\n';
            if (error.status === 400) {
                errorMsg += 'Please check all fields and try again.';
            } else if (error.status === 429) {
                errorMsg += 'Too many requests. Please wait a moment and try again.';
            } else if (error.status === 403) {
                errorMsg += 'Access denied. Please check your API key.';
            } else {
                errorMsg += 'Please try again or contact us directly at peaklshda1@gmail.com';
            }
            
            alert(errorMsg);
            
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
}

// ============================================
// Auto-attach form submission handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        // Use sendMail as the default handler
        form.addEventListener('submit', sendMail);
        console.log('✅ Contact form ready! Using Service: service_xjrsbg8, Template: template_2hcybjz');
    } else {
        console.warn('⚠️ Contact form not found. Make sure your form has id="contact-form"');
    }
});

// ============================================
// Console helper for debugging
// ============================================
console.log('📧 PeakCraft Innovations - EmailJS Ready');
console.log('🔑 Service ID: service_xjrsbg8');
console.log('📄 Template ID: template_2hcybjz');
console.log('📋 Function available: sendMail()');