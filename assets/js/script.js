// ========================================
// COMENTÁRIO: INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os ícones Lucide
    lucide.createIcons();
    
    // Inicializa funcionalidades
    initThemeToggle();
    initMobileMenu();
    initScrollToTop();
    initSmoothScroll();
    initContactForm();
    initCurrentYear();
});

// ========================================
// COMENTÁRIO: DARK/LIGHT MODE
// ========================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Verifica se há tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Salva a preferência no localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Reinicializa os ícones após a mudança de tema
        lucide.createIcons();
    });
}

// ========================================
// COMENTÁRIO: MENU MOBILE - DESLIZA DA DIREITA PARA A ESQUERDA
// ========================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Abre o menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    });
    
    // Fecha o menu
    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    mobileMenuClose.addEventListener('click', closeMenu);
    mobileMenuOverlay.addEventListener('click', closeMenu);
    
    // Fecha o menu ao clicar em um link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// ========================================
// COMENTÁRIO: BOTÃO DE VOLTAR AO TOPO
// ========================================

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Mostra/esconde o botão baseado na posição do scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Rola para o topo ao clicar
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Reinicializa os ícones
    lucide.createIcons();
}

// ========================================
// COMENTÁRIO: SCROLL SUAVE PARA ÂNCORAS
// ========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora links vazios ou apenas "#"
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// COMENTÁRIO: MODAIS
// ========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Fecha modal ao pressionar ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// ========================================
// COMENTÁRIO: FORMULÁRIO DE CONTATO
// ========================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Coleta os dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        
        // Validação básica
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validação de e-mail
        if (!isValidEmail(formData.email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        try {
            // Envia para o arquivo PHP
            const response = await fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                form.reset();
            } else {
                showFormMessage(result.error || 'Erro ao enviar mensagem. Tente novamente.', 'error');
            }
        } catch (error) {
            showFormMessage('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.', 'error');
        }
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// COMENTÁRIO: ANO AUTOMÁTICO NO RODAPÉ
// ========================================

function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

