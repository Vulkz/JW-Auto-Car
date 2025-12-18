// main.js - validação simples do formulário e integração com EmailJS
// Instruções: confirme no painel EmailJS o `service ID`, `template ID` e a `public key` (user ID).

document.addEventListener('DOMContentLoaded', function () {
    // EmailJS configuration (substitua pelos valores da sua conta, se necessário)
    const EMAILJS_USER_ID = 'AARyxJ9zSu_dUKrkL';
    const SERVICE_ID = 'service_d1dipsp';
    const TEMPLATE_ID = 'template_fragdiq';

  try {
    if (EMAILJS_USER_ID) {
        emailjs.init(EMAILJS_USER_ID);
        console.log('EmailJS inicializado com public key.');
    } else {
        console.warn('EmailJS user ID não configurado.');
    }
} catch (err) {
    console.warn('Erro ao inicializar EmailJS:', err);
}

    const form = document.getElementById('contactForm');

    function showStatus(message, isError) {
        let status = form.querySelector('.form-status');
        if (!status) {
            status = document.createElement('div');
            status.className = 'form-status';
            status.style.marginTop = '10px';
            form.appendChild(status);
        }
        status.textContent = message;
        status.style.color = isError ? '#c00' : '#080';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const sobrenome = document.getElementById('sobrenome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || !sobrenome || !email || !telefone) {
            showStatus('Por favor, preencha todos os campos obrigatórios.', true);
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        showStatus('Enviando solicitação...', false);

        // Se EmailJS estiver disponível e configurado, enviar via sendForm (mapeia inputs pelo atributo name)
        if (window.emailjs && SERVICE_ID && TEMPLATE_ID && TEMPLATE_ID !== 'YOUR_TEMPLATE_ID') {
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
                .then(function (response) {
                    console.log('EmailJS SUCCESS', response);
                    showStatus('Solicitação enviada com sucesso! Entraremos em contato.', false);
                    form.reset();
                    submitBtn.disabled = false;
                })
                .catch(function (error) {
                    console.error('EmailJS FAILED', error);
                    showStatus('Erro ao enviar via EmailJS. Abrindo cliente de e-mail como alternativa...', true);
                    submitBtn.disabled = false;
                    // fallback: abrir mailto com os dados preenchidos
                    const subject = encodeURIComponent('Solicitação de Orçamento - ' + nome + ' ' + sobrenome);
                    const body = encodeURIComponent(`Nome: ${nome} ${sobrenome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`);
                    // Dar um pequeno atraso para o usuário ver a mensagem antes de redirecionar
                    setTimeout(function () {
                        window.location.href = `mailto:contato@jwautocar.com?subject=${subject}&body=${body}`;
                    }, 800);
                });
        } else {
            // EmailJS não disponível/configurado corretamente — usar fallback mailto
            console.warn('EmailJS não disponível ou não configurado corretamente; usando mailto fallback.');
            showStatus('EmailJS não configurado. Abrindo cliente de e-mail...', true);
            const subject = encodeURIComponent('Solicitação de Orçamento - ' + nome + ' ' + sobrenome);
            const body = encodeURIComponent(`Nome: ${nome} ${sobrenome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`);
            setTimeout(function () {
                window.location.href = `mailto:lucymaosdefada@gmail.com?subject=${subject}&body=${body}`;
            }, 400);
        }
    });
});
