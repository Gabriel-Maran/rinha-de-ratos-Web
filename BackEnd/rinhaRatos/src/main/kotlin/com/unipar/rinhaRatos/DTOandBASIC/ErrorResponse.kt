package com.unipar.rinhaRatos.DTOandBASIC

data class ErrorResponse (
    val timestamp: String,
    val status: Int,
    val error: String,
    val message: String?,
    val code: String? = null,
)