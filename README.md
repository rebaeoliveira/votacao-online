<div align="center">
  <h1 style="font-size: 4em; font-weight: bold; line-height: 1.2;">
    Democracia Digital na Escola
  </h1>
</div>

<div align="center">
  <h3 style="font-size: 1.5em; font-weight: normal; color: #555;">
    Sistema eleitoral online para eleição do diretor escolar
  </h3>
</div>

---

## 📚 Visão Geral
O objetivo do projeto **Democracia Digital na Escola** é modernizar o processo eleitoral para a escolha de diretores escolares em instituições públicas de ensino. O sistema foi projetado para promover maior eficiência, inclusão, acessibilidade e segurança no processo eleitoral, seguindo as diretrizes legais estabelecidas.

---

## 🎯 Objetivos

1. Disponibilizar acesso remoto da votação aos eleitores.
2. Desenvolver interface amigável e intuitiva para usuários com diferentes níveis de familiaridade tecnológica.
3. Garantir a confidencialidade e segurança dos dados.
4. Incorporar a ponderação de votos de acordo com as legislações legais, garantindo representatividade justa.
5. Automatizar a apuração e publicação dos resultados eleitorais.

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js + Express.js (APIs RESTful para processamento de dados e regras de aplicação).
- **Frontend**: React.js (Interface de usuário dinâmica e interativa).
- **Banco de Dados**: MySQL (Armazenamento e manipulação de dados estruturados).
- **Segurança**:
  - TLS (Transport Layer Security) para comunicação criptografada.
  - Criptografia assimétrica para proteção de dados.
  - Framework bcrypt para gerenciamento de senhas seguras.

---

## ⚙️ Funcionalidades

1. Gerenciamento de eleições, urnas, candidatos e eleitores.
2. Registro e autenticação segura de eleitores.
3. Garantia de que cada eleitor pode votar somente uma vez.
4. Suporte à ponderação de votos entre diferentes segmentos eleitorais.
5. Apuração automática dos votos e geração de relatórios em PDF.

---

## 🖼️ Diagramas

### Diagrama de Casos de Uso
[Casos de Uso](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Casos%20de%20uso.png)

### Diagrama de Classes
[Classes do Sistema](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Classe.png)

### Diagrama de Atividades
- **Administrador**: [Fluxo do Administrador](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Atividades%20administrador.png)
- **Eleitor**: [Fluxo do Eleitor](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Atividades%20eleitor.png)

---

## 🔐 Segurança

1. **Criptografia de Dados**: Criptografia assimétrica para votos.
2. **Hashing de Senhas**: Armazenamento seguro com bcrypt.
3. **TLS**: Segurança no tráfego de rede.

---

## 🧪 Testes e Resultados

Foram realizados testes com diferentes segmentos da comunidade escolar. Resultados:
- **Usabilidade**: 95% dos usuários consideraram o sistema intuitivo e fácil de usar.
- **Acessibilidade**: Sistema avaliado como "muito acessível" pela maioria dos participantes.
- **Eficiência**: O sistema atendeu às expectativas dos usuários em termos de funcionalidade e confiabilidade.

---

## 📊 Expansão e Trabalhos Futuros

- Adaptação para diferentes legislações eleitorais.
- Implementação de um módulo de auditoria robusto para maior transparência.
- Conformidade com as Diretrizes de Acessibilidade WCAG 2.0.

---

## 📁 Estrutura do Projeto

📦 Democracia Digital na Escola  
    ├── 📂 backend/  
    ├── 📂 src (frontend)/  
    ├── 📂 database/  
    └── 📂 docs/

---

## 🚀 Executar o Sistema

### Pré-requisitos
Antes de começar, certifique-se de instalar as seguintes funcionalidades:
- [Node.js](https://nodejs.org)
- [MySQL](https://dev.mysql.com/downloads/)

### 1️⃣ Clonar o Repositório
- **Clonar este repositório para sua máquina local:**
  - git clone https://github.com/rebaeoliveira/votacao-online
- **Navegar até a pasta do projeto:**
  - cd votacao-online
 
### 2️⃣ Configurar o Banco de Dados
- **Criar o banco de dados:**
  - CREATE DATABASE votacao_online;
- **Importar o arquivo SQL de configuração do banco de dados:**
  - mysql -u root -p votacao_online < setup.sql
 
### 3️⃣ Configurar o Backend
- **Navegar até a pasta backend:**
  -  cd backend
- **Instalar as dependências do backend:**
  - npm install
- **Instalar as ferramentas utilizadas no backend:**
  - npm install express
    - Framework para criar API's e gerenciar rotas no Node.js.
  - npm install mysql2
    - Biblioteca para integração com o banco de dados MySQL.
  - npm install bcrypt
    - Biblioteca para hashing seguro de senhas.
  - npm install body-parser
    - Middleware para parsear o corpo das requisições HTTP.
  - npm install cors
    - Permite o compartilhamento de recursos entre diferentes origens (Cross-Origin Resource Sharing).
  - crypto (nativo)
    - Biblioteca do Node.js para criptografia e geração de chaves.
- **Iniciar o servidor backend:**
  - npm start

O servidor será iniciado em http://localhost:3001.  

### 4️⃣ Configurar o Frontend
- **Navegar até a pasta frontend:**
  -  cd votacao-online
- **Instalar as dependências do frontend:**
  - npm install
- **Instalar as ferramentas utilizadas no frontend:**
  - npm install react
    - Biblioteca para criar interfaces de usuário.
  - npm install react-dom
    - Renderiza os componentes React na DOM.
  - npm install react-router-dom
    - Gerenciamento de rotas para navegação no React.
  - npm install axios
    - Biblioteca para realizar requisições HTTP.
  - npm install chart.js
    - Biblioteca para criar gráficos interativos.
  - npm install react-chartjs-2
    - Integração do Chart.js com o React.
  - npm install bootstrap
    - Framework CSS para estilização e design responsivo.
  - npm install jspdf
    - Biblioteca para geração de documentos PDF no frontend.
  - npm install jspdf-autotable
    - Extensão do jsPDF para criação de tabelas no PDF.
- **Iniciar o servidor frontend:**
  - npm start

O sistema estará disponível em http://localhost:3000.

### 5️⃣ Credenciais e Funcionalidades
- **Administrador:** 
  - Usuário: admin
  - Senha: admin123
    - Gerenciar eleições, urnas, candidatos e eleitores.
    - Visualizar resultados em tempo real.
    - Exportar relatórios em PDF.
- **Eleitor:**  
  - Usuário: eleitor
  - Senha: eleitor123
    - Selecionar candidato.
    - votar.            

---

## 📜 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

## 📝 Referências

1. Constituição da República Federativa do Brasil de 1988.
2. Lei de Diretrizes e Bases da Educação Nacional (LDB).
3. Lei Municipal nº 7.410/2022 - Cascavel, Paraná.

---

## 📩 Contato

- **Renivaldo Baessa de Oliveira**: [rebaeoliveira@gmail.com](mailto:rebaeoliveira@gmail.com)

---

Para mais informações, visite o [repositório do projeto](https://github.com/rebaeoliveira/votacao-online).
