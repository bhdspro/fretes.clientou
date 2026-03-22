const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// CONFIGURAÇÃO DE SEGURANÇA (CORS)
app.use(cors({
    origin: ['https://clientou.grupobhds.com', 'http://clientou.grupobhds.com', 'http://127.0.0.1:5500', 'http://localhost:3000', 'https://clientou.online', 'http://clientou.online']
}));

app.post('/send-message', async (req, res) => {
    const data = req.body;
    const prestadorId = data.prestadorId;

    // Busca o número do prestador configurado nas "Environment Variables" do Render
    // Exemplo: no painel do Render, você cria a chave prestador921 com valor 5511999999999
    const phone = process.env[prestadorId];

    if (!phone) {
        console.error(`ERRO: Número não encontrado para a variável: ${prestadorId}`);
        return res.status(404).json({ 
            success: false, 
            error: `O prestador '${prestadorId}' não está configurado no servidor.` 
        });
    }

    console.log(`Gerando link do WhatsApp para: ${phone}`); 

    // Montando a mensagem com os dados preenchidos
    const message = 
        `⚡ *NOVA SOLICITAÇÃO*\n\n` +
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
        `Quer receber novos clientes diariamente? Acesse https://vip.clientou.online/clientou`;

    // Codifica o texto para o formato de URL e cria o link do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Retorna o link para o frontend, para que ele abra o app do WhatsApp no celular/PC do cliente
    res.status(200).json({ success: true, whatsappLink: waLink });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CLIENTOU! FRETE Backend ativo na porta ${PORT}`);
});