# Rinha de Ratos

Jogo web de batalhas entre ratos, feito pelo nosso grupo de quatro pessoas como trabalho acadêmico das matérias de front-end e back-end, entre outubro e dezembro de 2025. Foi o nosso primeiro projeto completo.

> **Projeto preservado.** O código continua como entregamos. Depois da entrega, só mudaram detalhes do repositório: a conexão do banco passou a ser lida por variáveis de ambiente, entrou o `.gitignore` e este README foi reescrito. O que faríamos diferente hoje está em [Olhando hoje](#olhando-hoje).

## O que dá para fazer

- Criar ratos de seis classes, cada uma com atributos e habilidades próprios.
- Entrar nas batalhas que o administrador abre, pagando a inscrição em MouseCoins, ou lutar contra um bot.
- Ver o histórico da batalha rodada a rodada e baixar o relatório em PDF.
- Comprar pacotes de MouseCoins na loja. A compra é simulada, sem pagamento real.
- Ver o ranking dos 10 jogadores com mais vitórias e editar o perfil.
- Como administrador, criar, editar, iniciar e excluir batalhas.

## Destaques técnicos

- **Motor de batalha** (`BackEnd/rinhaRatos/src/main/kotlin/com/unipar/rinhaRatos/battle/`): a luta é simulada no servidor, rodada a rodada, até um rato zerar o HP. A chance de cada habilidade funcionar depende da sorte e dos atributos.
- **Efeitos escritos como texto:** cada habilidade guarda seus efeitos como texto, por exemplo `+18%PASSEU`, e o motor interpreta esse texto com regex. Assim, uma habilidade nova entra só pelo banco, sem mexer no código.
- **Relatórios em PDF** gerados no servidor com o Apache PDFBox.
- **API REST** com 48 endpoints em 8 controllers, separados em controllers, services, repositories e models.

A batalha é calculada de uma vez, e não ao vivo, porque não tínhamos tempo, dentro do prazo do trabalho, para aprender WebSockets. O front-end mostra o resultado e o histórico das rodadas.

## Stack

| Parte | Tecnologias |
| --- | --- |
| Back-end | Kotlin, Spring Boot 3.5 (Web e Data JPA), Apache PDFBox e Java 21 |
| Front-end | React 19, Vite, React Router e Axios |
| Banco | PostgreSQL |

## Como rodar

Você vai precisar do JDK 21, do Node.js e do PostgreSQL.

1. Crie o banco `rinha_de_ratos_DB` no PostgreSQL.
2. Suba o back-end. Na primeira execução, ele cria as tabelas:

   ```bash
   cd BackEnd/rinhaRatos
   ./mvnw spring-boot:run
   ```

   Sem configuração nenhuma, ele conecta em `localhost:5432` com o usuário `postgres` e a senha `root`. Para usar outro banco, defina as variáveis `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`.

3. Rode o `SQL.sql` no banco (pelo PgAdmin, por exemplo). Ele cadastra as classes, as habilidades, os pacotes da loja e as contas do administrador e do bot.
4. Suba o front-end. Ele abre em http://localhost:5173 e chama a API em http://localhost:8080:

   ```bash
   cd FrontEnd/rinhaRatos
   npm install
   npm run dev
   ```

O SQL cria a conta de administrador com e-mail `ADM` e senha `ADM`. As contas de jogador são criadas pela tela de cadastro.

## Documentação da API

Os endpoints estão documentados [neste documento](https://docs.google.com/document/d/1d5bPNbAnuY9BInJl5SNicZwrRkfyn7IoW_Tx8Q9KRNE/edit?usp=sharing).

## Equipe

| Pessoa | Parte |
| --- | --- |
| Gabriel Maran | Back-end completo e planejamento das funcionalidades |
| Paulo Augusto Vieira da Luz Leepkaln | UI/UX e identidade visual no Figma |
| João Pedro Uhry Gonçalves | Front-end: estrutura e estilo |
| Gustavo Grosbelli | Front-end em React, integração com a API e estado global |

## Olhando hoje

Algumas decisões deste projeto nós tomaríamos de outro jeito hoje. Mesmo assim, preferimos não reescrever o código, para ele continuar mostrando o ponto de onde partimos. Por isso, ele não serve de base para nada em produção.

O que mudaríamos:

- **Autenticação:** guardar as senhas com hash e exigir login nas rotas. Hoje as senhas ficam em texto puro e as rotas não conferem quem está chamando.
- **Entrada da API:** usar DTOs validados em todos os endpoints. Hoje, por exemplo, quem define o tipo da conta no cadastro é o cliente.
- **Redefinição de senha:** enviar um token por e-mail, em vez de trocar a senha só a partir do e-mail informado.
- **Erros:** tratar os erros num lugar só, em vez de montar a resposta de erro dentro de cada controller.
- **Testes:** hoje só existe o teste padrão do Spring. O primeiro a ganhar testes seria o motor de batalha.
- **Front-end:** componentes menores, organização por funcionalidade e mais responsividade.
