/* ------------------------------------------------------- PRIMEIRO EXECUTE O BACK END, DEPOIS DE ESTES INSERTS NO PGADMIN -------------------------------------------------------*/

INSERT INTO classes (nome_classe, descricao ,apelido, str_min, str_max, agi_min, agi_max, hps_min, hps_max, int_min, int_max, def_min, def_max) VALUES
('Rato de Esgoto','Sobrevive nas sombras, usando lama e toxinas para corroer defesas; brutal e imprevisível.' ,'O Fedoroso', 55, 70, 35, 55, 50, 65, 20, 40, 35, 50),
('Rato de Hospital','Mistura cura e combate: regenera e protege aliados, sacrificando-se quando preciso.' ,'Sarna-Médico', 25, 40, 30, 50, 55, 70, 50, 70, 30, 45),
('Rato de Laboratório','Explosão experimental: ganha buffs monstruosos com alto risco — recompensa ou desastre.' ,'Cobaia 07', 40, 60, 40, 60, 35, 55, 60, 80, 20, 35),
('Rato de Fazenda','Tanque rústico: força bruta e golpes pesados que esmagam a defesa inimiga.' ,'Tratorzinho', 60, 80, 25, 45, 55, 70, 20, 40, 40, 60),
('Rato de Cassino','Apostador audaz: trapaças e jogadas de alto risco que podem virar a partida.' ,'Aposta Alta', 35, 55, 45, 65, 30, 50, 55, 75, 25, 35),
('Rato de Biblioteca','Estratégia fria: lê padrões, reduz defesas e abre janelas para ataques precisos.' ,'Folha-rato', 30, 50, 45, 60, 35, 55, 65, 90, 25, 35);

INSERT INTO loja_Pacotes (nome_pacote, mousecoin_quantidade, preco_brl) VALUES
('Pacote de Moedas Pequeno', 15, 30.00),
('Pacote de Moedas Médio', 30, 60.00),
('Pacote de Moedas Grande', 60, 100.00);

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
