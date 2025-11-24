/* ------------- PRIMEIRO EXECUTE O BACK END, DEPOIS FAÇA ESTES INSERTS NO PGADMIN -------------*/

-- 1. CLASSES
INSERT INTO classes (id_classe, nome_classe, descricao, apelido, str_min, str_max, agi_min, agi_max, hps_min, hps_max, int_min, int_max, def_min, def_max) VALUES
(1, 'Rato de Esgoto', 'Sobrevive nas sombras, usando lama e toxinas para corroer defesas; brutal e imprevisível.','O Fedoroso', 50, 65, 40, 55, 200, 240, 25, 40, 30, 45),
(2, 'Rato de Hospital','Mistura cura e combate: recupera vida e se fortalece quando preciso.','Sarna-Médico', 25, 40, 30, 45, 180, 230, 55, 75, 25, 40),
(3, 'Rato de Laboratório','Gênio dos experimentos: ganha buffs monstruosos com alto risco — recompensa ou desastre.','Cobaia 07', 45, 65, 45, 65, 160, 200, 65, 85, 15, 30),
(4, 'Rato de Fazenda','Tanque do campo: força bruta e golpes pesados que esmagam a defesa inimiga.','Tratorzinho', 60, 80, 15, 35, 300, 360, 15, 30, 40, 60),
(5, 'Rato de Cassino','Viciado em apostas: trapaças e jogadas de alto risco que podem virar a partida.','Aposta Alta', 35, 55, 50, 75, 150, 190, 50, 70, 20, 30),
(6, 'Rato de Biblioteca','Estratégia fria: lê padrões, reduz defesas e abre janelas para ataques precisos.','Folha-rato', 25, 45, 40, 60, 180, 220, 70, 95, 20, 35);

-- 2. HABILIDADES

