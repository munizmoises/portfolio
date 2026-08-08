const CONFIG = {

    status: 'parcial',

    textos: {
        disponivel: {
            hero_badge: 'Aberto a Estágio',
            hero_status: 'Disponível para estágio',
            sobre_status: 'Disponível para estágio',
            rodape: 'Aberto a oportunidades',
            cor: '#4caf50',
            sombra: 'rgba(76,175,80,0.2)',
        },

        indisponivel: {
            hero_badge: 'Momento Ocupado',
            hero_status: 'Indisponível no momento',
            sobre_status: 'Indisponível no momento',
            rodape: 'Indisponível no momento',
            cor: '#e85d75',
            sombra: 'rgba(232,93,117,0.2)',
        },

        parcial: {
            hero_badge: 'Aberto a Freelance',
            hero_status: 'Disponível para freelance',
            sobre_status: 'Disponível para freelance',
            rodape: 'Disponível para freelance',
            cor: '#f7d74e',
            sombra: 'rgba(247,215,78,0.2)',
        },
    },
};

const faculdade = 'FAESA';

const link_email = 'mailto:moisesmuniz199@gmail.com';
const link_linkedin = 'https://www.linkedin.com/in/moisesmuniz/';
const telefone = 'tel:+5527992295975';
const link_github = 'https://github.com/munizmoises';

document.querySelectorAll('.faculdade').forEach(el => el.innerHTML = faculdade);

document.querySelectorAll('.link_email').forEach(el => el.href = link_email);
document.querySelectorAll('.link_linkedin').forEach(el => el.href = link_linkedin);
document.querySelectorAll('.telefone').forEach(el => el.href = telefone);
document.querySelectorAll('.link_github').forEach(el => el.href = link_github);

// APLICAR STATUS 
function aplicarStatus() {
    const cfg = CONFIG.textos[CONFIG.status] || CONFIG.textos.disponivel;

    const heroBadge = document.getElementById('heroBadgeStatus');
    if (heroBadge) heroBadge.textContent = cfg.hero_badge;

    const heroStatusTxt = document.getElementById('heroStatusTexto');
    if (heroStatusTxt) heroStatusTxt.textContent = cfg.hero_status;

    const sobreStatusTxt = document.getElementById('sobreStatusTexto');
    if (sobreStatusTxt) sobreStatusTxt.textContent = cfg.sobre_status;

    const sobreIcone = document.getElementById('sobreStatusIcone');
    if (sobreIcone) sobreIcone.style.color = cfg.cor;

    // Hero dot
    const dot = document.querySelector('.hero_status-dot');
    if (dot) {
        dot.style.backgroundColor = cfg.cor;
        dot.style.boxShadow = `0 0 0 3px ${cfg.sombra}`;
    }

    // Rodapé dot
    const rodapeDot = document.getElementById('rodapeStatusDot');
    if (rodapeDot) {
        rodapeDot.style.backgroundColor = cfg.cor;
        rodapeDot.style.boxShadow = `0 0 0 3px ${cfg.sombra}`;
    }

    // Rodapé texto
    const rodapeStatus = document.getElementById('rodapeStatus');
    if (rodapeStatus) {
        rodapeStatus.textContent = cfg.rodape;
        rodapeStatus.style.color = cfg.cor;
    }
}

aplicarStatus();

// ANO ATUAL NO FOOTER
document.getElementById('anoAtual').textContent = new Date().getFullYear();

// MODO CLARO / ESCURO
const btnTema = document.getElementById('btnTema');
const iconeTema = document.getElementById('iconeTema');

let modoClaro = localStorage.getItem('tema') === 'claro';

function aplicarTema() {
    if (modoClaro) {
        document.body.classList.add('modo-claro');
        iconeTema.className = 'fa-solid fa-sun';
        btnTema.setAttribute('title', 'Modo escuro');
    } else {
        document.body.classList.remove('modo-claro');
        iconeTema.className = 'fa-solid fa-moon';
        btnTema.setAttribute('title', 'Modo claro');
    }
    localStorage.setItem('tema', modoClaro ? 'claro' : 'escuro');
}

aplicarTema();

btnTema.addEventListener('click', () => {
    modoClaro = !modoClaro;
    aplicarTema();
});

// NAV LINK ATIVO NO SCROLL
const mapaSecoes = [
    { seletor: '#inicio',       href: '#inicio'       },
    { seletor: '#sobre',        href: '#sobre'        },
    { seletor: '#tecnologias',  href: '#tecnologias'  },
    { seletor: '#projetos',     href: '#projetos'     },
    { seletor: '#certificados', href: '#certificados' },
    { seletor: '#contato',      href: '#contato'      },
];

const linksNav = document.querySelectorAll('.cabecalho_link');

