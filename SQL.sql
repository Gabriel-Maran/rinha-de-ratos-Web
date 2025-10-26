/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*--------------------- Tabela que precisam ser criadas no DB ------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/

CREATE TABLE Loja_Pacotes (
    id_pacote SERIAL PRIMARY KEY,
    nome_pacote VARCHAR(100) NOT NULL,
    mousecoin_quantidade INT NOT NULL,
    preco_brl DECIMAL(10, 2) NOT NULL
);

INSERT INTO Loja_Pacotes (nome_pacote, mousecoin_quantidade, preco_brl) VALUES
('Pacote de Moedas Pequeno', 15, 30.00),
('Pacote de Moedas Médio', 30, 60.00),
('Pacote de Moedas Grande', 60, 100.00);

/*------------------------------------------------------------------------------------*/

/* Tabela 2: Classes (Os 6 modelos de Rato) */ - Cria e da Insert pelo PgAdmin
CREATE TABLE Classes (
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
INSERT INTO Classes (nome_classe, apelido, str_min, str_max, agi_min, agi_max, hps_min, hps_max, int_min, int_max, def_min, def_max) VALUES
('Rato de Esgoto', 'O Fedoroso', 55, 70, 35, 55, 50, 65, 20, 40, 35, 50),
('Rato de Hospital', 'Sarna-Médico', 25, 40, 30, 50, 55, 70, 50, 70, 30, 45),
('Rato de Laboratório', 'Cobaia 07', 40, 60, 40, 60, 35, 55, 60, 80, 20, 35),
('Rato de Fazenda', 'Tratorzinho', 60, 80, 25, 45, 55, 70, 20, 40, 40, 60),
('Rato de Cassino', 'Aposta Alta', 35, 55, 45, 65, 30, 50, 55, 75, 25, 35),
('Rato de Biblioteca', 'Folha-rato', 30, 50, 45, 60, 35, 55, 65, 90, 25, 35);

/*------------------------------------------------------------------------------------*/

/* Tabela 3: Habilidades (Os 18 modelos de Habilidade) */
CREATE TABLE Habilidades (
    id_habilidade SERIAL PRIMARY KEY,
    id_classe INT NOT NULL,
    nome_habilidade VARCHAR(100) NOT NULL,
    descricao TEXT, -- <<< CAMPO ADICIONADO
    chance_sucesso INT NOT NULL,
    cooldown INT NOT NULL,
    efeito_sucesso_str VARCHAR(255),
    efeito_falha_str VARCHAR(255),
    efetivo_txt VARCHAR(255),
    falha_txt VARCHAR(255),
    FOREIGN KEY (id_classe) REFERENCES Classes(id_classe)
);

/* Classe 1: Rato de Esgoto */
INSERT INTO Habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str,efetivo_txt,falha_txt) VALUES
(1, 'Leptospirose', '85% de chance de Reduzir a DEF do alvo em 18%. Falha: Perde 5% do HP.', 85, 2, '-18DEFADVAGR', '-5HPSSEUAGR','O cheiro da doença se espalha! A defesa do oponente foi reduzida em 18%!','Autoinfecção! O rato se descuida e perde 5% de HP.'),
(1, 'Nuvem de Lama', '80% de chance de Reduzir a AGI do alvo em 20%. Falha: Perde 10% do PA.', 80, 2, '-20AGIADVAGR', '-10PASSEUAGR','Uma plasta de lodo acerta o alvo! A agilidade do oponente foi reduzida em 20%!','O rato escorrega na própria lama! Seu poder de ataque (PA) foi reduzido em 10%.'),
(1, 'Fedor Corrosivo', '75% de chance de causar Dano Direto (8% do HP máx. do alvo) no final da rodada. Falha: Perde 10% da DEF.', 75, 3, NULL, '-10DEFSEUAGR'.'O ar se torna tóxico! O oponente sofre corrosão e levará 8% de dano direto no final da rodada!','O fedor vaza para trás! O rato corrói a própria armadura, perdendo 10% de DEF.');

