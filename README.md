# Sistema de Gestão de Leads

Sistema web para gestão de leads com interface Kanban, desenvolvido com React, Firebase e Tailwind CSS.

## Funcionalidades

- Autenticação de usuários
- Dashboard Kanban personalizado
- Gestão de leads por organização
- Drag and drop de cards
- Sistema de notas por lead
- Personalização de colunas
- Interface responsiva

## Tecnologias

- React
- TypeScript
- Firebase (Auth e Firestore)
- Tailwind CSS
- Zustand
- React Hook Form
- Lucide Icons

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/automatefly/leadsGestor.git
cd leadsGestor
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com suas credenciais do Firebase.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Deploy

Para fazer deploy em produção:

1. Build do projeto:
```bash
npm run build
```

2. Use os scripts na pasta `setup/` para configurar o servidor:
```bash
./setup/install.sh
./setup/deploy.sh
```

## Licença

MIT
