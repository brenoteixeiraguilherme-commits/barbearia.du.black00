# Barbearia Du Black

Site responsivo para a Barbearia Du Black, com identidade preto/branco/dourado e detalhes verdes, serviços e preços, catálogo de cortes, galeria, apresentação, contato, formulário de agendamento e configuração local.

## O que já está no projeto
- Site estático em `index.html`, responsivo para celular e computador.
- Catálogo de serviços e cortes com preços iniciais editáveis.
- WhatsApp configurável e endereço com link para o Google Maps.
- Formulário ligado à rota `/api/bookings`.
- API serverless em `api/bookings.js` para registrar agendamentos no Supabase.
- Estrutura de banco em `schema.sql`, com restrição para impedir sobreposição de reservas do mesmo barbeiro.
- Configuração de deploy para Vercel em `vercel.json`.

## Ativar agendamentos reais
O agendamento **não estará ativo até configurar o Supabase e as variáveis no Vercel**:

1. Crie um projeto Supabase.
2. No SQL Editor do Supabase, execute o conteúdo de `schema.sql`.
3. No projeto Vercel, adicione as variáveis de ambiente:
   - `SUPABASE_URL`: URL do projeto Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: chave service-role do Supabase. Mantenha-a somente nas variáveis privadas do servidor; nunca coloque essa chave no HTML.
4. Faça um novo deploy e teste uma reserva e duas tentativas para o mesmo horário.

A API retorna erro se o Supabase não estiver configurado. O site não deve afirmar que uma reserva foi feita sem receber confirmação do servidor.

## Limitações que ainda precisam ser resolvidas
- O painel atual de preços/endereço/WhatsApp salva no navegador local; não é um painel administrativo global, com login e banco.
- O horário é validado no servidor, mas a interface ainda não consulta e oculta previamente todos os horários já ocupados.
- O endereço, o WhatsApp e as redes sociais oficiais devem ser informados pelo proprietário antes da publicação.
- Substitua as fotos ilustrativas pelas fotos reais da barbearia e do barbeiro antes de publicar.
- As avaliações estão como espaços reservados; só publique depoimentos reais com autorização.
- A marca SVG é provisória e deve ser substituída pela logo oficial, se necessário.

## Deploy
Importe este repositório no Vercel. É um site HTML com uma rota serverless em `api/bookings.js`. Após configurar as variáveis de ambiente e o SQL, faça redeploy.