-- Habilidades Classe 1: Rato de Esgoto 
INSERT INTO habilidades (id_habilidade, id_classe, nome_habilidade, descricao, chance_sucesso, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(1, 1, 'Leptospirose', '82% de chance de reduzir a DEF do alvo em 20% — 1 rodada. Falha: perde 5% do HP.', 82, '-20%DEFADV', '-5%HPSSEU', 'O cheiro da doença se espalha! A defesa do oponente nesta rodada foi reduzida em 20%.','Autoinfecção! O rato se descuida e perde 5% de HP.'),
(2, 1, 'Nuvem de Lama', '78% de chance de reduzir a AGI do alvo em 25% — 1 rodada. Falha: perde 10% do PA na rodada.', 78, '-25%AGIADV', '-10%PASSEU', 'Uma plasta de lodo atinge o alvo! A agilidade do oponente nesta rodada foi reduzida em 25%.','O rato escorrega na própria lama! Seu PA foi reduzido nesta rodada em 10%.'),
(3, 1, 'Fedor Corrosivo', '70% de chance de causar dano direto igual a 10% do HP máximo do alvo (instantâneo). Falha: perde 8% da DEF na rodada.', 70, '-10%HPSADV', '-8%DEFSEU', 'O ar se torna tóxico! O oponente sofre corrosão e perde 10% do HP.','O fedor vaza para trás! O rato corrói a própria armadura, perdendo 8% de DEF nesta rodada.');

-- Habilidades Classe 2: Rato de Hospital
INSERT INTO habilidades (id_habilidade, id_classe, nome_habilidade, descricao, chance_sucesso, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(4, 2, 'Autocurado', '85% de chance de regenerar 8% do HP máximo (instantâneo). Falha: perde 5% da DEF na rodada.', 85, '+8%HPSSEU', '-5%DEFSEU', 'Injeção aplicada! O rato recupera 8% de HP.','A seringa travou! O rato fica mais frágil: -5% DEF nesta rodada.'),
(5, 2, 'Antisséptico', '75% de chance de ganhar +12% PA e +12% PD — 1 rodada. Falha: perde 6% do HP.', 75, '+12%PASSEU;+12%PDSSEU', '-6%HPSSEU', 'Limpeza total! +12% PA e +12% PD apenas nesta rodada!','Reação alérgica! O antisséptico causa 6% de dano de HP.'),
(6, 2, 'Escudo Antígeno', '70% de chance de ganhar +20% PD — 1 rodada. Falha: perde 8% do HP e -5% DEF na rodada.', 70, '+20%PDSSEU', '-8%HPSSEU;-5%DEFSEU', 'Defesas ativadas! +20% PD apenas nesta rodada!','Sobrecarga imunológica! -8% HP e -5% DEF nesta rodada.');

-- Habilidades Classe 3: Rato de Laboratório
INSERT INTO habilidades (id_habilidade, id_classe, nome_habilidade, descricao, chance_sucesso, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(7, 3, 'Mutação Aguda', '65% de chance de ganhar +25% PA e +20% DEF — 1 rodada. Falha: perde 12% do HP.', 65, '+25%PASSEU;+20%DEFSEU', '-12%HPSSEU', 'Mutação bem-sucedida! +25% PA e +20% DEF apenas nesta rodada!','Mutação instável! O corpo rejeita e o rato perde 12% de HP.'),
(8, 3, 'Soro Experimental', '60% de chance de ganhar +40% de chance crítica — 1 rodada. Falha: perde 10% do HP.', 60, '+40%CRISEU', '-10%HPSSEU', 'O soro funciona! +40% chance crítica nesta rodada!','Reação adversa! O soro é tóxico, o rato perde 10% de HP.'),
(9, 3, 'Durateston', '55% de chance de ganhar +50% PA — 1 rodada. Falha: perde 15% do HP e -10% DEF na rodada.', 55, '+50%PASSEU', '-15%HPSSEU;-10%DEFSEU', 'Explosão de força! +50% PA apenas nesta rodada!','Sobrecarga! -15% HP e -10% DEF nesta rodada.');

-- Habilidades Classe 4: Rato de Fazenda
INSERT INTO habilidades (id_habilidade, id_classe, nome_habilidade, descricao, chance_sucesso, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(10, 4, 'Mordida de Saco', '75% de chance de ganhar +20% PA — 1 rodada. Falha: perde 4% do HP.', 75, '+20%PASSEU', '-4%HPSSEU', 'Ataque focado! +20% PA nesta rodada!','Dente travado! O rato erra e perde 4% de HP.'),
(11, 4, 'Cascavel de Palha', '80% de chance de ganhar +25% DEF — 1 rodada. Falha: perde 15% da AGI na rodada.', 80, '+25%DEFSEU', '-15%AGISEU', 'Entrincheirado! +25% DEF nesta rodada!','Desequilíbrio! -15% AGI apenas nesta rodada.'),
(12, 4, 'Saracoteia Rural', '65% de chance de reduzir a AGI do alvo em 20% e a STR em 15% — 1 rodada. Falha: perde 15% da AGI na rodada.', 65, '-20%AGIADV;-15%STRADV', '-15%AGISEU', 'Dança confusa! O oponente perde 20% AGI e 15% STR nesta rodada!','Tropeção! O rato perde 15% AGI apenas nesta rodada.');

-- Habilidades Classe 5: Rato de Cassino
INSERT INTO habilidades (id_habilidade, id_classe, nome_habilidade, descricao, chance_sucesso, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(13, 5, 'Dado Viciado', '60% de chance de ganhar +35% de chance crítica — 1 rodada. Falha: perde 15% do PA na rodada.', 60, '+35%CRISEU', '-15%PASSEU', 'A sorte sorri! +35% crítico nesta rodada!','Fumble! Os dados saem ruins, -15% PA apenas nesta rodada.'),
(14, 5, 'Trapaceiro', '75% de chance de roubar 8% do HP do oponente (dano + cura instantânea). Falha: perde 10% do HP.', 75, '+8%HPSSEU;-8%HPSADV', '-10%HPSSEU', 'Trapaça perfeita! Rato drena 8% do HP do alvo e ganha a mesma quantidade.','Pego no ato! O rato é punido e perde 10% de HP.'),
(15, 5, 'All-in', '50% de chance de multiplicar o PA por 3.5 (PA x3.5) — 1 rodada. Falha: sofre -50% PD e perde 35% do HP.', 50, '+250%PASSEU', '-50%PDSSEU;-35%HPSSEU', 'Tudo ou nada! PA multiplicado por 3.5 apenas nesta rodada!','Aposta perdida! -50% PD e -35% HP.');

-- Habilidades Classe 6: Rato de Biblioteca
INSERT INTO habilidades (id_habilidade, id_classe, nome_habilidade, descricao, chance_sucesso, efeito_sucesso_str, efeito_falha_str, efetivo_txt, falha_txt) VALUES
(16, 6, 'Mente de Arquivo', '80% de chance de ganhar +30% INT — 1 rodada. Falha: perde 10% da STR na rodada.', 80, '+30%INTSEU', '-10%STRSEU', 'Conhecimento é poder! +30% INT nesta rodada!','Esforço mental! -10% STR apenas nesta rodada.'),
(17, 6, 'Páginas Cortantes', '70% de chance de ignorar 40% da DEF do alvo — 1 rodada. Falha: perde 6% do HP.', 70, '-40%DEFADV', '-6%HPSSEU', 'Corte preciso! Ignora 40% da DEF do oponente nesta rodada!','Página cortante volta contra: -6% HP.'),
(18, 6, 'Mapa das Falhas', '70% de chance de ganhar +15% PA e +15% PD — 1 rodada. Falha: perde 10% da INT na rodada e 5% do HP.', 70, '+15%PASSEU;+15%PDSSEU', '-10%INTSEU;-5%HPSSEU', 'Pontos vitais expostos! +15% PA e +15% PD nesta rodada!','Leitura errada! -10% INT nesta rodada e -5% HP.');

-- Estrutura da loja de pacotes
INSERT INTO loja_Pacotes (nome_pacote, mousecoin_quantidade, preco_brl) VALUES
('Pacote de Moedas Pequeno', 15, 30.00),
('Pacote de Moedas Médio', 30, 60.00),
('Pacote de Moedas Grande', 60, 100.00);

INSERT INTO usuarios (id_usuario, nome, email, senha, tipo_conta, mousecoin_saldo, vitorias, id_foto_perfil)
VALUES(-1, 'ADM', 'ADM', 'ADM', 'ADM', 0, 0, 0);

INSERT INTO usuarios (id_usuario, nome, email, senha, tipo_conta, mousecoin_saldo, vitorias, id_foto_perfil)
VALUES(-2, 'BOT', 'BOT', 'BOT@bot.rinhaderatos.com', 'BOT', 0, 0, 0);

INSERT INTO ratos (
    id_rato, 
    nome_customizado, 
    classe_id, 
    str_base, 
    agi_base, 
    hps_base, 
    int_base, 
    def_base, 
    usuario_id, 
    esta_torneio, 
    esta_vivo, 
    habilidade_id
) VALUES
(-1, 'BOT', 1, 52, 42, 210, 28, 32, -2, false, true, 1),
(-2, 'BOT', 1, 60, 50, 225, 35, 40, -2, false, true, 2),
(-3, 'BOT', 1, 64, 54, 238, 30, 35, -2, false, true, 3),

(-4, 'BOT', 2, 28, 32, 190, 60, 28, -2, false, true, 4),
(-5, 'BOT', 2, 35, 40, 210, 70, 35, -2, false, true, 5),
(-6, 'BOT', 2, 38, 44, 225, 74, 39, -2, false, true, 6),

-- Rato de Laboratório (Classe 3)
(-7, 'BOT', 3, 50, 50, 165, 70, 20, -2, false, true, 7),
(-8, 'BOT', 3, 60, 60, 185, 80, 25, -2, false, true, 8),
(-9, 'BOT', 3, 64, 64, 195, 84, 18, -2, false, true, 9),

-- Rato de Fazenda (Classe 4)
(-10, 'BOT', 4, 65, 20, 310, 20, 45, -2, false, true, 10),
(-11, 'BOT', 4, 75, 30, 340, 25, 55, -2, false, true, 11),
(-12, 'BOT', 4, 79, 18, 358, 18, 58, -2, false, true, 12),

-- Rato de Cassino (Classe 5)
(-13, 'BOT', 5, 40, 60, 160, 55, 22, -2, false, true, 13),
(-14, 'BOT', 5, 50, 70, 175, 65, 28, -2, false, true, 14),
(-15, 'BOT', 5, 54, 74, 185, 68, 25, -2, false, true, 15),

-- Rato de Biblioteca (Classe 6)
(-16, 'BOT', 6, 30, 45, 190, 75, 25, -2, false, true, 16),
(-17, 'BOT', 6, 38, 55, 205, 85, 30, -2, false, true, 17),
(-18, 'BOT', 6, 44, 58, 218, 94, 34, -2, false, true, 18);