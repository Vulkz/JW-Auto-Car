// main.js - validação simples do formulário e integração de exemplo com EmailJS
// Instruções: substitua 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID' e 'YOUR_USER_ID' pelos valores do EmailJS.

document.addEventListener('DOMContentLoaded', function () {
    // EmailJS configuration
    // Substitua 'YOUR_EMAILJS_USER_ID' pelo seu user ID (public key) do EmailJS
    // Substitua 'YOUR_TEMPLATE_ID' pelo template ID criado no EmailJS
    const EMAILJS_USER_ID = 'AARyxJ9zSu_dUKrkL';
    const SERVICE_ID = 'service_d1dipsp'; // fornecido
    const TEMPLATE_ID = 'template_k3fo05l';

    if (window.emailjs) {
        if (EMAILJS_USER_ID && EMAILJS_USER_ID !== 'YOUR_EMAILJS_USER_ID') {
            emailjs.init(EMAILJS_USER_ID);
        } else {
            console.warn('EmailJS user ID não configurado — configure EMAILJS_USER_ID em Js/main.js para usar envio via EmailJS.');
        }
    }

    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const sobrenome = document.getElementById('sobrenome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || !sobrenome || !email || !telefone) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Exemplo de template params para EmailJS
        const templateParams = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            telefone: telefone,
            mensagem: mensagem
        };

        // Usar EmailJS se disponível e configurado
        if (window.emailjs && SERVICE_ID && TEMPLATE_ID && TEMPLATE_ID !== 'YOUR_TEMPLATE_ID') {
            // desabilita botão enquanto envia
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Solicitação enviada com sucesso! Entraremos em contato.');
                    form.reset();
                    btn.disabled = false;
                }, function (error) {
                    console.error('FAILED...', error);
                    alert('Erro ao enviar via EmailJS. Verifique sua configuração ou tente novamente.');
                    btn.disabled = false;
                });
        } else {
            // Fallback: abrir mailto com os dados (útil para testar sem API)
            const subject = encodeURIComponent('Solicitação de Orçamento - ' + nome + ' ' + sobrenome);
            const body = encodeURIComponent(`Nome: ${nome} ${sobrenome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`);
            window.location.href = `mailto:contato@jwautocar.com?subject=${subject}&body=${body}`;
        }
    });
});
