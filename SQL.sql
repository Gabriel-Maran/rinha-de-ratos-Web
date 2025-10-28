/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*--------------------- Tabela que precisam ser criadas no DB ------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/

CREATE TABLE loja_Pacotes (
    id_pacote SERIAL PRIMARY KEY,
    nome_pacote VARCHAR(100) NOT NULL,
    mousecoin_quantidade INT NOT NULL,
    preco_brl DECIMAL(10, 2) NOT NULL
);

INSERT INTO loja_Pacotes (nome_pacote, mousecoin_quantidade, preco_brl) VALUES
('Pacote de Moedas Pequeno', 15, 30.00),
('Pacote de Moedas Médio', 30, 60.00),
('Pacote de Moedas Grande', 60, 100.00);

/*------------------------------------------------------------------------------------*/

/* Tabela 2: classes (Os 6 modelos de Rato) */ - Cria e da Insert pelo PgAdmin
CREATE TABLE classes (
    id_classe SERIAL PRIMARY KEY,
    nome_classe VARCHAR(100) NOT NULL,
    apelido VARCHAR(100),
    str_min INT NOT NULL,
    str_max INT NOT NULL,
    agi_min INT NOT NULL,
    agi_max INT NOT NULL,
    hps_min INT NOT NULL,
    hps_max INT NOT NULL,
    int_min INT NOT NULL,
    int_max INT NOT NULL,
    def_min INT NOT NULL,
    def_max INT NOT NULL
);

/* Estes inserts irão gerar os IDs:
   1 = Rato de Esgoto
   2 = Rato de Hospital
   3 = Rato de Laboratório
   4 = Rato de Fazenda
   5 = Rato de Cassino
   6 = Rato de Biblioteca
*/
INSERT INTO classes (nome_classe, apelido, str_min, str_max, agi_min, agi_max, hps_min, hps_max, int_min, int_max, def_min, def_max) VALUES
('Rato de Esgoto', 'O Fedoroso', 55, 70, 35, 55, 50, 65, 20, 40, 35, 50),
('Rato de Hospital', 'Sarna-Médico', 25, 40, 30, 50, 55, 70, 50, 70, 30, 45),
('Rato de Laboratório', 'Cobaia 07', 40, 60, 40, 60, 35, 55, 60, 80, 20, 35),
('Rato de Fazenda', 'Tratorzinho', 60, 80, 25, 45, 55, 70, 20, 40, 40, 60),
('Rato de Cassino', 'Aposta Alta', 35, 55, 45, 65, 30, 50, 55, 75, 25, 35),
('Rato de Biblioteca', 'Folha-rato', 30, 50, 45, 60, 35, 55, 65, 90, 25, 35);

/*------------------------------------------------------------------------------------*/

/* Tabela 3: habilidades (Os 18 modelos de Habilidade) */
CREATE TABLE habilidades (
    id_habilidade SERIAL PRIMARY KEY,
    id_classe INT NOT NULL,
    nome_habilidade VARCHAR(100) NOT NULL,
    descricao TEXT,
    chance_sucesso INT NOT NULL,
    cooldown INT NOT NULL,
    efeito_sucesso_str VARCHAR(255),
    efeito_falha_str VARCHAR(255),
    efetivo_txt VARCHAR(255),
    falha_txt VARCHAR(255),
    FOREIGN KEY (id_classe) REFERENCES classes(id_classe)
);

/* Classe 1: Rato de Esgoto */
INSERT INTO habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(1, 'Leptospirose', '80% de chance de reduzir a DEF do alvo em 18% — efeito apenas nesta rodada. Falha: perde 4% do HP.', 80, 2, '-18%DEFADV', '-4%HPSSEU', 'O cheiro da doença se espalha! A defesa do oponente nesta rodada foi reduzida em 18%.','Autoinfecção! O rato se descuida e perde 4% de HP.'),
(1, 'Nuvem de Lama', '78% de chance de reduzir a AGI do alvo em 20% — efeito apenas nesta rodada. Falha: perde 8% do PA apenas nesta rodada.', 78, 2, '-20%AGIADV', '-8%PASSEU', 'Uma plasta de lodo atinge o alvo! A agilidade do oponente nesta rodada foi reduzida em 20%.','O rato escorrega na própria lama! Seu PA foi reduzido apenas nesta rodada em 8%.'),
(1, 'Fedor Corrosivo', '75% de chance de causar dano direto igual a 8% do HP máximo do alvo (instantâneo). Falha: perde 6% da DEF apenas nesta rodada.', 75, 3, '-8%HPSADV', '-6%DEFSEU', 'O ar se torna tóxico! O oponente sofre corrosão e perde 8% do HP.','O fedor vaza para trás! O rato corrói a própria armadura, perdendo 6% de DEF nesta rodada.');

