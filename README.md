# LeadsGestor

LeadsGestor é uma aplicação web projetada para gerenciamento de leads com interface em estilo Kanban, utilizando **React**, **Firebase** e **Tailwind CSS**. Este repositório contém o código-fonte e um script de setup automatizado para facilitar a instalação e configuração em qualquer servidor.

## Recursos

- Gerenciamento visual de leads com Kanban.
- Integração com Firebase para autenticação, banco de dados e armazenamento.
- Configuração automatizada para domínio customizado com suporte a SSL.

## Requisitos do Sistema

- Servidor Linux (Ubuntu recomendado).
- Node.js e npm instalados.
- Nginx para servir o aplicativo em produção.
- Certbot para configuração de SSL (Let’s Encrypt).

## Configuração Automática com o Script de Setup

Este repositório inclui um script de setup (`setup.sh`) que automatiza o processo de instalação e configuração.

### Passos para Executar o Setup

1. Clone este repositório:
   ```bash
   git clone https://github.com/automatefly/leadsGestor.git
   cd leadsGestor
   ```

2. Torne o script de setup executável:
   ```bash
   chmod +x setup.sh
   ```

3. Execute o script:
   ```bash
   sudo ./setup.sh
   ```

4. Insira as informações solicitadas:
   - **Domínio**: O domínio onde deseja hospedar o aplicativo (ex: `example.com`).
   - **E-mail**: Endereço de e-mail para o Certbot (para notificações sobre SSL).
   - **Credenciais do Firebase**: Inclua as chaves de configuração do Firebase (API Key, Auth Domain, Project ID, etc.).

### O que o Script Faz

1. Limpa o servidor, removendo quaisquer configurações, certificados SSL ou repositórios antigos que possam causar conflitos.
2. Instala todas as dependências necessárias: Git, Node.js, npm, Nginx, Certbot, entre outras.
3. Clona o repositório na pasta `/var/www/leadsGestor`.
4. Configura as credenciais do Firebase em um arquivo `.env`.
5. Instala as dependências do projeto com `npm install`.
6. Gera o build da aplicação com `npm run build`.
7. Configura o Nginx para servir o aplicativo no domínio especificado.
8. Configura e ativa o SSL para o domínio usando o Certbot.

## Configuração Manual

Se preferir configurar manualmente, siga os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/automatefly/leadsGestor.git
   cd leadsGestor
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as credenciais do Firebase:
   ```env
   VITE_API_KEY="<sua-api-key>"
   VITE_AUTH_DOMAIN="<seu-auth-domain>"
   VITE_PROJECT_ID="<seu-project-id>"
   VITE_STORAGE_BUCKET="<seu-storage-bucket>"
   VITE_MESSAGING_SENDER_ID="<seu-messaging-sender-id>"
   VITE_APP_ID="<seu-app-id>"
   ```

4. Gere o build do projeto:
   ```bash
   npm run build
   ```

5. Configure o Nginx para servir o diretório `dist` gerado.

6. Configure o SSL com o Certbot.

## Notas Importantes

- Certifique-se de que o domínio fornecido no script esteja apontando para o IP do servidor antes de rodar o setup.
- O script é projetado para facilitar a instalação em ambientes limpos; se já houver configurações no servidor, elas podem ser sobrescritas.

## Suporte

Se encontrar algum problema ou tiver dúvidas, abra uma issue neste repositório ou entre em contato com o suporte.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais informações.

