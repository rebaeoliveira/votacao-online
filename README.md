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

## 🖼️ Diagramas do Sistema

### Diagrama de Casos de Uso
[Casos de Uso](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Casos%20de%20uso.png)

### Diagrama de Classes
[Classes do Sistema](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Classe.png)

### Diagrama de Atividades
- **Administrador**: [Fluxo do Administrador](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Atividades%20administrador.png)
- **Eleitor**: [Fluxo do Eleitor](https://github.com/rebaeoliveira/votacao-online/blob/master/docs/Atividades%20eleitor.png)

---

## 🔐 Segurança do Sistema

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
