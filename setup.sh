#!/bin/bash

# Função para exibir mensagens coloridas
echo_color() {
    echo -e "\e[$1m$2\e[0m"
}

# Verifica se o usuário é root
if [ "$EUID" -ne 0 ]; then
    echo_color 31 "Por favor, execute como root."
    exit 1
fi

# Solicitar informações do usuário
echo_color 34 "Por favor, insira as informações necessárias para configurar o sistema:"
read -p "Digite o domínio (ex: example.com): " DOMAIN
read -p "Digite o email para o Certbot (ex: email@example.com): " CERTBOT_EMAIL
read -p "Digite o API Key do Firebase: " FIREBASE_API_KEY
read -p "Digite o Auth Domain do Firebase: " FIREBASE_AUTH_DOMAIN
read -p "Digite o Project ID do Firebase: " FIREBASE_PROJECT_ID
read -p "Digite o Storage Bucket do Firebase: " FIREBASE_STORAGE_BUCKET
read -p "Digite o Messaging Sender ID do Firebase: " FIREBASE_MESSAGING_SENDER_ID
read -p "Digite o App ID do Firebase: " FIREBASE_APP_ID

# Etapa 1: Limpar o servidor
echo_color 34 "Limpando o servidor..."
if [ -d "/var/www/leadsGestor" ]; then
    echo_color 33 "Removendo repositório existente..."
    rm -rf /var/www/leadsGestor
fi
if [ -f "/etc/nginx/sites-available/$DOMAIN" ]; then
    echo_color 33 "Removendo configuração antiga do Nginx..."
    rm -f "/etc/nginx/sites-available/$DOMAIN"
    rm -f "/etc/nginx/sites-enabled/$DOMAIN"
fi
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo_color 33 "Removendo certificados SSL antigos..."
    certbot delete --cert-name $DOMAIN
fi
if systemctl is-active --quiet apache2; then
    echo_color 33 "Desativando Apache2..."
    systemctl stop apache2
    systemctl disable apache2
    apt purge apache2 -y
    apt autoremove -y
fi

# Etapa 2: Atualizar o sistema
echo_color 34 "Atualizando o sistema..."
apt update && apt upgrade -y

# Etapa 3: Instalar dependências necessárias
echo_color 34 "Instalando dependências..."
apt install -y git curl nginx nodejs npm certbot python3-certbot-nginx

# Etapa 4: Clonar o repositório leadsGestor
echo_color 34 "Clonando o repositório leadsGestor..."
git clone https://github.com/automatefly/leadsGestor.git /var/www/leadsGestor

# Etapa 5: Configurar credenciais do Firebase
echo_color 34 "Configurando credenciais do Firebase..."
cat <<EOF > /var/www/leadsGestor/.env
VITE_API_KEY="$FIREBASE_API_KEY"
VITE_AUTH_DOMAIN="$FIREBASE_AUTH_DOMAIN"
VITE_PROJECT_ID="$FIREBASE_PROJECT_ID"
VITE_STORAGE_BUCKET="$FIREBASE_STORAGE_BUCKET"
VITE_MESSAGING_SENDER_ID="$FIREBASE_MESSAGING_SENDER_ID"
VITE_APP_ID="$FIREBASE_APP_ID"
EOF

# Etapa 6: Instalar dependências do projeto
echo_color 34 "Instalando dependências do projeto..."
cd /var/www/leadsGestor
npm install

# Etapa 7: Build do projeto
echo_color 34 "Gerando build do projeto..."
npm run build

# Etapa 8: Configurar Nginx para o domínio
echo_color 34 "Configurando Nginx para o domínio $DOMAIN..."
cat <<EOF > /etc/nginx/sites-available/$DOMAIN
server {
    listen 80;
    server_name $DOMAIN;

    root /var/www/leadsGestor/dist;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location ~ /\.(ht|git) {
        deny all;
    }
}
EOF
ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Etapa 9: Configurar SSL com Certbot
echo_color 34 "Configurando SSL para $DOMAIN..."
certbot --nginx -d $DOMAIN --email $CERTBOT_EMAIL --non-interactive --agree-tos

# Etapa 10: Finalizar configuração
echo_color 32 "Setup concluído com sucesso!"
echo_color 32 "O sistema leadsGestor foi instalado e configurado no domínio $DOMAIN com SSL ativado."
