const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// CONFIGURAÇÃO DE SEGURANÇA (CORS) - Liberado para evitar erros de conexão
app.use(cors());

app.post('/send-message', async (req, res) => {
    const data = req.body;
    const prestadorId = data.prestadorId; // Variável que busca o número
    const nomeUrl = data.prestadorNomeUrl || 'clientou'; // Nome que vai no link

    // Busca o número do prestador configurado nas variáveis (ex: prestador921)
    const phone = process.env[prestadorId];

    if (!phone) {
        console.error(`ERRO: Número não encontrado para a variável: ${prestadorId}`);
        return res.status(404).json({ 
            success: false, 
            error: `O prestador '${prestadorId}' não está configurado no servidor.` 
        });
    }

    console.log(`Gerando link do WhatsApp para ID: ${prestadorId} | Nome Url: ${nomeUrl}`); 

    // Montando a mensagem com os dados e o link promocional dinâmico
    // O emoji de raio (⚡) foi substituído pelo código Unicode \u26A1 para evitar erros de codificação
    const message = 
        `\u26A1 *NOVA SOLICITAÇÃO*\n\n` +
        `- *Cliente:* ${data.name ? data.name.toUpperCase() : 'NÃO INFORMADO'}\n` +
        `- *WhatsApp:* ${data.phone}\n\n` +
        `- *Tipo de Frete:* ${data.type} - ${data.model}\n` +
        `- *Local de Origem:* ${data.origin}\n` +
        `- *Local de Destino:* ${data.destination}\n` +
        `- *Área Acessível:* ${data.issue}\n\n` +
        `- *Precisa de Ajudante:* ${data.helper}\n` +
        `- *Quando Retirar:* ${data.schedule}\n` +
        `- *Forma de Pagamento:* ${data.payment}\n` +
        `- *Observações:* ${data.notes || 'Nenhuma'}\n\n` +
        `Quer receber novos clientes diariamente? Acesse https://vip.clientou.online/${nomeUrl}`;

    // Codifica o texto para o formato de URL e cria o link do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Retorna o link para o frontend
    res.status(200).json({ success: true, whatsappLink: waLink });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CLIENTOU! FRETE Backend ativo na porta ${PORT}`);
});