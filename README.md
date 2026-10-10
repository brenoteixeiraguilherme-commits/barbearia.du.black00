# Barbearia Du Black

Site estático responsivo para a Barbearia Du Black.

## Conteúdo
- Página inicial com identidade visual urbana, preto, dourado e detalhes verdes.
- Catálogo ilustrativo de cortes e tabela de preços editáveis.
- Formulário de consulta de horário com encaminhamento para WhatsApp.
- Seções sobre, galeria, avaliações-placeholder, perguntas frequentes e contato.
- Configurações locais acessadas no rodapé em **Configurar site**.

## Importante antes de usar em produção
O agendamento está em **modo demonstração**. Não grava reservas em banco de dados e não bloqueia horários ocupados. Os preços, o endereço e o número do WhatsApp configurados no painel atual são salvos apenas no navegador local e não alteram a configuração para todos os visitantes.

Para receber agendamentos reais, conectar um banco de dados (por exemplo, Supabase/Postgres), criar autenticação administrativa e validar a disponibilidade no servidor com uma restrição única para barbeiro/data/horário.

## Publicar no Vercel
Importe este repositório no Vercel. Como é um site HTML/CSS/JS estático, não precisa de comando de build; use `index.html` como página inicial.
