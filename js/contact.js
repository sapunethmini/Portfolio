// Contact Form JavaScript with YOUR EmailJS Configuration
// File: js/contact.js

(function() {
    'use strict';

    // YOUR EmailJS Configuration - READY TO USE
    const EMAIL_CONFIG = {
        serviceID: 'service_0h3rveg',
        templateID: 'template_8xf0opr',
        publicKey: 'A-6bY9eGa0rR1cjUK'
    };

    // Initialize EmailJS
    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAIL_CONFIG.publicKey);
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS library not loaded');
        }
    }

    // Get form elements
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Validation rules
    const validationRules = {
        name: {
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Name must be 2-50 characters and contain only letters and spaces'
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            pattern: /^.{3,100}$/,
            message: 'Subject must be 3-100 characters long'
        },
        message: {
            pattern: /^.{10,1000}$/,
            message: 'Message must be 10-1000 characters long'
        }
    };

    // Show/hide messages
    function showMessage(messageElement, text) {
        // Hide all messages first
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
        
        // Show the specific message
        if (messageElement) {
            messageElement.innerHTML = text;
            messageElement.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    // Set button loading state
    function setButtonLoading(loading) {
        if (submitBtn) {
            if (loading) {
                submitBtn.disabled = true;
                submitBtn.value = 'Sending...';
                submitBtn.classList.add('loading');
            } else {
                submitBtn.disabled = false;
                submitBtn.value = 'Send Message';
                submitBtn.classList.remove('loading');
            }
        }
    }

    // Validate individual field
    function validateField(fieldName, value) {
        const rule = validationRules[fieldName];
        if (!rule) return { isValid: true, message: '' };
        
        const isValid = rule.pattern.test(value.trim());
        return {
            isValid: isValid,
            message: isValid ? '' : rule.message
        };
    }

    // Show field validation feedback
    function showFieldValidation(fieldElement, isValid, message) {
        if (!fieldElement) return;
        
        // Remove existing feedback
        const existingFeedback = fieldElement.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Remove validation classes
        fieldElement.classList.remove('is-valid', 'is-invalid');
        
        if (isValid) {
            fieldElement.classList.add('is-valid');
        } else {
            fieldElement.classList.add('is-invalid');
            
            // Add error message
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = message;
            fieldElement.parentNode.appendChild(feedback);
        }
    }

    // Validate entire form
    function validateForm() {
        const formData = {
            name: document.getElementById('user_name')?.value || '',
            email: document.getElementById('user_email')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        let isFormValid = true;

        // Validate each field
        Object.keys(formData).forEach(fieldName => {
            const fieldId = fieldName === 'name' ? 'user_name' : 
                           fieldName === 'email' ? 'user_email' : fieldName;
            const fieldElement = document.getElementById(fieldId);
            
            if (fieldElement) {
                const validation = validateField(fieldName, formData[fieldName]);
                showFieldValidation(fieldElement, validation.isValid, validation.message);
                
                if (!validation.isValid) {
                    isFormValid = false;
                }
            }
        });

        return { isValid: isFormValid, data: formData };
    }

    // Send email using EmailJS with YOUR credentials
    function sendEmail(formData) {
        const templateParams = {
            to_email: 'sapuninethmini888@gmail.com',
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            reply_to: formData.email
        };

        console.log('Sending email with your EmailJS service...');

        return emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templateID,
            templateParams
        );
    }

    // Handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        console.log('Form submitted');

        // Validate form
        const validation = validateForm();
        
        if (!validation.isValid) {
            showMessage(errorMessage, '<strong>Error!</strong> Please correct the errors above and try again.');
            return;
        }

        // Set loading state
        setButtonLoading(true);

        // Send email using YOUR EmailJS configuration
        sendEmail(validation.data)
            .then(function(response) {
                console.log('Email sent successfully:', response);
                showMessage(successMessage, '<strong>Success!</strong> Your message has been sent successfully. I\'ll get back to you soon!');
                
                // Reset form
                contactForm.reset();
                
                // Remove validation classes
                document.querySelectorAll('.form-control').forEach(field => {
                    field.classList.remove('is-valid', 'is-invalid');
                });
                document.querySelectorAll('.invalid-feedback').forEach(feedback => {
                    feedback.remove();
                });
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                showMessage(errorMessage, '<strong>Error!</strong> Failed to send message. Please try again or contact me directly at sapuninethmini888@gmail.com');
            })
            .finally(function() {
                setButtonLoading(false);
            });
    }

    // Setup real-time validation
    function setupRealTimeValidation() {
        const fields = [
            { id: 'user_name', name: 'name' },
            { id: 'user_email', name: 'email' },
            { id: 'subject', name: 'subject' },
            { id: 'message', name: 'message' }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                // Validate on blur
                element.addEventListener('blur', function() {
                    const validation = validateField(field.name, this.value);
                    showFieldValidation(this, validation.isValid, validation.message);
                });

                // Clear validation on input
                element.addEventListener('input', function() {
                    this.classList.remove('is-invalid', 'is-valid');
                    const feedback = this.parentNode.querySelector('.invalid-feedback');
                    if (feedback) {
                        feedback.remove();
                    }
                });
            }
        });
    }

    // Initialize everything
    function init() {
        console.log('Initializing contact form with your EmailJS credentials...');
        
        // Initialize EmailJS with YOUR public key
        initEmailJS();

        // Setup form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
            setupRealTimeValidation();
            console.log('Contact form initialized successfully');
        } else {
            console.error('Contact form not found - make sure form has id="contact-form"');
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();