/* Classe 2: Rato de Hospital */
INSERT INTO habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(2, 'Autocurado', '85% de chance de regenerar 8% do HP máximo — efeito instantâneo. Falha: perde 5% da DEF apenas nesta rodada.', 85, 3, '+8%HPSSEU', '-5%DEFSEU', 'Injeção aplicada! O rato recupera 8% de HP.','A seringa travou! O rato fica mais frágil: -5% DEF nesta rodada.'),
(2, 'Antisséptico', '82% de chance de ganhar +10% PA e +10% PD apenas nesta rodada. Falha: perde 5% do HP.', 82, 2, '+10%PASSEU;+10%PDSSEU', '-5%HPSSEU', 'Limpeza total! +10% PA e +10% PD apenas nesta rodada!','Reação alérgica! O antisséptico causa 5% de dano de HP.'),
(2, 'Escudo Antígeno', '80% de chance de ganhar +15% PD apenas nesta rodada. Falha: perde 7% do HP e -5% DEF apenas nesta rodada.', 80, 2, '+15%PDSSEU', '-7%HPSSEU;-5%DEFSEU', 'Defesas ativadas! +15% PD apenas nesta rodada!','Sobrecarga imunológica! -7% HP e -5% DEF nesta rodada.');

/* Classe 3: Rato de Laboratório */
INSERT INTO habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(3, 'Mutação Aguda', '78% de chance de ganhar +18% PA e +14% DEF apenas nesta rodada. Falha: perde 10% do HP.', 78, 3, '+18%PASSEU;+14%DEFSEU', '-10%HPSSEU', 'Mutação bem-sucedida! +18% PA e +14% DEF apenas nesta rodada!','Mutação instável! O corpo rejeita e o rato perde 10% de HP.'),
(3, 'Soro Experimental', '70% de chance de ganhar +40% de chance crítica apenas nesta rodada. Falha: perde 8% do HP.', 70, 3, '+40%CRISEU', '-8%HPSSEU', 'O soro funciona! +40% chance crítica nesta rodada!','Reação adversa! O soro é tóxico, o rato perde 8% de HP.'),
(3, 'Durateston', '65% de chance de ganhar +45% PA apenas nesta rodada. Falha: perde 12% do HP e -6% DEF apenas nesta rodada.', 65, 3, '+45%PASSEU', '-12%HPSSEU;-6%DEFSEU', 'Explosão de força! +45% PA apenas nesta rodada!','Sobrecarga! -12% HP e -6% DEF nesta rodada.');

/* Classe 4: Rato de Fazenda */
INSERT INTO habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(4, 'Mordida de Saco', '85% de chance de ganhar +18% PA apenas nesta rodada. Falha: perde 5% do HP.', 85, 2, '+18%PASSEU', '-5%HPSSEU', 'Ataque focado! +18% PA nesta rodada!','Dente travado! O rato erra e perde 5% de HP.'),
(4, 'Cascavel de Palha', '80% de chance de ganhar +18% DEF apenas nesta rodada. Falha: perde 8% da AGI apenas nesta rodada.', 80, 2, '+18%DEFSEU', '-8%AGISEU', 'Entrincheirado! +18% DEF nesta rodada!','Desequilíbrio! -8% AGI apenas nesta rodada.'),
(4, 'Saracoteia Rural', '75% de chance de reduzir a AGI do alvo em 14% e a STR em 9% apenas nesta rodada. Falha: perde 8% da AGI apenas nesta rodada.', 75, 3, '-14%AGIADV;-9%STRADV', '-8%AGISEU', 'Dança confusa! O oponente perde 14% AGI e 9% STR nesta rodada!','Tropeção! O rato perde 8% AGI apenas nesta rodada.');