function atualizarNavAtivo() {
    let secaoAtual = '#inicio';

    for (const { seletor, href } of mapaSecoes) {
        const el = document.querySelector(seletor);
        if (!el) continue;
        const topo = el.getBoundingClientRect().top;
        if (topo <= 120) secaoAtual = href;
    }

    linksNav.forEach(link => {
        link.classList.remove('ativo');
        if (link.getAttribute('href') === secaoAtual) {
            link.classList.add('ativo');
        }
    });
}

window.addEventListener('scroll', atualizarNavAtivo, { passive: true });
window.addEventListener('load', atualizarNavAtivo);
atualizarNavAtivo();

const elementosAnimados = document.querySelectorAll(
    '.projeto_card, .tech_grupo, .certificado_card, .sobre_stat, .hero_card-info'
);

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

elementosAnimados.forEach(el => {
    el.classList.add('oculto-inicial');
    observador.observe(el);
});

// FECHAR MENU MOBILE AO CLICAR NO LINK
const linksNavAll = document.querySelectorAll('.cabecalho_link');
const menuCollapse = document.getElementById('navMenu');

linksNavAll.forEach(link => {
    link.addEventListener('click', () => {
        if (menuCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(menuCollapse);
            if (bsCollapse) bsCollapse.hide();
        }
    });
});

// FILTROS CERTIFICADOS
const filtroAnoContainer    = document.getElementById('filtroAno');
const filtroStatusContainer = document.getElementById('filtroStatus');
const listaCertificados     = document.getElementById('listaCertificados');
const certificadosVazio     = document.getElementById('certificadosVazio');

let filtroAnoAtivo    = 'todos';
let filtroStatusAtivo = 'todos';

function aplicarFiltros() {
    const cards = listaCertificados.querySelectorAll('.certificado_card');
    let visiveis = 0;

    cards.forEach(card => {
        const ano    = card.dataset.ano    || '';
        const status = card.dataset.status || '';

        const passaAno    = filtroAnoAtivo    === 'todos' || ano    === filtroAnoAtivo;
        const passaStatus = filtroStatusAtivo === 'todos' || status === filtroStatusAtivo;

        if (passaAno && passaStatus) {
            card.classList.remove('oculto');
            visiveis++;
        } else {
            card.classList.add('oculto');
        }
    });

    if (certificadosVazio) {
        certificadosVazio.style.display = visiveis === 0 ? 'block' : 'none';
    }
}

function ativarBotaoFiltro(container, btnClicado) {
    container.querySelectorAll('.filtro_btn').forEach(b => b.classList.remove('filtro_btn--ativo'));
    btnClicado.classList.add('filtro_btn--ativo');
}

if (filtroAnoContainer) {
    filtroAnoContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filtro_btn');
        if (!btn) return;
        filtroAnoAtivo = btn.dataset.filtroAno;
        ativarBotaoFiltro(filtroAnoContainer, btn);
        aplicarFiltros();
    });
}

if (filtroStatusContainer) {
    filtroStatusContainer.addEventListener('click', e => {
        const btn = e.target.closest('.filtro_btn');
        if (!btn) return;
        filtroStatusAtivo = btn.dataset.filtroStatus;
        ativarBotaoFiltro(filtroStatusContainer, btn);
        aplicarFiltros();
    });
}

aplicarFiltros();

/* CONTATO (O formulário abre o app de email padrão da pessoa que digitou os dados preenchidos) */
function enviarContato() {
    const nome  = document.getElementById('nomeContato').value.trim();
    const email = document.getElementById('emailContato').value.trim();
    const msg   = document.getElementById('msgContato').value.trim();

    if (!nome || !email || !msg) {
        mostrarToast('Preencha todos os campos antes de enviar!', 'erro');
        return;
    }
    if (!validarEmail(email)) {
        mostrarToast('Digite um e-mail válido.', 'erro');
        return;
    }

    // Monta o link mailto com os dados do formulário
    const assunto = encodeURIComponent(`Contato pelo portfólio - ${nome}`);
    const corpo   = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${msg}`);
    window.location.href = `mailto:moisesmuniz199@gmail.com?subject=${assunto}&body=${corpo}`;

    mostrarToast('Abrindo seu e-mail com a mensagem pronta!', 'sucesso');
    document.getElementById('nomeContato').value = '';
    document.getElementById('emailContato').value = '';
    document.getElementById('msgContato').value = '';
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// TOAST
function mostrarToast(mensagem, tipo) {
    const toastExistente = document.querySelector('.toast_feedback');
    if (toastExistente) toastExistente.remove();

    const toast = document.createElement('div');
    toast.className = `toast_feedback toast_feedback--${tipo}`;
    toast.innerHTML = `
        <i class="fa-solid ${tipo === 'sucesso' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${mensagem}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('toast_feedback--visivel'), 10);
    setTimeout(() => {
        toast.classList.remove('toast_feedback--visivel');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}