/* Classe 2: Rato de Hospital */
INSERT INTO Habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str,efetivo_txt,falha_txt) VALUES
(2, 'Autocurado', '85% de chance de Regenerar 2-5% do HP máx. agora e mais 2-5% no próximo round. Falha: Perde 6% da DEF no próximo round.', 85, 3, '+5HPSSEUAGR;+5HPSSEUPROX', '-6DEFSEUPROX','Injeção aplicada! O rato recupera 2-5% de HP agora e mais 2-5% no próximo round!"','A seringa quebrou! A tentativa falha deixa o rato vulnerável, reduzindo sua DEF em 6% no próximo round.'),
(2, 'Antisséptico', '85% de chance de ganhar +10% PA e +10% PD% neste round. Falha: Perde 6% do HP.', 85, 2, '+10PASSEUAGR;+10PDSSEUAGR', '-6HPSSEUAGR','Limpeza total! O rato ganha +10% de PA e +10% de PD% neste round!','Reação alérgica! O antisséptico causa dano, e o rato perde 6% de HP.'),
(2, 'Escudo Antígeno', '80% de chance de ganhar +15 pontos de PD% neste round. Falha: Perde 8% do HP e 6% da DEF.', 80, 2, '+15PDSSEUAGR', '-8HPSSEUAGR;-6DEFSEUAGR','Defesas ativadas! O rato ganha +15 pontos de PD% neste round!','Sobrecarga imunológica! O escudo falha, causando 8% de dano de HP e reduzindo a DEF em 6%.');

/* Classe 3: Rato de Laboratório */
INSERT INTO Habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str,efetivo_txt,falha_txt) VALUES
(3, 'Mutação Aguda', '80% de chance de ganhar +20% PA e +15% DEF neste round. Falha: Perde 12% do HP.', 80, 3, '+20PASSEUAGR;+15DEFSEUAGR', '-12HPSSEUAGR','A mutação funcionou! O rato ganha +20% de PA e +15% de DEF neste round!','Mutação instável! O corpo rejeita a mudança, e o rato perde 12% de HP.'),
(3, 'Soro Experimental', '75% de chance de ganhar +20 pontos de Chance de Crítico e seu crítico causa x2.5 de dano. Falha: Perde 8% do HP.', 75, 3, '+20CRISSEUAGR', '-8HPSSEUAGR','O soro faz efeito! O rato ganha +20% de chance de crítico, e seus críticos agora causam 2.5x de dano!','Reação adversa! O soro é tóxico, e o rato perde 8% de HP.'),
(3, 'Durrateston', '70% de chance de ganhar +60% PA neste round. Falha: Perde 15% do HP e 10% da DEF.', 70, 3, '+60PASSEUAGR', '-15HPSSEUAGR;-10DEFSEUAGR','MÚSCULOS! O rato ganha +60% de PA para um ataque devastador!','Sobrecarga! O corpo não aguenta, e o rato perde 15% de HP e 10% de DEF.');

/* Classe 4: Rato de Fazenda */
INSERT INTO Habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str,efetivo_txt,falha_txt) VALUES
(4, 'Mordida de Saco', '85% de chance de ganhar +20% PA neste round. Falha: Perde 6% do HP.', 85, 2, '+20PASSEUAGR', '-6HPSSEUAGR','Ataque focado! O rato ganha +20% de PA neste round!','Dente travado! O rato morde errado e perde 6% de HP.'),
(4, 'Cascavel de Palha', '80% de chance de ganhar +20% DEF neste round. Falha: Perde 10% da AGI.', 80, 2, '+20DEFSEUAGR', '-10AGISEUAGR','Entrincheirado! O rato se esconde na palha e ganha +20% de DEF!','Desequilíbrio! O rato tropeça na palha e perde 10% de AGI.'),
(4, 'Saracoteia Rural', '75% de chance de Reduzir a AGI do alvo em 15% e a STR em 10%. Falha: Perde 10% da AGI.', 75, 3, '-15AGIADVAGR;-10STRADVAGR', '-10AGISEUAGR','Dança confusa! O oponente fica tonto, perdendo 15% de AGI e 10% de STR!','Tropeção! O rato erra os passos da dança e perde 10% da própria AGI.');