/* Classe 5: Rato de Cassino */
INSERT INTO habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(5, 'Dado Viciado', '70% de chance de ganhar +40% de chance crítica apenas nesta rodada. Falha: perde 8% do PA apenas nesta rodada.', 70, 3, '+40%CRISEU', '-8%PASSEU', 'A sorte sorri! +40% crítico nesta rodada!','Fumble! Os dados saem ruins, -8% PA apenas nesta rodada.'),
(5, 'Trapaceiro', '70% de chance de roubar 8% do HP do oponente (dano + cura instantânea) — efeito instantâneo. Falha: perde 8% do HP.', 70, 2, '+8%HPSSEU;-8%HPSADV', '-8%HPSSEU', 'Trapaça perfeita! Rato drena 8% do HP do alvo e ganha a mesma quantidade.','Pego no ato! O rato é punido e perde 8% de HP.'),
(5, 'All-in', '50% de chance de multiplicar o PA por 3 (PA x3) apenas nesta rodada. Falha: sofre -40% PD e perde 10% do HP.', 50, 4, '+300PASSEU', '-40%PDSSEU;-10%HPSSEU', 'Tudo ou nada! PA é multiplicado por 3 apenas nesta rodada!','Aposta perdida! -40% PD e -10% HP.');

/* Classe 6: Rato de Biblioteca */
INSERT INTO habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(6, 'Mente de Arquivo', '80% de chance de ganhar +22% INT apenas nesta rodada. Falha: perde 6% da STR apenas nesta rodada.', 80, 2, '+22%INTSEU', '-6%STRSEU', 'Conhecimento é poder! +22% INT nesta rodada!','Esforço mental! -6% STR apenas nesta rodada.'),
(6, 'Páginas Cortantes', '75% de chance de ignorar 18% da DEF do alvo apenas nesta rodada. Falha: perde 6% do HP.', 75, 3, '-18%DEFADV', '-6%HPSSEU', 'Corte preciso! Ignora 18% da DEF do oponente nesta rodada!','Página cortante volta contra: -6% HP.'),
(6, 'Mapa das Falhas', '75% de chance de ganhar +11% PA e +9% PD apenas nesta rodada. Falha: perde 5% da INT apenas nesta rodada e 4% do HP.', 75, 2, '+11%PASSEU;+9%PDSSEU', '-5%INTSEU;-4%HPSSEU', 'Pontos vitais expostos! +11% PA e +9% PD nesta rodada!','Leitura errada! -5% INT nesta rodada e -4% HP.');

/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------- Tabela que NÃO precisam ser criadas no DB ----------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/

/* Tabela 1: Usuários (Jogadores e ADMs) */ - Cria no Spring
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_conta ENUM('jogador', 'adm') NOT NULL DEFAULT 'jogador',
    mousecoin_saldo INT NOT NULL DEFAULT 30
);

/* Tabela 4: ratos (As instâncias criadas pelos jogadores - Máx 3 por jogador) */ - Cria no Spring
CREATE TABLE ratos (
    id_rato SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_classe INT NOT NULL,
    id_habilidade_escolhida INT NOT NULL,
    nome_customizado VARCHAR(100) NOT NULL,
    descricao TEXT,
    str_base INT NOT NULL,
    agi_base INT NOT NULL,
    hps_base INT NOT NULL,
    int_base INT NOT NULL,
    def_base INT NOT NULL,
    esta_vivo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classes(id_classe),
    FOREIGN KEY (id_habilidade_escolhida) REFERENCES habilidades(id_habilidade)
);

/* Tabela 5: batalhas (As salas de batalha 1x1 criadas pelos ADMs) */ - Cria no Spring
CREATE TABLE batalhas (
    id_batalha SERIAL PRIMARY KEY,
    id_adm_criador INT NOT NULL,
    nome_batalha VARCHAR(255) NOT NULL,
    data_horario_inicio TIMESTAMP NOT NULL,
    custo_inscricao INT NOT NULL,
    premio_total INT NOT NULL,
    status ENUM('InscricoesAbertas', 'InscricoesFechadas','EmAndamento', 'Concluida') NOT NULL,
    
    /* Dados dos participantes (preenchidos quando entram) */
    id_jogador1 INT NULL,
    id_rato1 INT NULL,
    id_jogador2 INT NULL,
    id_rato2 INT NULL,
    
    /* Dados do resultado (preenchidos ao concluir) */
    id_vencedor INT NULL,
    id_perdedor INT NULL,
    
    FOREIGN KEY (id_adm_criador) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_jogador1) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_rato1) REFERENCES ratos(id_rato),
    FOREIGN KEY (id_jogador2) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_rato2) REFERENCES ratos(id_rato),
    FOREIGN KEY (id_vencedor) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_perdedor) REFERENCES usuarios(id_usuario)
);

/*------------------------------------------------------------------------------------*/