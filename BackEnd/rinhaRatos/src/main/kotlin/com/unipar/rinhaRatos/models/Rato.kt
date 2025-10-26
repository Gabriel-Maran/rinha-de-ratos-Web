package com.unipar.rinhaRatos.models

import jakarta.persistence.*

@Entity
@Table(name = "ratos")
class Rato(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id_rato: Long = 0,

    @Column(nullable = false)
    val nome_customizado: String,

    val descricao: String? = null,

    // --- Início das Foreign Keys ---

    /* * Foreign Key 1: id_usuario
     * @ManyToOne: Muitos Ratos podem pertencer a Um Usuario.
     * @JoinColumn: Especifica que esta entidade (Rato) é a "dona" da relação
     * e que a coluna 'id_usuario' nesta tabela é usada para
     * guardar a chave estrangeira.
     */
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    val usuario: Usuario,

    /* * Foreign Key 2: id_classe
     * Muitos Ratos podem ter Uma Classe.
     */
    @ManyToOne
    @JoinColumn(name = "id_classe", nullable = false)
    val classe: Classe,

    /* * Foreign Key 3: id_habilidade_escolhida
     * Muitos Ratos podem ter escolhido Uma Habilidade.
     */
    @ManyToOne
    @JoinColumn(name = "id_habilidade_escolhida", nullable = false)
    val habilidadeEscolhida: Habilidade,

    // --- Fim das Foreign Keys ---

    @Column(nullable = false)
    val str_base: Int,

    @Column(nullable = false)
    val agi_base: Int,

    @Column(nullable = false)
    val hps_base: Int,

    @Column(nullable = false)
    val int_base: Int,

    @Column(nullable = false)
    val def_base: Int,

    @Column(nullable = false)
    var esta_vivo: Boolean = true
)