// Teste da Nova Navegação Topbar com Menu Hambúrguer
// Execute no console do navegador (F12 > Console)

console.log('🍔 TESTE DA NOVA NAVEGAÇÃO TOPBAR');
console.log('====================================');

function testTopbarNavigation() {
    const results = {
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        tests: [],
        overallStatus: 'PENDING'
    };
    
    // Teste 1: Verificar se o botão do menu hambúrguer existe
    function testHamburgerButton() {
        console.log('1️⃣ Testando botão do menu hambúrguer...');
        
        const hamburgerButton = document.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"]');
        const menuIcon = document.querySelector('.lucide-menu, .lucide-x');
        
        const test = {
            name: 'Botão Menu Hambúrguer',
            found: !!hamburgerButton,
            iconFound: !!menuIcon,
            status: hamburgerButton && menuIcon ? '✅ PASSOU' : '❌ FALHOU',
            details: {
                buttonText: hamburgerButton?.textContent || 'Sem texto',
                ariaLabel: hamburgerButton?.getAttribute('aria-label'),
                iconClass: menuIcon?.className || 'Ícone não encontrado'
            }
        };
        
        return test;
    }
    
    // Teste 2: Verificar se o logo está na topbar
    function testLogoInTopbar() {
        console.log('2️⃣ Testando logo na topbar...');
        
        const topbar = document.querySelector('nav');
        const logo = topbar?.querySelector('[data-logo], .logo, svg');
        const logoLink = topbar?.querySelector('a[href="/"]');
        
        const test = {
            name: 'Logo na Topbar',
            found: !!logo,
            linkFound: !!logoLink,
            status: logo && logoLink ? '✅ PASSOU' : '❌ FALHOU',
            details: {
                logoType: logo?.tagName || 'Não encontrado',
                linkHref: logoLink?.getAttribute('href') || 'Sem link'
            }
        };
        
        return test;
    }
    
    // Teste 3: Testar funcionalidade do menu dropdown
    function testDropdownFunctionality() {
        console.log('3️⃣ Testando funcionalidade do dropdown...');
        
        const hamburgerButton = document.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"]');
        
        if (!hamburgerButton) {
            return {
                name: 'Funcionalidade Dropdown',
                status: '❌ FALHOU',
                error: 'Botão do menu não encontrado'
            };
        }
        
        // Simular clique no botão
        hamburgerButton.click();
        
        // Verificar se o menu apareceu
        setTimeout(() => {
            const dropdownMenu = document.querySelector('#navigation-menu, [data-menu], .dropdown-menu');
            const menuItems = dropdownMenu?.querySelectorAll('a, button');
            
            const test = {
                name: 'Funcionalidade Dropdown',
                menuOpened: !!dropdownMenu,
                itemsFound: menuItems?.length || 0,
                status: dropdownMenu && menuItems && menuItems.length > 0 ? '✅ PASSOU' : '⚠️ VERIFICAR',
                details: {
                    menuVisible: dropdownMenu?.style.display !== 'none',
                    numberOfItems: menuItems?.length || 0,
                    firstItemText: menuItems?.[0]?.textContent?.trim() || 'Nenhum item'
                }
            };
            
            console.log('Dropdown test result:', test);
            
            // Fechar o menu
            hamburgerButton.click();
        }, 500);
        
        return {
            name: 'Funcionalidade Dropdown',
            status: '⏳ TESTANDO...',
            message: 'Verificando após simulação de clique'
        };
    }
    
    // Teste 4: Verificar acessibilidade
    function testAccessibility() {
        console.log('4️⃣ Testando acessibilidade...');
        
        const hamburgerButton = document.querySelector('button[aria-label*="menu"], button[aria-label*="Menu"]');
        const topbar = document.querySelector('nav');
        const buttons = topbar?.querySelectorAll('button');
        
        const test = {
            name: 'Acessibilidade',
            ariaLabelFound: !!hamburgerButton?.getAttribute('aria-label'),
            keyboardAccessible: true, // Presumimos que é acessível via teclado
            buttonCount: buttons?.length || 0,
            status: hamburgerButton?.getAttribute('aria-label') ? '✅ PASSOU' : '⚠️ VERIFICAR',
            details: {
                ariaLabel: hamburgerButton?.getAttribute('aria-label') || 'Não encontrado',
                totalButtons: buttons?.length || 0,
                hasKeyboardSupport: true
            }
        };
        
        return test;
    }
    
    // Teste 5: Verificar responsividade
    function testResponsiveness() {
        console.log('5️⃣ Testando responsividade...');
        
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        const isMobile = viewport.width <= 768;
        const topbar = document.querySelector('nav');
        const topbarHeight = topbar?.offsetHeight;
        
        const test = {
            name: 'Responsividade',
            viewport: `${viewport.width}x${viewport.height}`,
            isMobile: isMobile,
            topbarHeight: topbarHeight,
            status: topbarHeight && topbarHeight > 0 ? '✅ PASSOU' : '❌ FALHOU',
            details: {
                deviceType: isMobile ? 'Mobile' : 'Desktop',
                viewportWidth: viewport.width,
                topbarHeight: `${topbarHeight}px`,
                recommendedHeight: isMobile ? '56-64px' : '64-72px'
            }
        };
        
        return test;
    }
    
    // Executar testes
    results.tests.push(testHamburgerButton());
    results.tests.push(testLogoInTopbar());
    results.tests.push(testDropdownFunctionality());
    results.tests.push(testAccessibility());
    results.tests.push(testResponsiveness());
    
    // Calcular resultado geral
    const passedTests = results.tests.filter(t => t.status.includes('✅')).length;
    const totalTests = results.tests.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    results.overallStatus = 
        successRate === 100 ? 'EXCELLENT' :
        successRate >= 80 ? 'GOOD' :
        successRate >= 60 ? 'ACCEPTABLE' : 'NEEDS_IMPROVEMENT';
    
    // Exibir resultados
    setTimeout(() => {
        console.log('\n📊 RESULTADOS DO TESTE');
        console.log('========================');
        
        results.tests.forEach((test, index) => {
            console.log(`${index + 1}. ${test.name}: ${test.status}`);
            if (test.details) {
                console.log('   Detalhes:', JSON.stringify(test.details, null, 2).split('\n').join('\n   '));
            }
            if (test.error) {
                console.log(`   Erro: ${test.error}`);
            }
            if (test.message) {
                console.log(`   Mensagem: ${test.message}`);
            }
            console.log('');
        });
        
        console.log('📋 RESUMO:');
        console.log(`✅ Taxa de sucesso: ${successRate}%`);
        console.log(`🏆 Status geral: ${results.overallStatus}`);
        console.log(`📱 Viewport: ${window.innerWidth}x${window.innerHeight}px`);
        
        console.log('\n💡 DICAS PARA TESTAR:');
        console.log('- Clique no botão hambúrguer para ver o menu dropdown');
        console.log('- Teste redimensionar a janela para ver responsividade');
        console.log('- Use Tab para navegação via teclado');
        console.log('- Verifique se o logo aparece na topbar');
        
    }, 1000);
    
    return results;
}

// Executar teste
testTopbarNavigation();

// Função adicional para testar manualmente
window.testNavigationAgain = testTopbarNavigation;