/* Classe 5: Rato de Cassino */
INSERT INTO Habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str,efetivo_txt,falha_txt) VALUES
(5, 'Dado Viciado', '75% de chance de ganhar +20 pontos de Chance de Crítico e seu crítico causa x2.5 de dano. Falha: Perde 10% do PA.', 75, 3, '+20CRISSEUAGR', '-10PASSEUAGR','"A sorte está lançada! O rato ganha +20% de chance de crítico, e seus críticos causam 2.5x de dano!','Fumble! Os dados rolam mal, e o rato perde 10% de PA.'),
(5, 'Trapaceiro', '70% de chance de Anular a habilidade do oponente. Se ele não usar, ganha +15% PA. Falha: Perde 10% do HP.', 70, 2, NULL, '-10HPSSEUAGR'.'Trapaça perfeita! A habilidade do oponente foi anulada! ou O oponente não usou habilidade, então o rato ganha +15% de PA!','Pego no ato! O oponente percebe a trapaça e ataca, causando 10% de dano de HP.'),
(5, 'All-in', '60% de chance de multiplicar seu PA por 3.0 (300%) neste round. Falha: Perde 40 pontos de PD% e 10% do HP.', 60, 4, NULL, '-40PDSSEUAGR;-10HPSSEUAGR','TUDO OU NADA! O rato aposta tudo e seu PA é multiplicado por 3.0x neste round!','Aposta perdida! O rato fica totalmente vulnerável (-40 PD%) e perde 10% de HP!');

/* Classe 6: Rato de Biblioteca */
INSERT INTO Habilidades (id_classe, nome_habilidade, descricao, chance_sucesso, cooldown, efeito_sucesso_str, efeito_falha_str,efetivo_txt,falha_txt) VALUES
(6, 'Mente de Arquivo', '82% de chance de ganhar +25% INT neste round. Falha: Perde 8% da STR.', 82, 2, '+25INTSEUAGR', '-8STRSEUAGR','Conhecimento é poder! O rato ganha +25% de INT neste round!','Esforço mental! O rato força demais o cérebro e perde 8% de STR.'),
(6, 'Páginas Cortantes', '78% de chance de Ignorar 20% da DEF do alvo neste round. Falha: Perde 8% do HP.', 78, 3, '-20DEFADVAGR', '-8HPSSEUAGR','Corte preciso! O ataque ignora 20% da DEF do oponente!','Página emperrada! O rato se corta com o papel e perde 8% de HP.'),
(6, 'Mapa das Falhas', '75% de chance de ganhar +12% PA e +10% PD% neste round. Falha: Perde 6% da INT e 5% do HP.', 75, 2, '+12PASSEUAGR;+10PDSSEUAGR', '-6INTSEUAGR;-5HPSSEUAGR','Pontos vitais expostos! O rato ganha +12% de PA e +10% de PD%!','Leitura errada! O mapa estava de cabeça para baixo. O rato perde 6% de INT e 5% de HP.');

/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------- Tabela que NÃO precisam ser criadas no DB ----------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/

/* Tabela 1: Usuários (Jogadores e ADMs) */ - Cria no Spring
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_conta ENUM('jogador', 'adm') NOT NULL DEFAULT 'jogador',
    mousecoin_saldo INT NOT NULL DEFAULT 30
);

/* Tabela 4: Ratos (As instâncias criadas pelos jogadores - Máx 3 por jogador) */ - Cria no Spring
CREATE TABLE Ratos (
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
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES Classes(id_classe),
    FOREIGN KEY (id_habilidade_escolhida) REFERENCES Habilidades(id_habilidade)
);

/* Tabela 5: Batalhas (As salas de batalha 1x1 criadas pelos ADMs) */ - Cria no Spring
CREATE TABLE Batalhas (
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
    
    FOREIGN KEY (id_adm_criador) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_jogador1) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_rato1) REFERENCES Ratos(id_rato),
    FOREIGN KEY (id_jogador2) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_rato2) REFERENCES Ratos(id_rato),
    FOREIGN KEY (id_vencedor) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_perdedor) REFERENCES Usuarios(id_usuario)
);

/*------------------------------------------------------------------------------------*/